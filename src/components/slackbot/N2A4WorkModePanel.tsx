"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CalendarCheck, CheckCircle2, Sparkles, XCircle } from "lucide-react";
import {
  IconStar,
  IconPencil,
  IconX,
  IconPlus,
  IconMoreVertical,
} from "@/components/icons";
import { MessageInput } from "@/components/shared/MessageInput";
import { cn } from "@/lib/utils";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import { PRIORITY_PROSPECTS, type PriorityProspect } from "@/data/priorityProspects";

const T = SLACK_TOKENS;

type TabId = "messages" | "history" | "files";

interface N2A4WorkModePanelProps {
  onClose?: () => void;
  mode: "queue" | "single";
  activeProspectIndex: number;
  onNext: () => void;
  onPrevious?: () => void;
  onSendEmail: (prospect: PriorityProspect, emailContent: string) => void;
  prospects?: PriorityProspect[];
  draftSubjectOverride?: string;
  /** Full prospect from WorkModeLayout — carries actionType + meeting/contract meta */
  activeProspect?: PriorityProspect;
}

/**
 * N2A4-specific Work Mode Panel component.
 * Renders different UI based on the selected prospect's actionType:
 *  - 'email'    → Email Composer (default)
 *  - 'agenda'   → Agenda Builder
 *  - 'contract' → Contract Review
 */
