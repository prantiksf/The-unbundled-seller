"use client";

/**
 * ARCHITECTURAL PRINCIPLE: Each arc (N2A3, N2A4, etc.) should have its own design components.
 * Changes to one arc's components should not affect other arcs. Only the global Slack app
 * shell should be shared across arcs.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Clock, MoreHorizontal } from "lucide-react";
import type { PriorityProspect } from "@/data/priorityProspects";
import { mockActionItems, type ActionFilter, type MockActionItem } from "@/data/mockActionItems";

// ── Sort options ──────────────────────────────────────────────────────────
type SortKey = "default" | "deal-impact-high" | "deal-impact-low" | "urgency" | "signal" | "alpha";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default",          label: "Default (AI Ranked)"         },
  { key: "deal-impact-high", label: "Highest Deal Impact"         },
  { key: "deal-impact-low",  label: "Lowest Deal Impact"          },
  { key: "urgency",          label: "Most Urgent"                 },
  { key: "signal",           label: "Strongest Signal"            },
  { key: "alpha",            label: "Alphabetical (A → Z)"        },
];

// ── Available pill definitions ────────────────────────────────────────────
const ALL_PILLS: { id: ActionFilter; label: string }[] = [
  { id: "All",        label: "All"              },
  { id: "Meetings",   label: "💼 Meetings"      },
  { id: "Follow-ups", label: "↩️ Follow-ups"    },
  { id: "Top Opps",   label: "🔥 Top Opps"      },
  { id: "Contracts",  label: "📄 Contracts"     },
  { id: "Onboarding", label: "🚀 Onboarding"    },
];

const DEFAULT_PILLS = ["All", "Meetings", "Follow-ups", "Top Opps"] as const;

const salesHeaders = [
  "Crush your quota 🎯",
  "Time to close some deals 🤝",
  "Turn actions into revenue 💸",
  "Every rep action compounds 📈",
  "Your pipeline won't work itself 🚀",
];

const salesSubheaders = [
  "Slackbot lined up your highest-impact plays for today:",
  "Here's what moves the needle most right now:",
  "Your AI-curated action list for today:",
  "Focus here. The rest can wait.",
];

// ── Quota progress bar ────────────────────────────────────────────────────

const QUOTA_SEGMENTS = [
  { key: "closed",   label: "Closed",          amount: "$320k", pct: 64, color: "#2563eb" },
  { key: "pipeline", label: "Pipeline / Commit",amount: "$75k",  pct: 15, color: "#93c5fd" },
  { key: "lost",     label: "Lost / Slipped",  amount: "$42k",  pct: 8,  color: "#fca5a5" },
  { key: "open",     label: "Not Started",     amount: "$63k",  pct: 13, color: "#e5e7eb" },
] as const;

function QuotaProgressBar() {
  const [hovered, setHovered] = React.useState<string | null>(null);

  return (
    <div className="mb-4">
      {/* Thin segmented track */}
      <div className="w-full h-1.5 rounded-full flex overflow-hidden gap-px bg-gray-100 mb-3">
        {QUOTA_SEGMENTS.map((seg) => (
          <div
            key={seg.key}
            className="h-full relative cursor-pointer transition-opacity"
            style={{ width: `${seg.pct}%`, backgroundColor: seg.color, opacity: hovered && hovered !== seg.key ? 0.45 : 1 }}
            onMouseEnter={() => setHovered(seg.key)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Popover */}
            {hovered === seg.key && (
              <div
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                style={{ minWidth: "140px" }}
              >
                <div className="bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-lg text-center whitespace-nowrap">
                  <p className="font-semibold">{seg.label}</p>
                  <p className="text-gray-300 mt-0.5">{seg.amount} · {seg.pct}%</p>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #111827" }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {QUOTA_SEGMENTS.map((seg) => (
          <span
            key={seg.key}
            className="flex items-center gap-1.5 text-xs cursor-default"
            style={{ color: hovered === seg.key ? "#111827" : "#9ca3af" }}
            onMouseEnter={() => setHovered(seg.key)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
            {seg.label} ({seg.amount})
          </span>
        ))}
      </div>
    </div>
  );
}

function resolveSignalStyle(label: string): React.CSSProperties {
  const l = label.toLowerCase();
  if (l.includes("hot")) return { background: "#fee2e2", color: "#991b1b" };
  if (l.includes("warm")) return { background: "#ffedd5", color: "#9a3412" };
  if (l.includes("cold")) return { background: "#e0f2fe", color: "#0369a1" };
  return { background: "#f3f4f6", color: "#374151" };
}

function getCtaLabel(step: string, taskCategory: string): string {
  const combined = `${step} ${taskCategory}`.toLowerCase();
  if (combined.includes("email")) return "Draft Email";
  if (combined.includes("call") || combined.includes("meeting") || combined.includes("prep")) return "Prep Agenda";
  if (combined.includes("contract") || combined.includes("review")) return "Review Contract";
  return "Take Action";
}

interface N2A4WorkModeLayoutProps {
  onWorkModeToggle: () => void;
  onOpenBuilder: (prospect: PriorityProspect) => void;
  isBuilderOpen: boolean;
}

/**
 * N2A4-specific Work Mode Layout component.
 * This component is exclusive to N2A4 and should not be shared with other arcs.
 * Changes to this component should not affect other arcs.
 */
// Export both names for backward compatibility during migration
export function WorkModeLayout(props: N2A4WorkModeLayoutProps) {
  return <N2A4WorkModeLayout {...props} />;
}

export function N2A4WorkModeLayout({
  onWorkModeToggle,
  onOpenBuilder,
  isBuilderOpen,
}: N2A4WorkModeLayoutProps) {
  const [activeFilter, setActiveFilter] = useState<ActionFilter>("All");
  const [selectedItem, setSelectedItem] = useState<MockActionItem>(mockActionItems[0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Left-pane sort + pill config
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isPillMenuOpen, setIsPillMenuOpen] = useState(false);
  const [activePillIds, setActivePillIds] = useState<string[]>([...DEFAULT_PILLS]);
  const sortRef = useRef<HTMLDivElement>(null);
  const pillMenuRef = useRef<HTMLDivElement>(null);

  const [heroHeader] = useState(
    () => salesHeaders[Math.floor(Math.random() * salesHeaders.length)]
  );
  const [heroSubheader] = useState(
    () => salesSubheaders[Math.floor(Math.random() * salesSubheaders.length)]
  );

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isSortOpen) return;
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setIsSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isSortOpen]);

  useEffect(() => {
    if (!isPillMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (pillMenuRef.current && !pillMenuRef.current.contains(e.target as Node)) setIsPillMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isPillMenuOpen]);

  const prospectsById = useMemo(
    () =>
      new Map(
        mockActionItems.map((item, idx) => [
          item.id,
          {
            id: item.id,
            name: item.prospect.name,
            title: item.prospect.role,
            company: item.prospect.company,
            signals: item.context.tags,
            email: item.prospect.email,
            context: item.context.summary,
            draftEmail: item.action.draftBody,
            draftSubject: item.action.draftSubject,
            step: item.step,
            stepNumber: idx + 1,
            totalSteps: mockActionItems.length,
            avatarUrl: item.prospect.avatarUrl,
            actionType: item.action.actionType,
            meetingTitle: item.action.meetingTitle,
            agendaContent: item.action.agendaContent,
            contractClause: item.action.contractClause,
            contractSnippet: item.action.contractSnippet,
          } satisfies PriorityProspect,
        ])
      ),
    []
  );

  const filteredItems = useMemo(() => {
    const base = activeFilter === "All"
      ? [...mockActionItems]
      : mockActionItems.filter((item) => item.taskCategory === activeFilter);

    const signalRank = (label: string) => {
      const l = label.toLowerCase();
      if (l.includes("hot") || l.includes("closing")) return 0;
      if (l.includes("warm")) return 1;
      return 2;
    };

    switch (sortKey) {
      case "deal-impact-high":
        return base.sort((a, b) =>
          (b.taskCategory === "Top Opps" ? 1 : 0) - (a.taskCategory === "Top Opps" ? 1 : 0) ||
          signalRank(a.stats.signal.label) - signalRank(b.stats.signal.label)
        );
      case "deal-impact-low":
        return base.sort((a, b) =>
          (a.taskCategory === "Top Opps" ? 1 : 0) - (b.taskCategory === "Top Opps" ? 1 : 0) ||
          signalRank(b.stats.signal.label) - signalRank(a.stats.signal.label)
        );
      case "urgency":
        return base.sort((a, b) => {
          const urgencyRank = (item: MockActionItem) => {
            const t = item.context.tags.join(" ").toLowerCase();
            if (t.includes("closing") || t.includes("legal") || t.includes("stage 3")) return 0;
            if (t.includes("meeting") || item.taskCategory === "Meetings") return 1;
            return 2;
          };
          return urgencyRank(a) - urgencyRank(b);
        });
      case "signal":
        return base.sort((a, b) => signalRank(a.stats.signal.label) - signalRank(b.stats.signal.label));
      case "alpha":
        return base.sort((a, b) => a.prospect.name.localeCompare(b.prospect.name));
      default:
        return base;
    }
  }, [activeFilter, sortKey]);

  const handleFilterChange = (filter: ActionFilter) => {
    setActiveFilter(filter);
    if (filter !== "All" && selectedItem.taskCategory !== filter) {
      const next = mockActionItems.find((item) => item.taskCategory === filter);
      if (next) setSelectedItem(next);
    }
  };

  // Get today's date for header
  const today = new Date();
  const todayDate = today.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #ffffff 0%, #f4e8f1 100%)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Lato, sans-serif',
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-8 py-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-bold text-gray-900">Work Mode</span>
          <span className="text-sm text-gray-400">{todayDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onWorkModeToggle}
            className="px-3 py-1 text-[12px] rounded-lg font-medium transition-colors"
            style={{ backgroundColor: "#4A154B", color: "#ffffff", border: "1px solid #4A154B" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#611f64")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4A154B")}
          >
            Work Mode
          </button>
          <button className="px-3 py-1 text-[12px] border border-gray-300 rounded-lg text-gray-600 hover:bg-white/70 transition-colors">
            Give Feedback
          </button>
          <button className="p-1.5 border border-gray-300 rounded-lg text-gray-500 hover:bg-white/70 transition-colors text-[13px]">
            ⚙️
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-[1124px] mx-auto px-5 py-6 w-full">

          {/* Dynamic motivational header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{heroHeader}</h1>
            <p className="text-gray-500">{heroSubheader}</p>
          </div>

          {/* Goal Insights card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-end justify-between mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">$320k</span>
                <span className="text-xl text-gray-400">/</span>
                <span className="text-xl text-gray-500">$500k Q1 Target</span>
              </div>
              <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Q1 Quota Progress</span>
            </div>

            {/* Segmented progress bar with tooltips */}
            <QuotaProgressBar />

            <div className="rounded-lg p-3 flex items-start gap-3 text-sm text-indigo-900" style={{ background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 60%, #fdf4ff 100%)" }}>
              <span className="text-base leading-none mt-0.5 flex-shrink-0">✨</span>
              <p className="leading-relaxed">
                You need <strong>$180k</strong> to hit Q1 quota. Prioritizing today&apos;s Top Opps and
                Meeting Preps gives you a <strong>78% probability</strong> of closing the gap.
              </p>
            </div>
          </div>

          {/* Main command center */}
          <div className="flex gap-6 transition-all duration-300">

            {/* ── Left pane: Action Queue ── */}
            <div className="w-[30%] flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-full flex flex-col overflow-y-hidden">
                {/* Left pane header row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-900">Action Items</span>
                  <div className="flex items-center gap-1">

                    {/* Sort button */}
                    <div className="relative" ref={sortRef}>
                      <button
                        onClick={() => { setIsSortOpen((p) => !p); setIsPillMenuOpen(false); }}
                        className={`p-1.5 rounded border text-gray-500 bg-white transition-colors ${
                          isSortOpen || sortKey !== "default"
                            ? "border-blue-300 text-blue-600 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                        title="Sort"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                      {isSortOpen && (
                        <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 z-50 min-w-[210px] py-1">
                          <p className="px-3 pt-1.5 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Sort by</p>
                          {SORT_OPTIONS.map((opt) => (
                            <button
                              key={opt.key}
                              onClick={() => { setSortKey(opt.key); setIsSortOpen(false); }}
                              className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                                sortKey === opt.key
                                  ? "bg-blue-50 text-blue-700 font-medium"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {opt.label}
                              {sortKey === opt.key && <span className="text-blue-500">✓</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pill config ellipsis */}
                    <div className="relative" ref={pillMenuRef}>
                      <button
                        onClick={() => { setIsPillMenuOpen((p) => !p); setIsSortOpen(false); }}
                        className={`p-1.5 rounded border text-gray-500 bg-white transition-colors ${
                          isPillMenuOpen
                            ? "border-blue-300 text-blue-600 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                        title="Configure filters"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                      {isPillMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 z-50 min-w-[200px] py-1">
                          <p className="px-3 pt-1.5 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Show filters</p>
                          {ALL_PILLS.map((pill) => {
                            const active = activePillIds.includes(pill.id);
                            return (
                              <button
                                key={pill.id}
                                onClick={() => {
                                  setActivePillIds((prev) =>
                                    active
                                      ? prev.filter((id) => id !== pill.id)
                                      : [...prev, pill.id]
                                  );
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                              >
                                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                                  active ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"
                                }`}>
                                  {active && <span className="text-[8px] leading-none font-bold">✓</span>}
                                </span>
                                {pill.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Filter pills — horizontal scroll, no scrollbar */}
                <div
                  className="mb-4 no-scrollbar gap-2 pb-1"
                  style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto" }}
                >
                  {ALL_PILLS.filter((p) => activePillIds.includes(p.id)).map((pill) => {
                    const isActive = activeFilter === pill.id;
                    return (
                      <button
                        key={pill.id}
                        onClick={() => handleFilterChange(pill.id as ActionFilter)}
                        className={`shrink-0 px-3 py-1.5 text-xs rounded-full transition-colors whitespace-nowrap ${
                          isActive
                            ? "bg-white shadow-sm border border-gray-200 text-gray-900"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>

                {/* Prospect list */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="flex flex-col gap-2">
                    {filteredItems.map((item) => {
                      const isSelected = item.id === selectedItem.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedItem(item);
                            if (isBuilderOpen) {
                              const mapped = prospectsById.get(item.id);
                              if (mapped) onOpenBuilder(mapped);
                            }
                          }}
                          className={`w-full text-left rounded-lg transition-colors px-4 py-3 border ${
                            isSelected
                              ? "bg-blue-50 border-blue-100 border-l-4 border-l-blue-600"
                              : "bg-white border-transparent hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {item.prospect.avatarUrl ? (
                              <img
                                src={item.prospect.avatarUrl}
                                alt={item.prospect.name}
                                className="w-7 h-7 rounded object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded bg-gray-100 text-gray-700 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                                {item.prospect.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-gray-900 truncate">{item.prospect.name}</p>
                                <span className="text-xs text-gray-500 whitespace-nowrap">{item.step}</span>
                              </div>
                              <p className="text-xs text-gray-500 truncate">
                                {item.prospect.role} · {item.prospect.company}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 truncate">{item.taskCategory}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Center pane: Context ── */}
            <div className="flex-1 min-w-0 transition-all duration-300">
              <div className="flex flex-col gap-4">

                {/* Prev / Next navigation row */}
                <div className="flex items-center justify-between gap-1.5">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">Prep Brief</p>
                    <p className="text-xs text-gray-400 leading-tight">AI-curated context for your next action</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400 mr-1">
                      {filteredItems.indexOf(selectedItem) + 1} / {filteredItems.length}
                    </span>
                    <button
                      onClick={() => {
                        const idx = filteredItems.indexOf(selectedItem);
                        if (idx > 0) {
                          const next = filteredItems[idx - 1];
                          setSelectedItem(next);
                          if (isBuilderOpen) {
                            const mapped = prospectsById.get(next.id);
                            if (mapped) onOpenBuilder(mapped);
                          }
                        }
                      }}
                      disabled={filteredItems.indexOf(selectedItem) === 0}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-gray-200 text-xs text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      Previous
                    </button>
                    <button
                      onClick={() => {
                        const idx = filteredItems.indexOf(selectedItem);
                        if (idx < filteredItems.length - 1) {
                          const next = filteredItems[idx + 1];
                          setSelectedItem(next);
                          if (isBuilderOpen) {
                            const mapped = prospectsById.get(next.id);
                            if (mapped) onOpenBuilder(mapped);
                          }
                        }
                      }}
                      disabled={filteredItems.indexOf(selectedItem) === filteredItems.length - 1}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-gray-200 text-xs text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Profile header island */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 min-w-0">
                      {selectedItem.prospect.avatarUrl ? (
                        <img
                          src={selectedItem.prospect.avatarUrl}
                          alt={selectedItem.prospect.name}
                          className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700 flex-shrink-0">
                          {selectedItem.prospect.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-gray-900">{selectedItem.prospect.name}</h3>
                        <p className="text-sm text-gray-600">
                          {selectedItem.prospect.role} · {selectedItem.prospect.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => {
                          const mapped = prospectsById.get(selectedItem.id);
                          if (mapped) onOpenBuilder(mapped);
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors whitespace-nowrap"
                      >
                        {getCtaLabel(selectedItem.step, selectedItem.taskCategory)}
                      </button>

                      {/* Ellipsis overflow menu */}
                      <div className="relative" ref={menuRef}>
                        <button
                          onClick={() => setIsMenuOpen((prev) => !prev)}
                          className="p-1.5 border border-gray-300 rounded text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                          aria-label="More actions"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                        {isMenuOpen && (
                          <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 z-50 min-w-[172px]">
                            {["Log Activity", "Remind me tomorrow", "Skip for now"].map((label) => (
                              <button
                                key={label}
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full text-left text-sm text-gray-700 hover:bg-gray-50 px-4 py-2 first:rounded-t-md last:rounded-b-md"
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.context.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-purple-50 text-purple-700"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700">
                      {selectedItem.step}
                    </span>
                  </div>
                </div>

                {/* Stats grid island */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Signal Score</span>
                      <span
                        className="inline-flex items-center self-start px-2.5 py-1 rounded-md text-xs font-semibold"
                        style={resolveSignalStyle(selectedItem.stats.signal.label)}
                      >
                        {selectedItem.stats.signal.label}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Fit</span>
                      <span
                        className="inline-flex items-center self-start px-2.5 py-1 rounded-md text-xs font-semibold"
                        style={{ background: "#dbeafe", color: "#1e40af" }}
                      >
                        {selectedItem.stats.fit.label}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</span>
                      <span
                        className="inline-flex items-center self-start px-2.5 py-1 rounded-md text-xs font-semibold"
                        style={{ background: "#dcfce7", color: "#15803d" }}
                      >
                        {selectedItem.stats.email}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Phone</span>
                      <span
                        className="inline-flex items-center self-start px-2.5 py-1 rounded-md text-xs font-semibold"
                        style={
                          selectedItem.stats.phone === "Unknown"
                            ? { background: "#f3f4f6", color: "#6b7280" }
                            : { background: "#dcfce7", color: "#15803d" }
                        }
                      >
                        {selectedItem.stats.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Talking Points island */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Talking Points</h3>

                  {/* Contextual tags */}
                  {selectedItem.context.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedItem.context.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <ul className="list-disc pl-5 space-y-4 text-gray-700 text-sm mb-4">
                    {selectedItem.context.talkingPoints.map((point, i) => (
                      <li key={i} className="leading-relaxed">
                        {/* dangerouslySetInnerHTML is intentional here: talkingPoints contain pre-authored
                            inline <span> highlights — no user input, no XSS risk */}
                        <span dangerouslySetInnerHTML={{ __html: point }} />
                      </li>
                    ))}
                  </ul>

                  {/* Sources row — real tool icons from /public */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400 mr-1">Sources:</span>
                    {selectedItem.context.sources.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt="Source icon"
                        className="w-5 h-5 rounded-sm object-contain flex-shrink-0"
                        title={src.replace("/", "").replace(".png", "")}
                      />
                    ))}
                  </div>
                </div>

                {/* Local Time island */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-gray-500" />
                    Local Time
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-light text-gray-700">{selectedItem.context.localTime.time}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Right pane lives in Slack shell (progressive disclosure via CTA) */}
          </div>
        </div>
      </div>
    </div>
  );
}
