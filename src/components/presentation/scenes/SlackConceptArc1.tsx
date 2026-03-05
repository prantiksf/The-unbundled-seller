"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SlackAppShell, useActiveChat } from "../SlackAppShell";
import { Arc1SlackThread } from "./Arc1SlackThread";
import { Arc1AgentforcePanel } from "./Arc1AgentforcePanel";
import { ChatEngine } from "../ChatEngine";
import { SlackTodayView } from "../SlackTodayView";
import { SlackSalesView } from "../SlackSalesView";
import { SlackActivityView } from "../SlackActivityView";
import { useArcNavigation } from "@/context/ArcNavigationContext";
import { useDemoData } from "@/context/DemoDataContext";
import type { SlackBlock } from "@/components/block-kit/BlockKitRenderer";
import type { NavView, DemoContext } from "@/app/(demo)/demo/workspace/[workspaceId]/_context/demo-layout-context";

// ────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────
type Screen = 1 | 2 | 3 | 4 | 5;

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content?: string;
  blocks?: SlackBlock[];
  timestamp: Date;
}

type PanelFeedItemType =
  | "greeting"
  | "loading"
  | "planner"
  | "confirmation"
  | "next-steps"
  | "heatmap"
  | "stakeholder-insights"
  | "activities";

interface PanelFeedItem {
  id: string;
  type: PanelFeedItemType;
  data?: { stepperValue?: number };
}

// ────────────────────────────────────────────────────────────────────
// Arc1ConditionalChat — extracted to module level (not nested inside
// SlackConceptArc1) per the Zero-Amnesia / Component Extraction rules.
// ────────────────────────────────────────────────────────────────────
interface Arc1ConditionalChatProps {
  primaryNav: NavView;
  activeChatId: string;
  restartKey: number;
  currentScreen: Screen;
  stepperValue: number;
  selectedIntent: string | null;
  messages: ChatMessage[];
  onIntentSelect: (intent: string) => void;
  onApprove: () => void;
  onQuickPrompt: (prompt: string) => void;
  onMessageSend: (message: string) => void;
  onNavigateToDealRoom: (channelId: string) => void;
}

function Arc1ConditionalChat({
  primaryNav,
  activeChatId: localActiveChatId,
  restartKey,
  currentScreen,
  stepperValue,
  selectedIntent,
  messages,
  onIntentSelect,
  onApprove,
  onQuickPrompt,
  onMessageSend,
  onNavigateToDealRoom,
}: Arc1ConditionalChatProps) {
  const { activeChatId: contextActiveChatId, setActiveChatId } = useActiveChat();

  // Sync deal-room navigation into the shell's context
  useEffect(() => {
    if (
      primaryNav === "activity" &&
      localActiveChatId === "deal-acme-q1-strategic" &&
      contextActiveChatId !== "deal-acme-q1-strategic"
    ) {
      setActiveChatId("deal-acme-q1-strategic");
    }
  }, [primaryNav, localActiveChatId, contextActiveChatId, setActiveChatId]);

  if (primaryNav === "dms") {
    const selectedDM = contextActiveChatId || "slackbot";
    if (selectedDM === "slackbot") {
      return (
        <Arc1SlackThread
          key={`slack-thread-${restartKey}`}
          currentScreen={currentScreen}
          stepperValue={stepperValue}
          selectedIntent={selectedIntent}
          messages={messages}
          onIntentSelect={onIntentSelect}
          onApprove={onApprove}
          onQuickPrompt={onQuickPrompt}
          onMessageSend={onMessageSend}
        />
      );
    }
    return <ChatEngine key={selectedDM} channelId={selectedDM} />;
  }

  const channelIdToShow = contextActiveChatId || localActiveChatId;
  return <ChatEngine channelId={channelIdToShow} />;
}

// ────────────────────────────────────────────────────────────────────
// Initial welcome messages — defined once at module level to avoid
// recreating the array on every render.
// ────────────────────────────────────────────────────────────────────
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-q4",
    role: "bot",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Good morning Rita. Q4 wrapped: *$471K attained* (94% of $500K quota). Win rate 52% ↑ from Q3. Here's your Q1 snapshot.",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "⚠️ *You missed your accelerator by $29K last quarter.*\nThat was $4.2K in commission left on the table.",
        },
      },
    ],
    timestamp: new Date(),
  },
];

// ────────────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────────────
interface SlackConceptArc1Props {
  demoContext?: DemoContext;
}

