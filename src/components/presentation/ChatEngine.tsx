"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { DemoMessageList } from "@/app/(demo)/demo/workspace/[workspaceId]/channel/[channelId]/_components/DemoMessageList";
import { DealCanvasTab } from "@/app/(demo)/demo/workspace/[workspaceId]/channel/[channelId]/_components/DealCanvasTab";
import { useDemoMessages, useDemoData, type DemoMessage } from "@/context/DemoDataContext";
import { MessageInput } from "@/components/shared/MessageInput";
import { ChatMessage } from "@/components/shared/ChatMessage";
import { UniversalChatSurface } from "@/components/shared/UniversalChatSurface";
import { Users, Headphones, Bell, Search } from "lucide-react";
import { getRichMessages, type RichMessage } from "@/lib/rich-message-data";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import { cn } from "@/lib/utils";
import { RITA_DATA, HEALTH_COLORS, type DealHealth } from "@/lib/ritaData";

const T = SLACK_TOKENS;

interface ChatEngineProps {
  channelId: string;
}

// Mock AI responses for auto-reply
const AI_RESPONSES: Record<string, string[]> = {
  slackbot: [
    "I've updated the CRM and flagged the budget objection for your review.",
    "The deal has been moved to the next stage. I'll notify you when the contract is signed.",
    "I've analyzed the pipeline and identified 3 deals that need immediate attention.",
    "The follow-up email has been scheduled for tomorrow at 10 AM.",
  ],
  "sarah-chen": [
    "Thanks for the update! I'll review the proposal and get back to you by EOD.",
    "Got it. Let me check with the team and circle back.",
  ],
  "jordan-hayes": [
    "Perfect timing! I was just about to reach out about this.",
    "I've shared this with the product team. They'll review it this week.",
  ],
  "priya-shah": [
    "This looks great! I'll add it to our sprint planning.",
    "Thanks for flagging this. I'll prioritize it.",
  ],
};

// ─── Helpers for Salesforce tab views ─────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `$${n.toLocaleString()}`;
  return `$${n}`;
}

const ACTIVITY_ICONS: Record<string, string> = {
  email:   "📧",
  call:    "📞",
  doc:     "📄",
  meeting: "🤝",
};

const FILE_ICONS: Record<string, string> = {
  pdf:   "📄",
  doc:   "📝",
  sheet: "📊",
};

function SFCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white rounded-xl overflow-hidden ${className}`}
      style={{ border: "1px solid #E0E0E0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      {children}
    </div>
  );
}

function SFCardHeader({ title, count }: { title: string; count?: string | number }) {
  return (
    <div className="px-5 py-3 flex items-center gap-1.5" style={{ borderBottom: "1px solid #F0F0F0" }}>
      <span className="text-[13px] font-semibold text-gray-800">{title}</span>
      {count !== undefined && <span className="text-[12px] text-gray-400">· {count}</span>}
    </div>
  );
}

function RecordDetailsTab({ channelId }: { channelId: string }) {
  const deal = RITA_DATA.deals.find(d => channelId.startsWith(d.channel));
  if (!deal) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-sm text-gray-400">No Salesforce record linked to this channel.</p>
      </div>
    );
  }
  const { record } = deal;
  const healthColor = HEALTH_COLORS[deal.health as DealHealth];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F8F8] min-h-0"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
    >
      <div className="max-w-2xl mx-auto px-5 py-5 space-y-4">

        {/* Record summary header */}
        <div>
          <h2 className="text-[18px] font-bold text-gray-900 uppercase tracking-wide mb-1">
            {deal.name} — Opportunity
          </h2>
          <div className="flex items-center gap-3 text-[13px] text-gray-600 flex-wrap">
            <span className="text-[20px] font-bold text-gray-900">{fmt(deal.amount)}</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[12px]">{deal.stage}</span>
            <span>Close: {deal.closeDate}</span>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
              style={{ background: healthColor.bg, color: healthColor.text }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: healthColor.dot }} />
              {healthColor.label}
            </span>
          </div>
          <div className="mt-1 text-[12px] text-gray-400">
            Forecast: <span className="text-gray-600 font-medium">{record.forecastCategory}</span>
            {" · "}Probability: <span className="text-gray-600 font-medium">{record.probability}%</span>
          </div>
        </div>

        {/* Key Fields */}
        <SFCard>
          <SFCardHeader title="Key Fields" />
          <div className="grid grid-cols-2 gap-0 divide-y divide-[#F5F5F5]">
            {[
              ["Amount",      fmt(deal.amount)],
              ["Stage",       deal.stage],
              ["Close Date",  deal.closeDate],
              ["Type",        record.type],
              ["Forecast",    record.forecastCategory],
              ["Probability", `${record.probability}%`],
              ["Owner",       record.owner],
              ["Created",     record.created],
              ["Next Step",   deal.nextStep],
              ["Opportunity ID", record.opportunityId],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start gap-2 px-5 py-2.5">
                <span className="text-[12px] text-gray-400 w-28 flex-shrink-0">{label}</span>
                <span className="text-[13px] text-gray-800 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </SFCard>

        {/* Contacts */}
        <SFCard>
          <SFCardHeader title="Contacts" count={record.contacts.length} />
          <div className="divide-y divide-[#F5F5F5]">
            {record.contacts.map((c) => (
              <div key={c.name} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[13px] font-bold text-gray-600 flex-shrink-0">
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-semibold text-gray-900">{c.name}</span>
                    <span className="text-[11px] text-gray-400">{c.title}</span>
                  </div>
                  <div className="text-[11px] text-gray-400">
                    <span className="text-blue-600 font-medium">{c.role}</span>
                    {" · "}Last contact: {c.lastContact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SFCard>

        {/* Activity Timeline */}
        <SFCard>
          <SFCardHeader title="Activity Timeline" count={`${record.activities} activities · ${record.openTasks} open tasks`} />
          <div className="divide-y divide-[#F5F5F5]">
            {record.activityTimeline.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <span className="text-[15px] w-5 flex-shrink-0">{ACTIVITY_ICONS[a.type] || "📋"}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[13px] text-gray-800">{a.label}</span>
                </div>
                <span className="text-[11px] text-gray-400 flex-shrink-0">{a.date}</span>
              </div>
            ))}
            <div className="px-5 py-3">
              <button className="text-[12px] text-blue-600 hover:underline">... show more</button>
            </div>
          </div>
        </SFCard>

        {/* Competitors */}
        {deal.competitors.length > 0 && (
          <SFCard>
            <SFCardHeader title="Competitors" count={deal.competitors.length} />
            <div className="px-5 py-3 space-y-2">
              {deal.competitors.map((c) => (
                <div key={c} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                  <span className="text-[13px] text-gray-700">{c}</span>
                </div>
              ))}
            </div>
          </SFCard>
        )}
      </div>
    </div>
  );
}

function RelatedRecordsTab({ channelId }: { channelId: string }) {
  const deal = RITA_DATA.deals.find(d => channelId.startsWith(d.channel));
  if (!deal) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-sm text-gray-400">No related records for this channel.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F8F8] min-h-0"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
    >
      <div className="max-w-2xl mx-auto px-5 py-5 space-y-4">

        {/* Related Opportunities */}
        {deal.relatedOpportunities.length > 0 ? (
          <SFCard>
            <SFCardHeader title="Related Opportunities" count={deal.relatedOpportunities.length} />
            <div className="divide-y divide-[#F5F5F5]">
              {deal.relatedOpportunities.map((o, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="text-[13px] font-medium text-gray-900">{o.name}</div>
                    <div className="text-[11px] text-gray-400">{o.stage} · {o.date}</div>
                  </div>
                  <span className="text-[13px] font-semibold text-gray-700">{fmt(o.amount)}</span>
                </div>
              ))}
            </div>
          </SFCard>
        ) : (
          <SFCard>
            <SFCardHeader title="Related Opportunities" count={0} />
            <div className="px-5 py-4 text-[13px] text-gray-400">No related opportunities.</div>
          </SFCard>
        )}

        {/* Cases */}
        {deal.cases.length > 0 ? (
          <SFCard>
            <SFCardHeader title="Cases" count={`${deal.cases.length} open`} />
            <div className="divide-y divide-[#F5F5F5]">
              {deal.cases.map((c) => (
                <div key={c.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-medium text-blue-600">{c.id}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">{c.priority}</span>
                  </div>
                  <div className="text-[13px] text-gray-800">{c.title}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Opened: {c.opened} · {c.assignedTo}</div>
                </div>
              ))}
            </div>
          </SFCard>
        ) : (
          <SFCard>
            <SFCardHeader title="Cases" count="0 open" />
            <div className="px-5 py-4 text-[13px] text-gray-400">No open cases.</div>
          </SFCard>
        )}

        {/* Quotes */}
        {deal.quotes.length > 0 && (
          <SFCard>
            <SFCardHeader title="Quotes" count={deal.quotes.length} />
            <div className="divide-y divide-[#F5F5F5]">
              {deal.quotes.map((q) => (
                <div key={q.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[13px] font-medium text-blue-600">{q.id}</span>
                    <span className="text-[13px] font-semibold text-gray-700">{fmt(q.amount)}</span>
                  </div>
                  <div className="text-[12px] text-gray-500">
                    Status: <span className="font-medium text-gray-700">{q.status}</span>
                    {" · "}{q.date}
                  </div>
                  <div className="text-[12px] text-gray-400 mt-0.5">{q.products}</div>
                </div>
              ))}
            </div>
          </SFCard>
        )}

        {/* Files */}
        {deal.files.length > 0 && (
          <SFCard>
            <SFCardHeader title="Files" count={deal.files.length} />
            <div className="divide-y divide-[#F5F5F5]">
              {deal.files.map((f) => (
                <div key={f.name} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <span className="text-[18px] flex-shrink-0">{FILE_ICONS[f.type] || "📎"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-gray-900 truncate">{f.name}</div>
                    <div className="text-[11px] text-gray-400">{f.date} · {f.author}</div>
                  </div>
                </div>
              ))}
            </div>
          </SFCard>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

export function ChatEngine({ channelId }: ChatEngineProps) {
  const currentMessages = useDemoMessages(channelId);
  const [chatMessages, setChatMessages] = useState<DemoMessage[]>(currentMessages);
  const [richMessages, setRichMessages] = useState<RichMessage[]>(getRichMessages(channelId));
  const [activeTab, setActiveTab] = useState<"messages" | "canvas" | "files" | "bookmarks" | "record" | "related">("messages");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef<number>(currentMessages.length);
  const prevChannelIdRef = useRef<string>("");
  const isNearBottomRef = useRef<boolean>(true);
  const { markChannelAsRead, channels, dms } = useDemoData();
  
  // Get channel/DM name for header
  const channel = channels.find((c) => c.id === channelId) ?? dms.find((d) => d.id === channelId);
  const name = channel?.name ?? channelId;
  const isChannel = !!channels.find((c) => c.id === channelId);
  const displayName = isChannel ? `#${name}` : name;
  // deal-acme-q1-strategic keeps its existing Canvas/Files/Bookmarks tabs
  const isAcmeDealRoom = channelId === "deal-acme-q1-strategic";
  // All deal-* channels get the Salesforce Channel badge and tab structure
  const isSalesforceChannel = channelId.startsWith("deal-");
  const isDealRoom = isAcmeDealRoom; // preserve existing isDealRoom usage below
  const tabs = isAcmeDealRoom
    ? [
        { id: "messages" as const, label: "Messages" },
        { id: "canvas" as const, label: "Canvas" },
        { id: "files" as const, label: "Files" },
        { id: "bookmarks" as const, label: "Bookmarks" },
      ]
    : isSalesforceChannel
    ? [
        { id: "messages" as const, label: "Messages" },
        { id: "record" as const, label: "Record Details" },
        { id: "related" as const, label: "Related Records" },
      ]
    : [];

  // Track scroll position to detect if user is near bottom
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      isNearBottomRef.current = isNearBottom;
    }
  };

  // Handle channel changes - scroll to bottom when channel changes
  useEffect(() => {
    const channelChanged = prevChannelIdRef.current !== channelId;
    prevChannelIdRef.current = channelId;
    
    // Update rich messages when channel changes
    if (channelChanged) {
      setRichMessages(getRichMessages(channelId));
    }
    
    if (channelChanged && messagesContainerRef.current) {
      // Channel changed - scroll to bottom immediately
      isNearBottomRef.current = true;
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      });
    }
    
    if (channelId) {
      markChannelAsRead(channelId);
    }
  }, [channelId, markChannelAsRead]);

  // Update messages when messages actually change (based on IDs)
  useEffect(() => {
    const messagesKey = currentMessages.map(m => m.id).join(',');
    const prevKey = chatMessages.map(m => m.id).join(',');
    
    // Only update if messages actually changed
    if (messagesKey !== prevKey) {
      setChatMessages(currentMessages);
    }
  }, [currentMessages, chatMessages]);

  // Auto-scroll to bottom only when new messages are added AND user is at bottom (no animation)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const currentLength = chatMessages.length;
    const prevLength = prevMessagesLengthRef.current;
    const hasNewMessages = currentLength > prevLength;

    if (hasNewMessages && isNearBottomRef.current) {
      // New messages added and user was at bottom - auto-scroll to show new content
      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
    // Otherwise, preserve scroll position - don't touch it
    
    prevMessagesLengthRef.current = currentLength;
  }, [chatMessages]);

  const handleSendMessage = (messageText: string) => {
    if (!messageText.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    // Add user message to both systems
    const userRichMessage: RichMessage = {
      id: `user-${Date.now()}`,
      name: "Rita Patel",
      avatar: "https://randomuser.me/api/portraits/med/women/75.jpg",
      time: timeStr,
      text: messageText.trim(),
    };

    const userDemoMessage: DemoMessage = {
      id: `user-${Date.now()}`,
      author: "Rita Patel",
      authorImage: "https://randomuser.me/api/portraits/med/women/75.jpg",
      timestamp: timeStr,
      body: messageText.trim(),
    };

    setRichMessages((prev) => [...prev, userRichMessage]);
    setChatMessages((prev) => [...prev, userDemoMessage]);

    // Auto-reply after 1.5 seconds
    setTimeout(() => {
      const responses = AI_RESPONSES[channelId] || AI_RESPONSES.slackbot;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const replyTime = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

      const aiRichMessage: RichMessage = {
        id: `ai-${Date.now()}`,
        name: channelId === "slackbot" ? "Slackbot" : "Agentforce",
        avatar: channelId === "slackbot" ? "/slackbot-logo.svg" : "https://randomuser.me/api/portraits/med/men/22.jpg",
        time: replyTime,
        text: randomResponse,
      };

      const aiDemoMessage: DemoMessage = {
        id: `ai-${Date.now()}`,
        author: channelId === "slackbot" ? "Slackbot" : "Agentforce",
        authorImage: channelId === "slackbot" ? "/slackbot-logo.svg" : undefined,
        timestamp: replyTime,
        body: randomResponse,
      };

      setRichMessages((prev) => [...prev, aiRichMessage]);
      setChatMessages((prev) => [...prev, aiDemoMessage]);
    }, 1500);
  };
  
  const handleTabChange = (tab: "messages" | "canvas" | "files" | "bookmarks" | "record" | "related") => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {(isAcmeDealRoom || isSalesforceChannel) && tabs.length > 0 && (
        <div className="shrink-0 flex items-center gap-1 px-4 py-2 border-b bg-white" style={{ borderColor: T.colors.border }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "px-3 py-1 text-[13px] font-medium rounded transition-colors",
                activeTab === tab.id ? "" : "hover:bg-[#f8f8f8]"
              )}
              style={
                activeTab === tab.id
                  ? { color: T.colors.text, backgroundColor: T.colors.backgroundAlt }
                  : { color: T.colors.textSecondary }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      {isDealRoom && activeTab === "canvas" ? (
        <DealCanvasTab />
      ) : activeTab === "record" ? (
        <RecordDetailsTab channelId={channelId} />
      ) : activeTab === "related" ? (
        <RelatedRecordsTab channelId={channelId} />
      ) : (
        <UniversalChatSurface
          title={
            <>
              <span className="text-gray-400 font-normal">{isChannel ? '#' : ''}</span>
              {name}
            </>
          }
          icon={isChannel ? <span className="text-xl">#</span> : undefined}
          memberCount={(channel as any)?.memberCount || 8455}
          placeholder={`Message ${displayName}`}
          onSendMessage={handleSendMessage}
        >
          {/* Render rich messages if available, otherwise fall back to DemoMessageList */}
          {richMessages.length > 0 ? (
            <>
              {richMessages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </>
          ) : (
            <DemoMessageList messages={chatMessages} channelId={channelId} />
          )}
        </UniversalChatSurface>
      )}
    </div>
  );
}
