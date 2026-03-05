"use client";

import { useState, useEffect } from "react";
import { SlackAppShell } from "./SlackAppShell";
import { SlackTodayView } from "./SlackTodayView";
import { SlackSalesView } from "./SlackSalesView";
import { SlackActivityView } from "./SlackActivityView";
import { GlobalDMsView, GENERIC_GLOBAL_DMS } from "./GlobalDMsView";
import { N2A1TodayView } from "./N2A1TodayView";
import { N2A3TodayView } from "./N2A3TodayView";
import { CRMSkillsPanel } from "./CRMSkillsPanel";
import { WorkModePanel } from "@/components/slackbot/WorkModePanel";
import { PRIORITY_PROSPECTS } from "@/data/priorityProspects";
import type { NavView } from "@/app/(demo)/demo/workspace/[workspaceId]/_context/demo-layout-context";
import type { ArcPayloadConfig } from "@/config/demoMetadata";
import type { PriorityProspect } from "@/data/priorityProspects";

type PanelTab = 'crm-skills' | 'messages' | 'history' | 'files' | 'add';

/**
 * Wrapper component that provides DesktopSlackShell-compatible interface
 * but uses SlackAppShell internally. Used for migrating legacy component registries.
 */
interface SlackAppShellWrapperProps {
  defaultNav?: NavView;
  defaultChannelId?: string;
  hideHeader?: boolean; // Ignored - AppHeader always renders in SlackAppShell
  children?: React.ReactNode;
  /** Optional arc-specific payload configuration. If provided, overrides defaultNav and drives sidebar DMs. */
  arcPayload?: ArcPayloadConfig;
  /** Optional callback to advance to next scenario/scene */
  onAdvanceScenario?: () => void;
  /** Flag to enable N2A3 Priority Prospects work mode */
  isN2A3?: boolean;
}