// ────────────────────────────────────────────────────────────────────
// SlackConceptArc1 — the Arc 1 Payload
//
// Owns all Arc 1 state and routes. Wraps itself in <SlackAppShell>
// and passes the right view as children for each nav state.
// ────────────────────────────────────────────────────────────────────
export function SlackConceptArc1({ demoContext = "N2A2" }: SlackConceptArc1Props) {
  const arcNavigation = useArcNavigation();
  const currentScreen = (arcNavigation.arcState.screen || 1) as Screen;

  const [stepperValue, setStepperValue] = useState<number>(500000);
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelFeed, setPanelFeed] = useState<PanelFeedItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  // Primary nav — full NavView so any rail click (today, sales, home, etc.) is honoured
  const [primaryNav, setPrimaryNav] = useState<NavView>("activity");
  const [showDMBadge, setShowDMBadge] = useState(false);

  const { channels } = useDemoData();
  const initialChannelId =
    channels.find((c) => c.id === "deal-runners")?.id || channels[0]?.id || "general";
  const [activeChatId, setActiveChatId] = useState<string>(initialChannelId);
  
  // Get context setter to sync DM selection to context
  const { setActiveChatId: setContextActiveChatId } = useActiveChat();
  
  // Sync local activeChatId to context when it changes (for DM selection)
  useEffect(() => {
    if (primaryNav === "dms" && activeChatId) {
      setContextActiveChatId(activeChatId);
    }
  }, [primaryNav, activeChatId, setContextActiveChatId]);

  const [restartKey, setRestartKey] = useState(0);
  const prevRestartCounterRef = useRef<number>(0);

  // Show DM badge after 2.5 s (AI finishing work)
  useEffect(() => {
    const timer = setTimeout(() => setShowDMBadge(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // ── Reset ─────────────────────────────────────────────────────
  const resetArc1State = useCallback(() => {
    setStepperValue(500000);
    setSelectedIntent(null);
    setIsPanelOpen(false);
    setPanelFeed([]);
    setPrimaryNav("activity");
    setShowDMBadge(false);
    setActiveChatId(initialChannelId);
    setRestartKey((prev) => prev + 1);
    setMessages(INITIAL_MESSAGES);
    setTimeout(() => setShowDMBadge(true), 2500);
  }, [initialChannelId]);

  useEffect(() => {
    const { arc, screen } = arcNavigation.arcState;
    const current = arcNavigation.restartCounter;
    const prev = prevRestartCounterRef.current;
    if (arc === 1 && screen === 1 && current !== prev) {
      resetArc1State();
    }
    prevRestartCounterRef.current = current;
  }, [arcNavigation.restartCounter, arcNavigation.arcState.arc, arcNavigation.arcState.screen, resetArc1State]);

  // ── Navigation ────────────────────────────────────────────────
  // Arc1-specific side-effects when switching between the two main narrative routes.
  const handlePrimaryNavChange = (nav: "activity" | "dms") => {
    setPrimaryNav(nav);
    if (nav === "dms") {
      setShowDMBadge(false);
      setActiveChatId("slackbot");
      setMessages(INITIAL_MESSAGES);
      arcNavigation.setArcState({ arc: 1, screen: 1 });
    } else {
      setActiveChatId(initialChannelId);
    }
  };

  // ── Intent / CTA handlers ─────────────────────────────────────
  const handleIntentSelect = (intent: string) => {
    setSelectedIntent(intent);
    if (intent === "🎯 Plan my Q1 commit" || intent === "🎯 Plan my Q1") {
      setIsPanelOpen(true);
      setPanelFeed([{ id: "loading-1", type: "loading" as PanelFeedItemType }]);
      arcNavigation.setArcState({ arc: 1, screen: 2 });
    }
  };

  const handleScreenChange = (screen: Screen) => {
    arcNavigation.setArcState({ arc: 1, screen });
  };

  const handleLoadingComplete = useCallback(() => {
    setPanelFeed((prev) => {
      if (prev.some((item) => item.type === "planner")) return prev;
      return [
        ...prev.filter((item) => item.type !== "loading"),
        { id: "planner-1", type: "planner" as PanelFeedItemType, data: { stepperValue } },
      ];
    });
    arcNavigation.setArcState({ arc: 1, screen: 3 });
  }, [stepperValue]);

  const handleApprove = () => {
    setPanelFeed((prev) => [
      ...prev,
      { id: "confirmation-1", type: "confirmation" as PanelFeedItemType, data: { stepperValue } },
    ]);
    arcNavigation.setArcState({ arc: 1, screen: 4 });
  };

  const handleChecklistComplete = useCallback(() => {
    setPanelFeed((prev) => {
      if (prev.some((item) => item.type === "next-steps")) return prev;
      const next: PanelFeedItem[] = [
        ...prev,
        { id: "next-steps-1", type: "next-steps" as PanelFeedItemType, data: { stepperValue } },
      ];
      setTimeout(() => window.dispatchEvent(new CustomEvent("scroll-to-next-steps")), 200);
      return next;
    });
    arcNavigation.setArcState({ arc: 1, screen: 5 });
  }, [stepperValue]);

  const handleReviewHeatmap = useCallback(() => {
    setPanelFeed((prev) => {
      if (prev.some((item) => item.type === "stakeholder-insights")) return prev;
      return [
        ...prev,
        { id: "acme-stakeholder-insights", type: "stakeholder-insights" as PanelFeedItemType, data: { stepperValue } },
      ];
    });
  }, [stepperValue]);

  const handleEnterDealRoom = useCallback(() => {
    setPrimaryNav("activity");
    setActiveChatId("deal-acme-q1-strategic");
  }, []);

  const handleViewActivities = useCallback(() => {
    setPanelFeed((prev) => {
      if (prev.some((item) => item.type === "activities")) return prev;
      return [
        ...prev,
        { id: "acme-activities", type: "activities" as PanelFeedItemType, data: { stepperValue } },
      ];
    });
  }, [stepperValue]);

  const handleQuickPrompt = (prompt: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content: prompt, timestamp: new Date() },
    ]);
  };

  const handleMessageSend = (message: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content: message, timestamp: new Date() },
    ]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "bot",
          content: "I'm here to help with your Q1 planning. What would you like to know?",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  // ── Derived shell props ───────────────────────────────────────
  // Arc1 only uses activity and dms; full-width views are handled below.
  const activeNavId: NavView = primaryNav;

  // Match legacy shell behavior: today/sales/activity are full-width,
  // all other navs (home/files/later/agentforce/more/dms) use sidebar+chat.
  // EXCEPTION: When viewing a deal room channel from activity tab, show sidebar
  const isSidebarNav =
    primaryNav !== "today" &&
    primaryNav !== "sales" &&
    (primaryNav !== "activity" || activeChatId === "deal-acme-q1-strategic");

  // Agentforce panel is the botPayload when open
  const botPayload = isPanelOpen ? (
    <Arc1AgentforcePanel
      currentScreen={currentScreen}
      panelFeed={panelFeed}
      stepperValue={stepperValue}
      onStepperChange={setStepperValue}
      onApprove={handleApprove}
      onLoadingComplete={handleLoadingComplete}
      onChecklistComplete={handleChecklistComplete}
      onEnterDealRoom={handleEnterDealRoom}
      onReviewHeatmap={handleReviewHeatmap}
      onViewActivities={handleViewActivities}
      onMessageSend={handleMessageSend}
      onScreenChange={handleScreenChange}
      onQuickPrompt={handleQuickPrompt}
      onClose={() => {
        setIsPanelOpen(false);
        setPanelFeed([]);
      }}
    />
  ) : undefined;

  // ── Render ────────────────────────────────────────────────────
  return (
    <SlackAppShell
      activeNavId={activeNavId}
      onNavChange={(nav) => {
        if (nav === "activity" || nav === "dms") {
          // Arc1-specific side effects: badge clear, chatId reset, arc state
          handlePrimaryNavChange(nav);
        } else {
          // Non-arc1 navs (today, sales, home, etc.) — just switch the view
          setPrimaryNav(nav);
        }
      }}
      showSidebar={isSidebarNav}
      botPayload={botPayload}
      forceSlackbotOpen={isPanelOpen}
      onSlackbotToggle={(isOpen) => {
        setIsPanelOpen(isOpen);
        if (!isOpen) setPanelFeed([]);
      }}
      demoContext={demoContext}
      activeChatId={activeChatId}
      onChatChange={setActiveChatId}
      showDMBadge={showDMBadge}
      onPrimaryNavChange={handlePrimaryNavChange}
      sidebarActiveDmId={primaryNav === "dms" ? (activeChatId || undefined) : undefined}
      sidebarOnDmSelect={primaryNav === "dms" ? (id: string) => {
        setActiveChatId(id);
        // Sync to context immediately so Arc1ConditionalChat can read it
        setContextActiveChatId(id);
      } : undefined}
    >
      {/* ── Full-width views ── */}
      {primaryNav === "today" && (
        <SlackTodayView onNavigateToActivity={() => handlePrimaryNavChange("activity")} />
      )}
      {primaryNav === "sales" && <SlackSalesView />}

      {/* ── Activity view (full-width, no sidebar) ── */}
      {/* If activeChatId is set to a deal room, show ChatEngine instead of ActivityView */}
      {primaryNav === "activity" && activeChatId === "deal-acme-q1-strategic" ? (
        <ChatEngine channelId={activeChatId} />
      ) : primaryNav === "activity" ? (
        <SlackActivityView />
      ) : null}

      {/* ── Sidebar+chat routes (DMs/Home/Files/Later/Agentforce/More) ── */}
      {primaryNav !== "today" &&
        primaryNav !== "sales" &&
        primaryNav !== "activity" && (
        <Arc1ConditionalChat
          primaryNav={primaryNav}
          activeChatId={activeChatId}
          restartKey={restartKey}
          currentScreen={currentScreen}
          stepperValue={stepperValue}
          selectedIntent={selectedIntent}
          messages={messages}
          onIntentSelect={handleIntentSelect}
          onApprove={handleApprove}
          onQuickPrompt={handleQuickPrompt}
          onMessageSend={handleMessageSend}
          onNavigateToDealRoom={setActiveChatId}
        />
      )}
    </SlackAppShell>
  );
}
