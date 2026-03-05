"use client";

import { useState, useEffect, useRef } from "react";
import { MoreHorizontal, ChevronRight, CheckCircle2, RefreshCw } from "lucide-react";
import { RITA_DATA, HEALTH_COLORS } from "@/lib/ritaData";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingNudgeCard } from "./OnboardingNudgeCard";
import type { OnboardingData } from "@/data/onboardingData";

// ── Panel state — tracks both the panel type and the specific deal it was triggered from ──
type ActivePanel =
  | { type: "prep"; dealId: string; meetingTime: string }
  | { type: "risks" }
  | { type: "quotes" }
  | { type: "action-items" }
  | null;

function Avatar({ initials, color = "#E8D5F5" }: { initials: string; color?: string }) {
  return (
    <div
      className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold text-gray-700 flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

const AVATAR_COLORS: Record<string, string> = {
  PS: "#DBEAFE",
  SC: "#D1FAE5",
  DT: "#FEF3C7",
  MT: "#FCE7F3",
  JH: "#EDE9FE",
};

// ── Generates a deal-specific prep brief from RITA_DATA ───────────────────────
function buildPrepContent(dealId: string, meetingTime: string) {
  const deal = RITA_DATA.deals.find(d => d.id === dealId);
  if (!deal) return null;

  const healthLabel = HEALTH_COLORS[deal.health].label;

  const configs: Record<string, {
    heading: string;
    userMsg: string;
    botMsg: string;
    fields: { label: string; value: string }[];
    risk?: string;
    rec: string;
    actions: string[];
  }> = {
    "deal-acme": {
      heading: `Meeting Brief · Acme Corp · ${meetingTime}`,
      userMsg: `Prep me for the Acme Corp call at ${meetingTime}.`,
      botMsg: "Pulled the latest from Salesforce. Here's what you need to know:",
      fields: [
        { label: "Amount",        value: "$89,000 · Negotiation · Feb 28" },
        { label: "Champion",      value: "Priya Shah (VP Engineering)" },
        { label: "Last touch",    value: "Dec 28 · Email — proposal follow-up" },
        { label: "Open ask",      value: "Volume discount on 3yr term" },
        { label: "Sentiment",     value: "78% — Cooling" },
      ],
      risk: "⚠️ Daniel Kim (CTO) calendar cleared through January. Champion path is at risk.",
      rec: "Lead with Priya. Ask her directly: 'Can you be the internal champion for the exec path?' Propose Jan 8 intro via Sarah.",
      actions: ["Draft talking points", "Update next step in CRM", "Schedule exec intro"],
    },
    "deal-greentech": {
      heading: `Meeting Brief · Greentech · ${meetingTime}`,
      userMsg: `What should I discuss at lunch with Diane Park at ${meetingTime}?`,
      botMsg: "Greentech is your cleanest deal. Here's the context for the lunch:",
      fields: [
        { label: "Amount",        value: "$60,000 · Proposal · Mar 15" },
        { label: "Champion",      value: "Diane Park (CIO) — also Decision Maker" },
        { label: "Last touch",    value: "Dec 30 · Lunch — relationship building" },
        { label: "Next step",     value: "SOW review scheduled Jan 8" },
        { label: "Sentiment",     value: "82% — On Track" },
      ],
      rec: "Keep it relationship-focused. Confirm the Jan 8 SOW timeline. Ask if Tom Reeves (VP Ops) needs any additional materials before then.",
      actions: ["View SOW draft", "Draft recap email for after lunch", "Ping Priya Shah (SE) for prep"],
    },
    "deal-novacorp": {
      heading: `Legal Brief · NovaCorp · ${meetingTime}`,
      userMsg: `Prep me for the NovaCorp legal sync at ${meetingTime}.`,
      botMsg: "NovaCorp is 3 days overdue on redlines. Here's the situation:",
      fields: [
        { label: "Amount",        value: "$45,000 · Legal Review · Jan 31" },
        { label: "Champion",      value: "Marcus Lee (Head of Procurement)" },
        { label: "Legal contact", value: "Sandra Nguyen (General Counsel)" },
        { label: "Issue",         value: "Clause 7.2 — non-standard indemnification" },
        { label: "Last touch",    value: "Dec 22 · Contract sent" },
      ],
      risk: "⚠️ Close date Jan 31 is 29 days away. No legal response in 10 days. Escalation risk.",
      rec: "Come with pre-approved alternative language for clause 7.2. Ask Marcus for a 'by end of this week' commitment from Sandra.",
      actions: ["View MSA clause 7.2", "Draft escalation email to Marcus", "Update close date risk in CRM"],
    },
    "deal-sporty": {
      heading: `Discovery Brief · Sporty Nation · ${meetingTime}`,
      userMsg: `Prep me for the Sporty Nation call at ${meetingTime}.`,
      botMsg: "Sporty Nation has gone silent. Here's what I know:",
      fields: [
        { label: "Amount",        value: "$270,000 · Discovery · Mar 31" },
        { label: "Champion",      value: "Unknown — champion silent 14 days" },
        { label: "Decision Maker", value: "Chris Park (VP Digital)" },
        { label: "Last touch",    value: "Dec 18 · Discovery call" },
        { label: "Sentiment",     value: "32% — At Risk" },
      ],
      risk: "⚠️ 14 days silent. Champion gone dark. Deal at risk of slipping.",
      rec: "Escalate to Chris Park (VP Digital). Ask directly: 'Is this still a priority for Q1?' Offer to reset the conversation.",
      actions: ["Draft escalation email to Chris Park", "Update risk status in CRM", "Schedule follow-up call"],
    },
  };

  return configs[dealId] || null;
}

// ── Focus Prompt Pill ─────────────────────────────────────────────────────────
function FocusPill({ onClick, icon, iconBg, label, restGradient, colors }: {
  onClick: () => void;
  icon: string;
  iconBg: string;
  label: string;
  restGradient: string;
  colors: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative p-[1.5px] rounded-2xl w-full cursor-pointer overflow-hidden"
      style={{ boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.12)" : "none" }}
    >
      {/* Resting border — static gradient, visible at rest */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{ background: restGradient, opacity: hovered ? 0 : 0.5 }}
      />
      {/* Spinning conic-gradient square — fixed size ensures full coverage on wide pills */}
      <div
        className="absolute transition-opacity duration-300"
        style={{
          top: "50%",
          left: "50%",
          width: "800px",
          height: "800px",
          transform: "translate(-50%, -50%)",
          background: `conic-gradient(${colors})`,
          animation: hovered ? "spin-border 3s linear infinite" : "none",
          opacity: hovered ? 1 : 0,
        }}
      />
      <div className="relative flex items-center justify-between p-4 bg-white rounded-[calc(1rem-1.5px)] h-full overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0 text-xl`}>{icon}</div>
          <span className="text-sm font-medium text-gray-800 leading-snug break-words min-w-0">{label}</span>
        </div>
        {hovered && (
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all whitespace-nowrap flex-shrink-0 ml-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/slackbot-logo.svg" alt="" className="w-4 h-4" />
            Ask
          </button>
        )}
      </div>
    </div>
  );
}

// ── Per-meeting card ──────────────────────────────────────────────────────────
interface AgendaItemProps {
  title: string;
  subtitle?: string;
  dotColor?: string;
  time: string;
  badgeText?: string;
  badgeColor?: string;
  barColor: string;
  isNow?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  isMeeting?: boolean;
  onPrep: () => void;
}

function AgendaItem({
  title, subtitle, dotColor, time, badgeText, badgeColor,
  barColor, isNow = false, icon: Icon, isMeeting = false, onPrep,
}: AgendaItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex items-center p-3.5 border rounded-2xl shadow-sm transition-all cursor-pointer ${
        isNow
          ? "bg-[#eefcf4] border-[#d1f4e0]"
          : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md"
      }`}
      onClick={onPrep}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1 max-w-[calc(100%-100px)]">
        <div className={`w-1 h-5 rounded-full mt-0.5 flex-shrink-0 ${barColor}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-gray-900 truncate">{title}</span>
            {badgeText && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0 ${badgeColor}`}>
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-500 font-medium">
              {dotColor && <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />}
              <span className="truncate">{subtitle}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center w-[100px] justify-end flex-shrink-0 pl-2">
        {!hovered ? (
          <div className="flex items-center gap-1.5 text-gray-600">
            <span className="text-[12px] tabular-nums text-gray-500">{time}</span>
            {Icon && <Icon className="" />}
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onPrep(); }}
            className="px-3 py-1 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all whitespace-nowrap"
          >
            {isMeeting ? "Prep" : "Ask"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Meeting type icons ────────────────────────────────────────────────────────
function MeetIcon({ className }: { className?: string }) {
  const [imageError, setImageError] = useState(false);
  
  if (imageError) {
    return (
      <svg className={`flex-shrink-0 ${className ?? ""}`} viewBox="0 0 24 24" fill="none" style={{ width: 24, height: 24 }}>
        <rect x="2" y="6" width="20" height="12" rx="2" stroke="#5F6368" strokeWidth="1.5" fill="none" />
        <path d="M8 2v4M16 2v4" stroke="#5F6368" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 10h20" stroke="#5F6368" strokeWidth="1.5" />
        <circle cx="12" cy="14" r="2" fill="#5F6368" />
        <path d="M8 14l2-2 2 2 2-2" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  
  return (
    <img
      src={"/Google Meet.png".replace(/ /g, "%20")}
      alt="Google Meet"
      className={`flex-shrink-0 ${className ?? ""}`}
      style={{ width: 24, height: 24, objectFit: 'contain' }}
      onError={() => setImageError(true)}
    />
  );
}

function CalIcon({ className }: { className?: string }) {
  return (
    <svg className={`flex-shrink-0 ${className ?? ""}`} viewBox="0 0 24 24" fill="none" style={{ width: 16, height: 16 }}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#5F6368" strokeWidth="1.5" fill="none" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="#5F6368" strokeWidth="1.5" />
      <circle cx="12" cy="16" r="1" fill="#5F6368" />
    </svg>
  );
}

type InjectedCardId = "morning-briefing" | "risk-radar" | "auto-log";

interface InjectedCardLayout {
  id: InjectedCardId;
  col: 1 | 2;
  order: number;
  hidden: boolean;
}

interface InjectedCardHeaderProps {
  id: InjectedCardId;
  col: 1 | 2;
  icon: string;
  title: string;
  isMenuOpen: boolean;
  onToggleMenu: (id: InjectedCardId) => void;
  onCloseMenu: () => void;
  onMoveDown: (id: InjectedCardId) => void;
  onMoveColumn: (id: InjectedCardId, targetCol: 1 | 2) => void;
  onHide: (id: InjectedCardId) => void;
  bgClass?: string;
  textClass?: string;
  borderClass?: string;
}

function InjectedCardHeader({
  id,
  col,
  icon,
  title,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  onMoveDown,
  onMoveColumn,
  onHide,
  bgClass = "bg-gray-50",
  textClass = "text-gray-900",
  borderClass = "border-gray-100",
}: InjectedCardHeaderProps) {
  return (
    <div className={`px-5 py-3 border-b ${borderClass} flex items-center gap-3 relative`}>
      <div className={`w-7 h-7 rounded-lg ${bgClass} border ${borderClass} flex items-center justify-center text-sm`}>{icon}</div>
      <h3 className={`font-bold text-[14px] ${textClass}`}>{title}</h3>

      <div className="ml-auto flex items-center gap-1">
        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Reload data">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>

        <div className="relative">
          <button onClick={() => onToggleMenu(id)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors" title="More actions">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={onCloseMenu} />
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Section location</div>
                <button onClick={() => onMoveDown(id)} className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-blue-700">Move section down</button>
                <button onClick={() => onMoveColumn(id, col === 1 ? 2 : 1)} className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-blue-700">Move to {col === 1 ? "second" : "first"} column</button>
                <div className="h-px bg-gray-100 my-1" />
                <button onClick={() => onHide(id)} className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-red-50 hover:text-red-700">Hide section</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface InjectedSkillCardProps {
  cardId: InjectedCardId;
  col: 1 | 2;
  isMenuOpen: boolean;
  onToggleMenu: (id: InjectedCardId) => void;
  onCloseMenu: () => void;
  onMoveDown: (id: InjectedCardId) => void;
  onMoveColumn: (id: InjectedCardId, targetCol: 1 | 2) => void;
  onHide: (id: InjectedCardId) => void;
}

function InjectedSkillCard({
  cardId,
  col,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  onMoveDown,
  onMoveColumn,
  onHide,
}: InjectedSkillCardProps) {
  if (cardId === "morning-briefing") {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-visible mb-6 animate-in slide-in-from-top-4 fade-in">
        <InjectedCardHeader
          id={cardId}
          icon="📍"
          title="Morning Briefing"
          col={col}
          isMenuOpen={isMenuOpen}
          onToggleMenu={onToggleMenu}
          onCloseMenu={onCloseMenu}
          onMoveDown={onMoveDown}
          onMoveColumn={onMoveColumn}
          onHide={onHide}
        />
        <div className="p-3 space-y-0.5">
          {/* Row 1: Positive Action */}
          <div className="group/row flex items-start justify-between p-2.5 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2BAC76] mt-1.5 flex-shrink-0"></div>
              <div>
                <div className="text-[13px] text-gray-900 font-bold mb-0.5">Acme Health · $180K</div>
                <div className="text-[12px] text-gray-600">⚡ Legal approved redlines 10m ago. Ready for signature.</div>
              </div>
            </div>
            <button className="opacity-0 group-hover/row:opacity-100 flex-shrink-0 ml-4 px-3 py-1 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all whitespace-nowrap">Review & Send</button>
          </div>
          
          {/* Row 2: Warning Action */}
          <div className="group/row flex items-start justify-between p-2.5 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F2C744] mt-1.5 flex-shrink-0"></div>
              <div>
                <div className="text-[13px] text-gray-900 font-bold mb-0.5">TechStart · $95K</div>
                <div className="text-[12px] text-gray-600">⚠️ Champion (David) updated LinkedIn: moved to new role.</div>
              </div>
            </div>
            <button className="opacity-0 group-hover/row:opacity-100 flex-shrink-0 ml-4 px-3 py-1 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all whitespace-nowrap">Find New Contacts</button>
          </div>

          {/* Row 3: Prep Action */}
          <div className="group/row flex items-start justify-between p-2.5 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2BAC76] mt-1.5 flex-shrink-0"></div>
              <div>
                <div className="text-[13px] text-gray-900 font-bold mb-0.5">NovaCorp · $120K</div>
                <div className="text-[12px] text-gray-600">📅 Discovery Call at 2:30 PM. Competitor 'Apex' heavily involved.</div>
              </div>
            </div>
            <button className="opacity-0 group-hover/row:opacity-100 flex-shrink-0 ml-4 px-3 py-1 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all whitespace-nowrap">View Prep Brief</button>
          </div>
        </div>
      </div>
    );
  }

  if (cardId === "risk-radar") {
    return (
      <div className="bg-white border border-red-200 rounded-xl shadow-sm overflow-visible mb-6 relative animate-in slide-in-from-top-4 fade-in">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#E01E5A] rounded-l-xl"></div>
        <InjectedCardHeader
          id={cardId}
          icon="🔍"
          title="Risk Radar"
          bgClass="bg-red-50"
          borderClass="border-red-100"
          col={col}
          isMenuOpen={isMenuOpen}
          onToggleMenu={onToggleMenu}
          onCloseMenu={onCloseMenu}
          onMoveDown={onMoveDown}
          onMoveColumn={onMoveColumn}
          onHide={onHide}
        />
        <div className="p-3 space-y-0.5">
          {/* Risk 1 */}
          <div className="group/row flex items-start justify-between p-2.5 hover:bg-red-50/50 rounded-lg transition-colors cursor-pointer">
            <div className="flex-1 pr-4">
              <div className="text-[13px] text-gray-900 font-bold mb-1">Meridian · $60K At Risk</div>
              <p className="text-[12px] text-gray-700 leading-relaxed">11 days no response from Priya. Gong sentiment dropped 24% in last call. Mentioned budget freezes.</p>
            </div>
            <button className="opacity-0 group-hover/row:opacity-100 flex-shrink-0 px-3 py-1 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all whitespace-nowrap">Draft Reactivation</button>
          </div>
          {/* Risk 2 */}
          <div className="group/row flex items-start justify-between p-2.5 hover:bg-red-50/50 rounded-lg transition-colors cursor-pointer">
            <div className="flex-1 pr-4">
              <div className="text-[13px] text-gray-900 font-bold mb-1">Sporty Nation · $270K At Risk</div>
              <p className="text-[12px] text-gray-700 leading-relaxed">Economic Buyer (CFO) hasn't opened the Highspot pricing proposal sent 3 days ago.</p>
            </div>
            <button className="opacity-0 group-hover/row:opacity-100 flex-shrink-0 px-3 py-1 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all whitespace-nowrap">Ping Champion</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-visible mb-6 animate-in slide-in-from-top-4 fade-in">
      <InjectedCardHeader
        id={cardId}
        icon="⚡"
        title="Auto-Log & Follow-Up"
        col={col}
        isMenuOpen={isMenuOpen}
        onToggleMenu={onToggleMenu}
        onCloseMenu={onCloseMenu}
        onMoveDown={onMoveDown}
        onMoveColumn={onMoveColumn}
        onHide={onHide}
      />
      <div className="p-3 space-y-0.5">
        {/* Log 1 */}
        <div className="group/row flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">GO</div>
            <div>
              <div className="text-[13px] text-gray-900 font-bold">Acme Corp Sync</div>
              <div className="text-[12px] text-gray-600">Action items extracted. Follow-up drafted to Sarah.</div>
            </div>
          </div>
          <button className="opacity-0 group-hover/row:opacity-100 flex-shrink-0 ml-4 px-3 py-1 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all whitespace-nowrap">Review Draft</button>
        </div>
        {/* Log 2 */}
        <div className="group/row flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">SF</div>
            <div>
              <div className="text-[13px] text-gray-900 font-bold">TechStart Discovery</div>
              <div className="text-[12px] text-gray-600">MEDDPICC updated. Missing 'Economic Buyer'.</div>
            </div>
          </div>
          <button className="opacity-0 group-hover/row:opacity-100 flex-shrink-0 ml-4 px-3 py-1 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all whitespace-nowrap">Update CRM</button>
        </div>
      </div>
    </div>
  );
}

interface N2A1TodayViewProps {
  onboarding?: OnboardingData;
  onOpenSkillsPanel: () => void;
  showNudge?: boolean;
  feedState?: "default" | "loading" | "injected";
}

export function N2A1TodayView({
  onboarding,
  onOpenSkillsPanel,
  showNudge = true,
  feedState = "default",
}: N2A1TodayViewProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [showTomorrow, setShowTomorrow] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);
  const [showReplies, setShowReplies] = useState(true);
  const [repliesStatus, setRepliesStatus] = useState<"loaded" | "empty">("loaded");
  const [isHighlightsMenuOpen, setIsHighlightsMenuOpen] = useState(false);
  const [isRepliesMenuOpen, setIsRepliesMenuOpen] = useState(false);
  const [isAgendaMenuOpen, setIsAgendaMenuOpen] = useState(false);
  const [cardsLayout, setCardsLayout] = useState<InjectedCardLayout[]>([
    { id: "morning-briefing", col: 1, order: 1, hidden: false },
    { id: "risk-radar", col: 1, order: 2, hidden: false },
    { id: "auto-log", col: 1, order: 3, hidden: false },
  ]);
  const [openMenuId, setOpenMenuId] = useState<InjectedCardId | null>(null);
  const highlightsMenuRef = useRef<HTMLDivElement>(null);
  const repliesMenuRef = useRef<HTMLDivElement>(null);
  const agendaMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    if (!isAgendaMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (agendaMenuRef.current && !agendaMenuRef.current.contains(e.target as Node)) {
        setIsAgendaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isAgendaMenuOpen]);

  useEffect(() => {
    if (!isHighlightsMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (highlightsMenuRef.current && !highlightsMenuRef.current.contains(e.target as Node)) {
        setIsHighlightsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isHighlightsMenuOpen]);

  useEffect(() => {
    if (!isRepliesMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (repliesMenuRef.current && !repliesMenuRef.current.contains(e.target as Node)) {
        setIsRepliesMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isRepliesMenuOpen]);

  // Helpers to toggle panels
  const openRisks = () => setActivePanel(p => p?.type === "risks" ? null : { type: "risks" });
  const openQuotes = () => setActivePanel(p => p?.type === "quotes" ? null : { type: "quotes" });
  const openPrep = (dealId: string, meetingTime: string) =>
    setActivePanel(p => (p?.type === "prep" && (p as {type:"prep";dealId:string}).dealId === dealId) ? null : { type: "prep", dealId, meetingTime });
  const { today } = RITA_DATA;

  const greeting = { text: "Let's win the day", emoji: "🚀" };
  const firstProof = onboarding?.firstProof || { callsLogged: 3, followUpsDrafted: 2, location: "Gmail drafts" };
  const col1Cards = cardsLayout.filter((c) => c.col === 1 && !c.hidden).sort((a, b) => a.order - b.order);
  const col2Cards = cardsLayout.filter((c) => c.col === 2 && !c.hidden).sort((a, b) => a.order - b.order);

  const moveCardDown = (id: InjectedCardId) => {
    setCardsLayout((prev) => {
      const card = prev.find((c) => c.id === id);
      if (!card) return prev;
      const sameColCards = prev.filter((c) => c.col === card.col && !c.hidden).sort((a, b) => a.order - b.order);
      const currentIndex = sameColCards.findIndex((c) => c.id === id);
      if (currentIndex === -1 || currentIndex === sameColCards.length - 1) return prev;

      const nextCard = sameColCards[currentIndex + 1];
      return prev.map((c) => {
        if (c.id === id) return { ...c, order: nextCard.order };
        if (c.id === nextCard.id) return { ...c, order: card.order };
        return c;
      });
    });
    setOpenMenuId(null);
  };

  const moveColumn = (id: InjectedCardId, targetCol: 1 | 2) => {
    setCardsLayout((prev) => {
      const targetColMaxOrder = Math.max(0, ...prev.filter((c) => c.col === targetCol && !c.hidden).map((c) => c.order));
      return prev.map((c) => (c.id === id ? { ...c, col: targetCol, order: targetColMaxOrder + 1 } : c));
    });
    setOpenMenuId(null);
  };

  const hideCard = (id: InjectedCardId) => {
    setCardsLayout((prev) => prev.map((c) => (c.id === id ? { ...c, hidden: true } : c)));
    setOpenMenuId(null);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full w-full overflow-hidden"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Lato, sans-serif' }}
    >
      {/* ── Main left area ── */}
      <ResizablePanel id="today-main" order={1} minSize={30} className="overflow-hidden">
      <div
        className="h-full flex flex-col overflow-hidden"
        style={{ background: "linear-gradient(to bottom, #ffffff 0%, #f4e8f1 100%)" }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-8 py-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-bold text-gray-900">Today</span>
            <span className="text-sm text-gray-400">{today.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-[12px] border border-gray-300 rounded-lg text-gray-600 hover:bg-white/70 transition-colors">
              Give Feedback
            </button>
            <button className="p-1.5 border border-gray-300 rounded-lg text-gray-500 hover:bg-white/70 transition-colors text-[13px]">
              ⚙️
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto min-h-0 @container">
          <div className="max-w-[1124px] mx-auto px-5 py-6 w-full">

            {/* Hero */}
            <div className="text-center mb-8">
              <h1 className="text-[28px] font-bold text-gray-900 mb-2">
                {greeting.text}{" "}
                <span className="inline-block hover:scale-110 transition-transform cursor-default">{greeting.emoji}</span>
              </h1>
              <p className="text-[14px] text-gray-500">Slackbot found areas for you to focus on today:</p>
            </div>

            {/* Focus Prompts */}
            <div className="grid grid-cols-3 gap-4 mb-12 w-full" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
              <FocusPill
                onClick={openRisks}
                icon="🔍"
                iconBg="bg-orange-50"
                label="Review Q1 pipeline risks"
                restGradient="linear-gradient(135deg,#f9a8d4,#c084fc,#fb923c)"
                colors="#f472b6, #c084fc, #fb923c, #f9a8d4, #f472b6"
              />
              <FocusPill
                onClick={() => openPrep("deal-acme", "11:30am")}
                icon="🤝"
                iconBg="bg-emerald-50"
                label="Prep for Acme Corp sync"
                restGradient="linear-gradient(135deg,#34d399,#2dd4bf,#60a5fa)"
                colors="#34d399, #2dd4bf, #60a5fa, #a5f3fc, #34d399"
              />
              <FocusPill
                onClick={openQuotes}
                icon="✍️"
                iconBg="bg-blue-50"
                label="Approve 2 pending quotes"
                restGradient="linear-gradient(135deg,#60a5fa,#818cf8,#a78bfa)"
                colors="#60a5fa, #818cf8, #a78bfa, #c4b5fd, #60a5fa"
              />
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 @[680px]:grid-cols-[1.2fr_1fr] @[1024px]:grid-cols-[1fr_minmax(360px,440px)] gap-6 items-start">

              {/* ── Left column ── */}
              <div className="flex flex-col gap-5">
                {/* SHIMMER LOADING STATE */}
                {feedState === "loading" && (
                  <div className="flex flex-col gap-4 mb-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                          <div className="h-4 bg-gray-100 rounded w-1/3" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-50 rounded w-full" />
                          <div className="h-3 bg-gray-50 rounded w-5/6" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* INJECTED SKILL CARDS (Column 1) */}
                {feedState === "injected" &&
                  col1Cards.map((card) => (
                    <InjectedSkillCard
                      key={card.id}
                      cardId={card.id}
                      col={1}
                      isMenuOpen={openMenuId === card.id}
                      onToggleMenu={(id) => setOpenMenuId((prev) => (prev === id ? null : id))}
                      onCloseMenu={() => setOpenMenuId(null)}
                      onMoveDown={moveCardDown}
                      onMoveColumn={moveColumn}
                      onHide={hideCard}
                    />
                  ))}

                {/* ★ THE NUDGE CARD — moved to top ★ */}
                {showNudge && onboarding && (
                  <OnboardingNudgeCard onExplore={onOpenSkillsPanel} firstProof={firstProof} />
                )}

                {/* Replies needed */}
                {showReplies && (
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4 relative" ref={repliesMenuRef}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[18px] flex-shrink-0">💬</span>
                      <h2 className="text-[15px] font-bold text-gray-900">Replies needed</h2>
                      {repliesStatus === "loaded" && (
                        <span className="text-[13px] font-normal text-gray-400">· {today.repliesNeeded.length}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {repliesStatus === "loaded" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setRepliesStatus("empty"); }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-green-600"
                          title="Mark all as done"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      {repliesStatus === "empty" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setRepliesStatus("loaded"); }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-green-500 hover:text-gray-400"
                          title="Restore replies"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsRepliesMenuOpen(v => !v); }}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Dropdown */}
                    {isRepliesMenuOpen && (
                      <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-9 w-64 bg-white rounded-xl shadow-xl z-50 overflow-hidden text-[14px]" style={{ border: "1px solid #E5E7EB" }}>
                        <div style={{ borderTop: "1px solid #F3F4F6" }}>
                          <button
                            onClick={() => { setShowReplies(false); setIsRepliesMenuOpen(false); }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-800 transition-colors"
                          >
                            Hide section
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Loaded state */}
                  {repliesStatus === "loaded" && (
                    <div className="space-y-3">
                      {today.repliesNeeded.map((item) => (
                        <div
                          key={item.from}
                          className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <p className="text-[13px] font-semibold text-gray-800 mb-2 leading-snug line-clamp-2">
                            {item.preview}
                          </p>
                          <div className="flex items-center gap-2">
                            <Avatar initials={item.initials} color={AVATAR_COLORS[item.initials] ?? "#E8D5F5"} />
                            <span className="text-[12px] font-semibold text-gray-700">{item.from}</span>
                            <span className="text-[11px] text-gray-400">{item.channel}</span>
                            <span className="text-[11px] text-gray-400 ml-auto">{item.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty state */}
                  {repliesStatus === "empty" && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <h3 className="text-[15px] font-bold text-gray-900 mb-1.5">No replies needed right now 🌱</h3>
                    </div>
                  )}
                </div>
                )}

                {/* Top highlights */}
                {showHighlights && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4 relative" ref={highlightsMenuRef}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[18px] flex-shrink-0">🔦</span>
                      <h2 className="text-[15px] font-bold text-gray-900 truncate">Top highlights</h2>
                      <span className="text-[13px] text-gray-400 whitespace-nowrap hidden sm:block">Summaries of priority unreads</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors" title="Refresh">
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsHighlightsMenuOpen(v => !v); }}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Dropdown */}
                    {isHighlightsMenuOpen && (
                      <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-9 w-64 bg-white rounded-xl shadow-xl z-50 overflow-hidden text-[14px]" style={{ border: "1px solid #E5E7EB" }}>
                        <button
                          onClick={() => setIsHighlightsMenuOpen(false)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-800 transition-colors"
                        >
                          Manage highlight sources
                        </button>
                        <div style={{ borderTop: "1px solid #F3F4F6" }}>
                          <button
                            onClick={() => { setShowHighlights(false); setIsHighlightsMenuOpen(false); }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-800 transition-colors"
                          >
                            Hide section
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="divide-y divide-gray-100">
                    {today.highlights.map((h, i) => {
                      const sentimentStyles = {
                        positive: { dot: "#22C55E", label: "" },
                        warning:  { dot: "#F97316", label: "⚠️ " },
                        critical: { dot: "#EF4444", label: "🚨 " },
                      };
                      const s = sentimentStyles[h.sentiment];
                      return (
                        <div key={i} className="py-4 hover:bg-gray-50 -mx-1 px-1 rounded-lg cursor-pointer transition-colors">
                          <div className="flex items-start gap-2 mb-1">
                            <span
                              className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                              style={{ background: s.dot }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] text-gray-800 leading-snug">
                                <span className="font-bold">Agentforce </span>
                                {s.label}{h.summary}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[11px] text-gray-400">{h.channel}</span>
                                <span className="text-[11px] text-gray-300">·</span>
                                <span className="text-[11px] text-gray-400">{h.time}</span>
                                {h.reactions.map((r) => (
                                  <span
                                    key={r.emoji}
                                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] text-gray-600 bg-gray-50"
                                    style={{ border: "1px solid #E5E7EB" }}
                                  >
                                    {r.emoji} {r.count}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                )}

              </div>

              {/* ── Right column: Agenda ── */}
              <div className="space-y-5 sticky top-4">
                {feedState === "injected" &&
                  col2Cards.map((card) => (
                    <InjectedSkillCard
                      key={card.id}
                      cardId={card.id}
                      col={2}
                      isMenuOpen={openMenuId === card.id}
                      onToggleMenu={(id) => setOpenMenuId((prev) => (prev === id ? null : id))}
                      onCloseMenu={() => setOpenMenuId(null)}
                      onMoveDown={moveCardDown}
                      onMoveColumn={moveColumn}
                      onHide={hideCard}
                    />
                  ))}
                <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4 relative" ref={agendaMenuRef}>
                    <div className="flex items-center gap-2">
                      <span className="text-[18px]">📅</span>
                      <h2 className="text-[15px] font-bold text-gray-900">Agenda</h2>
                      <span className="text-gray-400 font-medium text-[13px]">· 6</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsAgendaMenuOpen(v => !v); }}
                      className="text-gray-400 hover:bg-gray-200 p-1.5 rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Dropdown menu */}
                    {isAgendaMenuOpen && (
                      <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-9 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden text-sm">
                        <button
                          onClick={() => setIsAgendaMenuOpen(false)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-800 transition-colors"
                          style={{ borderBottom: "1px solid #F3F4F6" }}
                        >
                          Hide section
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Today's meetings */}
                  <div className="space-y-2">
                    <AgendaItem
                      title="Weekly Team Sync"
                      subtitle="Q1 kickoff — your plan auto-shared"
                      time="10:00am"
                      badgeText="In 1h"
                      badgeColor="bg-blue-50 text-blue-600"
                      barColor="bg-blue-500"
                      icon={MeetIcon}
                      isMeeting
                      onPrep={() => {}}
                    />
                    <AgendaItem
                      title="Discovery Call — Acme Corp"
                      subtitle="Champion: Priya Shah"
                      dotColor="bg-orange-500"
                      time="11:30am"
                      barColor="bg-purple-500"
                      icon={MeetIcon}
                      isMeeting
                      onPrep={() => openPrep("deal-acme", "11:30am")}
                    />
                    <AgendaItem
                      title="Lunch — Diane Park (CIO)"
                      subtitle="Relationship meeting · $60K · Stage 3"
                      dotColor="bg-emerald-500"
                      time="1:00pm"
                      barColor="bg-emerald-500"
                      icon={CalIcon}
                      onPrep={() => openPrep("deal-greentech", "1:00pm")}
                    />
                    <AgendaItem
                      title="NovaCorp Legal Sync"
                      subtitle="Clause 7.2 review · overdue 3 days"
                      dotColor="bg-amber-500"
                      time="2:30pm"
                      barColor="bg-amber-500"
                      icon={CalIcon}
                      onPrep={() => openPrep("deal-novacorp", "2:30pm")}
                    />
                    <AgendaItem
                      title="1:1 with Sarah Chen"
                      subtitle="Agenda auto-generated: Q1 plan..."
                      time="4:00pm"
                      barColor="bg-indigo-500"
                      icon={MeetIcon}
                      isMeeting
                      onPrep={() => {}}
                    />
                    <AgendaItem
                      title="Sporty Nation Internal Review"
                      subtitle="14 days silent · $270K at risk"
                      dotColor="bg-red-500"
                      time="5:00pm"
                      barColor="bg-red-500"
                      icon={CalIcon}
                      onPrep={() => openPrep("deal-sporty", "5:00pm")}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      </ResizablePanel>

      {/* ── Right side panel (prep/risks/quotes) ── */}
      {activePanel && (
        <>
          <ResizableHandle withHandle={false} className="!w-[6px] shrink-0 !bg-transparent border-0" />
          <ResizablePanel id="today-panel" order={2} minSize={20} defaultSize={35} className="overflow-hidden">
            <div className="h-full bg-white overflow-y-auto">
              {activePanel.type === "prep" && buildPrepContent(activePanel.dealId, activePanel.meetingTime) && (
                <div className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">{buildPrepContent(activePanel.dealId, activePanel.meetingTime)!.heading}</h2>
                  <div className="space-y-4">
                    {buildPrepContent(activePanel.dealId, activePanel.meetingTime)!.fields.map((f, i) => (
                      <div key={i}>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">{f.label}</div>
                        <div className="text-sm text-gray-900">{f.value}</div>
                      </div>
                    ))}
                    {buildPrepContent(activePanel.dealId, activePanel.meetingTime)!.risk && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-sm text-red-900">{buildPrepContent(activePanel.dealId, activePanel.meetingTime)!.risk}</div>
                      </div>
                    )}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-xs font-semibold text-blue-900 uppercase mb-1">Recommendation</div>
                      <div className="text-sm text-blue-900">{buildPrepContent(activePanel.dealId, activePanel.meetingTime)!.rec}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {buildPrepContent(activePanel.dealId, activePanel.meetingTime)!.actions.map((a, i) => (
                        <button key={i} className="px-3 py-1.5 text-xs font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activePanel.type === "risks" && (
                <div className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Q1 Pipeline Risks</h2>
                  <div className="space-y-3">
                    {RITA_DATA.q1Pipeline.atRisk.count > 0 && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-sm font-semibold text-red-900 mb-1">At Risk: {RITA_DATA.q1Pipeline.atRisk.count} deals</div>
                        <div className="text-xs text-red-700">${(RITA_DATA.q1Pipeline.atRisk.value / 1000).toFixed(0)}K total value</div>
                      </div>
                    )}
                    {RITA_DATA.q1Pipeline.cooling.count > 0 && (
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="text-sm font-semibold text-orange-900 mb-1">Cooling: {RITA_DATA.q1Pipeline.cooling.count} deals</div>
                        <div className="text-xs text-orange-700">${(RITA_DATA.q1Pipeline.cooling.value / 1000).toFixed(0)}K total value</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activePanel.type === "quotes" && (
                <div className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Quotes</h2>
                  <div className="space-y-3">
                    {["Approve Greentech quote", "Approve NovaCorp quote", "View in Salesforce"].map(a => (
                      <button key={a} className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