export function N2A4WorkModePanel({
  onClose,
  mode,
  activeProspectIndex,
  onNext,
  onPrevious,
  onSendEmail,
  prospects,
  draftSubjectOverride,
  activeProspect,
}: N2A4WorkModePanelProps) {
  const resolvedProspects = prospects ?? PRIORITY_PROSPECTS;
  // activeProspect (from WorkModeLayout) takes precedence for metadata; fall back to index
  const prospect = activeProspect ?? resolvedProspects[activeProspectIndex];
  const actionType = prospect?.actionType ?? "email";

  // ── Email state ──────────────────────────────────────────────────────────
  const [emailContent, setEmailContent] = useState(prospect?.draftEmail || "");
  const [recipientEmail, setRecipientEmail] = useState(prospect?.email || "");
  const [emailSubject, setEmailSubject] = useState(
    draftSubjectOverride || prospect?.draftSubject || "Let's reconnect"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRefinementDropdown, setShowRefinementDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Agenda state ─────────────────────────────────────────────────────────
  const [meetingTitle, setMeetingTitle] = useState(
    prospect?.meetingTitle || `${prospect?.name ?? ""} — ${prospect?.company ?? ""}`
  );
  const [agendaContent, setAgendaContent] = useState(
    prospect?.agendaContent || ""
  );

  // ── Shared ───────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabId>("messages");

  // Reset all state when the selected prospect changes
  useEffect(() => {
    if (prospect) {
      setEmailContent(prospect.draftEmail);
      setRecipientEmail(prospect.email);
      setEmailSubject(draftSubjectOverride || prospect.draftSubject || "Let's reconnect");
      setMeetingTitle(
        prospect.meetingTitle || `${prospect.name} — ${prospect.company}`
      );
      setAgendaContent(prospect.agendaContent || "");
      setIsGenerating(false);
      setShowRefinementDropdown(false);
    }
  }, [prospect, draftSubjectOverride]);

  // Close refinement dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRefinementDropdown(false);
      }
    };
    if (showRefinementDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showRefinementDropdown]);

  const handleRefinement = (refinement: string) => {
    setShowRefinementDropdown(false);
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      let refined = emailContent;
      if (refinement === "Make it shorter") {
        const lines = emailContent.split("\n");
        const greeting = lines[0];
        const keyPoints = lines
          .filter((l) =>
            l.includes("reconnect") ||
            l.includes("platform") ||
            l.includes("conversation") ||
            l.includes("call")
          )
          .slice(0, 2);
        refined = `${greeting}\n\n${keyPoints.join("\n")}\n\nBest,\nRita`;
      } else if (refinement === "More formal") {
        refined = emailContent
          .replace(/Hi /g, "Dear ")
          .replace(/Best,/g, "Best regards,")
          .replace(/I've/g, "I have")
          .replace(/I'd/g, "I would")
          .replace(/you're/g, "you are")
          .replace(/we're/g, "we are");
      } else if (refinement === "Friendlier") {
        refined = emailContent
          .replace(/Dear /g, "Hi ")
          .replace(/Best regards,/g, "Best,")
          .replace(/I have/g, "I've")
          .replace(/I would/g, "I'd")
          .replace(/you are/g, "you're")
          .replace(/we are/g, "we're");
      }
      setEmailContent(refined);
    }, 1500);
  };

  if (!prospect) return null;

  const isLastProspect = activeProspectIndex === resolvedProspects.length - 1;

  const handleSendAndNext = () => {
    onSendEmail(prospect, emailContent);
    if (mode === "queue" && activeProspectIndex < resolvedProspects.length - 1) {
      onNext();
    } else {
      onClose?.();
    }
  };

  const handleSkip = () => {
    if (activeProspectIndex < resolvedProspects.length - 1) onNext();
  };

  const handleChatSubmit = (message: string) => {
    console.log("Chat message:", message);
  };

  // ── Sub-layouts ──────────────────────────────────────────────────────────

  const EmailComposer = (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-900">Draft Email</h3>
        <div className="flex items-center gap-1">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowRefinementDropdown(!showRefinementDropdown)}
              className={`p-1 rounded cursor-pointer transition-colors ${
                showRefinementDropdown
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
              title="Refine with AI"
            >
              <Sparkles className="w-4 h-4" strokeWidth={2} />
            </button>
            {showRefinementDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded-md py-1 w-40 z-10">
                {["Make it shorter", "More formal", "Friendlier"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleRefinement(label)}
                    className="w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer text-left transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="p-1 hover:bg-gray-100 rounded text-gray-500 cursor-pointer transition-colors"
            title="Edit manually"
          >
            <IconPencil width={16} height={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="mb-2">
        <input
          type="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none text-gray-800"
          style={{ backgroundColor: T.colors.background, fontFamily: T.typography.fontFamily }}
          placeholder="recipient@example.com"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none text-gray-800"
          style={{ backgroundColor: T.colors.background, fontFamily: T.typography.fontFamily }}
          placeholder="Email subject"
        />
      </div>

      <div className="border border-gray-300 rounded-md p-3 min-h-[200px]">
        {isGenerating ? (
          <div className="space-y-2">
            {[1, 0.83, 1, 0.8, 0.75, 0.83].map((w, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-4 rounded" style={{ width: `${w * 100}%` }} />
            ))}
          </div>
        ) : (
          <textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            disabled={isGenerating}
            className="w-full min-h-[200px] resize-y text-sm text-gray-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed leading-normal"
            style={{ backgroundColor: "transparent", fontFamily: T.typography.fontFamily, lineHeight: "1.5", caretColor: "#1d1c1d" }}
            placeholder="Email draft will appear here..."
          />
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
        <button
          type="button"
          onClick={handleSkip}
          disabled={isLastProspect}
          className="flex-1 bg-white border border-gray-300 text-gray-700 font-semibold py-1.5 px-3 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Skip for now
        </button>
        <button
          type="button"
          onClick={handleSendAndNext}
          className="flex-1 bg-[#007a5a] text-white font-semibold py-1.5 px-3 rounded-md hover:bg-[#148567] transition-colors text-sm"
        >
          Send & Next
        </button>
      </div>
    </div>
  );

  const AgendaBuilder = (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-4">
        <CalendarCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <h3 className="text-sm font-bold text-gray-900">Draft Agenda</h3>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-500 mb-1">Meeting Title</label>
        <input
          type="text"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none text-gray-800"
          style={{ backgroundColor: T.colors.background, fontFamily: T.typography.fontFamily }}
          placeholder="Meeting title"
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-500 mb-1">Agenda</label>
        <textarea
          value={agendaContent}
          onChange={(e) => setAgendaContent(e.target.value)}
          className="w-full min-h-[220px] resize-y text-sm text-gray-800 border border-gray-300 rounded-md p-3 focus:outline-none leading-relaxed"
          style={{ backgroundColor: T.colors.background, fontFamily: T.typography.fontFamily, lineHeight: "1.6" }}
          placeholder="Add agenda items..."
        />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
        <button
          type="button"
          onClick={handleSkip}
          disabled={isLastProspect}
          className="flex-1 bg-white border border-gray-300 text-gray-700 font-semibold py-1.5 px-3 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Skip for now
        </button>
        <button
          type="button"
          className="flex-1 bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-1.5"
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          Sync to Calendar
        </button>
      </div>
    </div>
  );

  const ContractReview = (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-bold text-gray-900">
          Review Contract
          {prospect.company ? `: ${prospect.company}` : ""}
        </h3>
      </div>

      {/* Clause card */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
        <div className="flex items-start gap-2 mb-2">
          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-red-600">
            Action Required: {prospect.contractClause ?? "Review outstanding clause"}
          </p>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed italic pl-6">
          {prospect.contractSnippet ??
            '"Standard contract terms apply. Please review all clauses carefully before signing."'}
        </p>
      </div>

      {/* Recommended addendum */}
      <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-green-800 mb-0.5">
              Resolution Available
            </p>
            <p className="text-xs text-green-700 leading-relaxed">
              Non-compete addendum (v3.1) is pre-approved by legal and resolves this clause
              without a full redline. Attach and send to procurement.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
        <button
          type="button"
          className="flex-1 bg-white border border-red-300 text-red-600 font-semibold py-1.5 px-3 rounded-md hover:bg-red-50 transition-colors text-sm"
        >
          Request Changes
        </button>
        <button
          type="button"
          className="flex-1 bg-[#007a5a] text-white font-semibold py-1.5 px-3 rounded-md hover:bg-[#148567] transition-colors text-sm flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Approve &amp; Sign
        </button>
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{
        backgroundColor: T.colors.background,
        borderLeft: `1px solid ${T.colors.border}`,
        fontFamily: T.typography.fontFamily,
      }}
    >
      {/* Header — never changes */}
      <div className="border-b shrink-0" style={{ borderColor: T.colors.border }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 rounded hover:bg-[#f8f8f8]"
              style={{ color: T.colors.textSecondary }}
              title="Favorite"
            >
              <IconStar
                width={T.iconSizes.slackbotHeader}
                height={T.iconSizes.slackbotHeader}
                stroke="currentColor"
              />
            </button>
            <Image src="/slackbot-logo.svg" alt="Slackbot" width={20} height={20} />
            <span className="font-semibold" style={{ fontSize: T.typography.body, color: T.colors.text }}>
              Slackbot
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Edit">
              <IconPencil width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
            </button>
            <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="More">
              <IconMoreVertical width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
            </button>
            <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Close" onClick={onClose}>
              <IconX width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs — never changes */}
      <div className="flex border-b shrink-0" style={{ borderColor: T.colors.border }}>
        {(["messages", "history", "files"] as TabId[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-3 py-2.5 font-medium capitalize transition-colors",
              activeTab === tab ? "border-b-2" : "hover:text-[#1d1c1d]"
            )}
            style={
              activeTab === tab
                ? { color: T.colors.link, borderBottomColor: T.colors.link, fontSize: T.typography.small }
                : { color: T.colors.textSecondary, fontSize: T.typography.small }
            }
          >
            {tab}
          </button>
        ))}
        <button type="button" className="p-2 hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Add">
          <IconPlus width={T.iconSizes.slackbotTab} height={T.iconSizes.slackbotTab} stroke="currentColor" />
        </button>
      </div>

      {/* Content — switches based on actionType */}
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
        {activeTab === "messages" && (
          <div className="flex-1 overflow-y-auto p-5 flex flex-col custom-scrollbar min-h-0">
            {actionType === "agenda" && AgendaBuilder}
            {actionType === "contract" && ContractReview}
            {(actionType === "email" || !actionType) && EmailComposer}
          </div>
        )}
        {(activeTab === "history" || activeTab === "files") && (
          <div className="p-4" style={{ fontSize: T.typography.small, color: T.colors.textSecondary }}>
            Coming soon.
          </div>
        )}
      </div>

      {/* Message Input — never changes */}
      <div className="shrink-0 border-t" style={{ borderColor: T.colors.border }}>
        <MessageInput
          placeholder="Message Slackbot..."
          onSendMessage={handleChatSubmit}
        />
      </div>
    </div>
  );
}