export function SlackAppShellWrapper({
  defaultNav = "today",
  defaultChannelId,
  hideHeader = false,
  children,
  arcPayload,
  onAdvanceScenario,
  isN2A3 = false,
}: SlackAppShellWrapperProps) {

  // Use arcPayload.defaultNavId if provided, otherwise fall back to defaultNav prop
  const initialNavId = arcPayload?.defaultNavId || defaultNav;
  const [activeNavId, setActiveNavId] = useState<NavView>(initialNavId);
  const [activeDmId, setActiveDmId] = useState<string | undefined>(undefined);
  
  // Panel state for N2A1 onboarding
  const [forceSlackbotOpen, setForceSlackbotOpen] = useState(false);
  const [activeSkillsTab, setActiveSkillsTab] = useState<PanelTab>('crm-skills');
  const [todayFeedState, setTodayFeedState] = useState<'default' | 'loading' | 'injected'>('default');

  // Work mode state for N2A3
  const [workModeState, setWorkModeState] = useState<"queue" | "single" | null>(null);
  const [activeProspectIndex, setActiveProspectIndex] = useState(0);

  // Check if this is N2A3 - enable Priority Prospects work mode features
  const shouldShowN2A3View = isN2A3;

  const handleStartWorkMode = () => {
    setWorkModeState("queue");
    setActiveProspectIndex(0);
    setForceSlackbotOpen(true);
  };

  const handleReviewDraft = (prospect: PriorityProspect) => {
    const index = PRIORITY_PROSPECTS.findIndex(p => p.id === prospect.id);
    if (index !== -1) {
      setActiveProspectIndex(index);
      setWorkModeState("single");
      setForceSlackbotOpen(true);
    }
  };

  const handleWorkModeNext = () => {
    if (activeProspectIndex < PRIORITY_PROSPECTS.length - 1) {
      setActiveProspectIndex(activeProspectIndex + 1);
    } else {
      // Finished all prospects
      setWorkModeState(null);
      setForceSlackbotOpen(false);
    }
  };

  const handleWorkModePrevious = () => {
    if (activeProspectIndex > 0) {
      setActiveProspectIndex(activeProspectIndex - 1);
    }
  };

  const handleSendEmail = (prospect: PriorityProspect, emailContent: string) => {
    // Handle sending email - for now just log it
    console.log('Sending email to', prospect.email, ':', emailContent);
    // In a real implementation, this would send the email via API
  };

  const handleReloadToday = () => {
    setTodayFeedState('loading');
    setForceSlackbotOpen(false);
    setTimeout(() => {
      setTodayFeedState('injected');
    }, 1500);
  };

  // Update activeNavId if arcPayload changes
  useEffect(() => {
    if (arcPayload?.defaultNavId) {
      setActiveNavId(arcPayload.defaultNavId);
    }
  }, [arcPayload?.defaultNavId]);

  // Determine which DM list to use: arcPayload.sidebarDms if provided and non-empty, otherwise GENERIC_GLOBAL_DMS
  // Use this same list for both sidebar and GlobalDMsView to ensure consistency
  const dmListToUse = arcPayload?.sidebarDms && arcPayload.sidebarDms.length > 0
    ? arcPayload.sidebarDms
    : (activeNavId === "dms" ? GENERIC_GLOBAL_DMS : undefined);

  // Debug: Log arcPayload when component mounts or changes
  useEffect(() => {
    console.log('[SlackAppShellWrapper] arcPayload:', {
      hasPayload: !!arcPayload,
      hasOnboarding: !!arcPayload?.onboarding,
      defaultNavId: arcPayload?.defaultNavId,
      activeNavId,
    });
  }, [arcPayload, activeNavId]);

  // Render appropriate view component based on activeNavId when no children provided
  const renderContent = () => {
    try {
      if (children) return children;
      
      if (activeNavId === "today") {
        // N2A1-specific routing: if arcPayload has onboarding, render N2A1TodayView
        if (arcPayload?.onboarding) {
          console.log('[SlackAppShellWrapper] Rendering N2A1TodayView with onboarding:', {
            isFirstOpen: arcPayload.onboarding.isFirstOpen,
            skillsCount: arcPayload.onboarding.skills?.length,
          });
          return (
            <N2A1TodayView
              onboarding={arcPayload.onboarding}
              onOpenSkillsPanel={() => {
                setForceSlackbotOpen(true);
                setActiveSkillsTab('crm-skills');
              }}
              showNudge={todayFeedState === 'default'}
              feedState={todayFeedState}
            />
          );
        }
        // N2A3-specific routing: render N2A3TodayView if work mode is enabled or if we should show it
        // For now, we'll always show N2A3TodayView when work mode handlers are available
        // In production, we'd check scene ID or arcPayload flag to identify N2A3
        if (shouldShowN2A3View && !arcPayload?.onboarding) {
          return (
            <N2A3TodayView
              onStartWorkMode={handleStartWorkMode}
              onReviewDraft={handleReviewDraft}
              onNavigateToActivity={() => setActiveNavId("activity")}
            />
          );
        }
        console.log('[SlackAppShellWrapper] Rendering global SlackTodayView (no onboarding)');
        return <SlackTodayView onNavigateToActivity={() => setActiveNavId("activity")} />;
      }
      if (activeNavId === "sales") {
        return <SlackSalesView />;
      }
      if (activeNavId === "activity") {
        return <SlackActivityView />;
      }
      if (activeNavId === "dms") {
        // Use the same dmListToUse that's passed to sidebar for consistency
        return <GlobalDMsView activeDmId={activeDmId} onDmSelect={setActiveDmId} dms={dmListToUse} />;
      }
      
      // For other navs (home, files, etc.), show placeholder
      return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-white">
          <p className="text-gray-400">Content coming soon...</p>
        </div>
      );
    } catch (error) {
      console.error('[SlackAppShellWrapper] Error rendering content:', error);
      return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-white">
          <p className="text-red-500">Error loading content. Check console for details.</p>
        </div>
      );
    }
  };

  const sidebarProps = {
    sidebarActiveDmId: activeNavId === "dms" ? (activeDmId || undefined) : undefined,
    sidebarOnDmSelect: activeNavId === "dms" ? setActiveDmId : undefined,
    sidebarOverrideDms: activeNavId === "dms" ? dmListToUse : undefined,
    sidebarOverrideChannels: arcPayload?.sidebarChannels,
    sidebarApps: arcPayload?.sidebarApps,
  };

  // Bot payload: CRMSkillsPanel for N2A1, WorkModePanel for N2A3, default for others
  const botPayload = arcPayload?.onboarding ? (
    <CRMSkillsPanel
      skills={arcPayload.onboarding.skills}
      activeTab={activeSkillsTab}
      onTabChange={setActiveSkillsTab}
      onReloadToday={handleReloadToday}
      onClose={() => setForceSlackbotOpen(false)}
      onAdvanceScenario={onAdvanceScenario}
    />
  ) : workModeState !== null ? (
    <WorkModePanel
      mode={workModeState}
      activeProspectIndex={activeProspectIndex}
      onNext={handleWorkModeNext}
      onPrevious={handleWorkModePrevious}
      onSendEmail={handleSendEmail}
      onClose={() => {
        setWorkModeState(null);
        setForceSlackbotOpen(false);
      }}
    />
  ) : undefined;

  return (
    <SlackAppShell
      activeNavId={activeNavId}
      onNavChange={setActiveNavId}
      showSidebar={activeNavId !== "today" && activeNavId !== "sales" && activeNavId !== "activity"}
      activeChatId={defaultChannelId}
      botPayload={botPayload}
      forceSlackbotOpen={forceSlackbotOpen}
      onSlackbotToggle={setForceSlackbotOpen}
      {...sidebarProps}
    >
      {renderContent()}
    </SlackAppShell>
  );
}
