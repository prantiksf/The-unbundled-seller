"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import {
  IconStar,
  IconPencil,
  IconX,
  IconPlus,
  IconMoreVertical,
  IconChevronRight,
  IconChevronDown,
} from "@/components/icons";
import { MessageInput } from "@/components/shared/MessageInput";
import { cn } from "@/lib/utils";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import { PRIORITY_PROSPECTS, type PriorityProspect } from "@/data/priorityProspects";

const T = SLACK_TOKENS;

type TabId = "messages" | "history" | "files";

// Helper functions (matching ProspectRow)
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColorClasses(name: string): { bg: string; text: string } {
  const colors = [
    { bg: "bg-red-100", text: "text-red-900" },
    { bg: "bg-yellow-100", text: "text-yellow-900" },
    { bg: "bg-pink-100", text: "text-pink-900" },
    { bg: "bg-blue-100", text: "text-blue-900" },
    { bg: "bg-green-100", text: "text-green-900" },
    { bg: "bg-purple-100", text: "text-purple-900" },
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function getBadgeColorStyles(signal: string, index: number): { backgroundColor: string; color: string } {
  const badgeColors = [
    { backgroundColor: "#F2F2F2", color: "#4A4A4A" },
    { backgroundColor: "#EAE0D6", color: "#915C3D" },
    { backgroundColor: "#FFEDBB", color: "#AA7F1F" },
    { backgroundColor: "#FFDCDC", color: "#CC2C5E" },
    { backgroundColor: "#EEDDFF", color: "#8E3DA8" },
    { backgroundColor: "#E3EEFD", color: "#3B58C1" },
    { backgroundColor: "#CFF5F8", color: "#1C95A7" },
    { backgroundColor: "#DBF6E4", color: "#379965" },
    { backgroundColor: "#F4FDCC", color: "#83A03B" },
  ];
  const hash = signal.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = (hash + index) % badgeColors.length;
  return badgeColors[colorIndex];
}

// ProspectIdentityBlock Component (without Slackbot header)
function ProspectIdentityBlock({ prospect, priority = "hot" }: { prospect: PriorityProspect; priority?: "hot" | "warm" | "cold" }) {
  const initials = getInitials(prospect.name);
  const avatarColors = getAvatarColorClasses(prospect.name);
  const [avatarError, setAvatarError] = useState(false);

  // Determine priority badge
  const priorityBadge = priority === "hot" ? "Hot 🔥" : null;

  // Get step text (e.g., "Step 1: Email")
  const stepText = `Step ${prospect.stepNumber}: Email`;

  return (
    <div className="flex items-start gap-3 w-full">
        {/* Avatar - Real photograph with fallback (matches ProspectRow size) */}
        {prospect.avatarUrl && !avatarError ? (
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 relative">
            <Image
              src={prospect.avatarUrl}
              alt={prospect.name}
              width={32}
              height={32}
              className="object-cover w-full h-full"
              onError={() => setAvatarError(true)}
            />
          </div>
        ) : (
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${avatarColors.bg} ${avatarColors.text}`}
          >
            {initials}
          </div>
        )}

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          {/* Row 1: Name & Step */}
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-base font-bold text-gray-900 truncate">{prospect.name}</span>
            <span className="text-xs font-medium text-gray-500 shrink-0 ml-2">{stepText}</span>
          </div>

          {/* Row 2: Title & Company */}
          <div className="text-sm text-gray-600 truncate mb-2">
            {prospect.title} · {prospect.company}
          </div>

          {/* Row 3: Badges (with flex-wrap) */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {priorityBadge && (
              <span 
                className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap"
                style={{ borderRadius: '4px' }}
              >
                {priorityBadge}
              </span>
            )}
            {prospect.signals.map((signal, idx) => {
              const badgeStyles = getBadgeColorStyles(signal, idx);
              return (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap"
                  style={{ 
                    borderRadius: '4px',
                    backgroundColor: badgeStyles.backgroundColor,
                    color: badgeStyles.color
                  }}
                >
                  {signal}
                </span>
              );
            })}
          </div>

          {/* Row 4: AI Insight */}
          <div className="flex items-start gap-1 text-sm text-gray-800">
            <span className="shrink-0 mt-0.5">✨</span>
            <span className="min-w-0">{prospect.context}</span>
          </div>
        </div>
      </div>
  );
}

// Research Accordion Component
function ResearchAccordion({ prospect }: { prospect: PriorityProspect }) {
  const [isResearchOpen, setIsResearchOpen] = useState(false);

  return (
    <div>
      {/* Research Accordion Toggle */}
      <button
        type="button"
        onClick={() => setIsResearchOpen(!isResearchOpen)}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 font-medium cursor-pointer transition-colors"
      >
        {isResearchOpen ? (
          <IconChevronDown className="w-4 h-4" />
        ) : (
          <IconChevronRight className="w-4 h-4" />
        )}
        <span>Research</span>
      </button>

      {/* Research Accordion Content */}
      {isResearchOpen && (
        <div className="mt-2">
          {/* Top Stats Grid */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <div className="grid grid-cols-2 divide-x divide-y divide-gray-200">
              {/* Cell 1: Signal Score */}
              <div className="flex justify-between p-3">
                <span className="text-sm text-gray-700">Signal Score</span>
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-md text-xs font-medium">
                  Hot 🔥
                </span>
              </div>
              {/* Cell 2: Fit */}
              <div className="flex justify-between p-3">
                <span className="text-sm text-gray-700">Fit</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-xs font-medium">
                  A+ 🚀
                </span>
              </div>
              {/* Cell 3: Email */}
              <div className="flex justify-between p-3">
                <span className="text-sm text-gray-700">Email</span>
                <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md text-xs font-medium">
                  Verified ✔
                </span>
              </div>
              {/* Cell 4: Phone */}
              <div className="flex justify-between p-3">
                <span className="text-sm text-gray-700">Phone</span>
                <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md text-xs font-medium">
                  Verified ✔
                </span>
              </div>
            </div>
          </div>

          {/* Talking Points Card */}
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <h4 className="text-base text-gray-900 mb-2">Talking Points</h4>
            {/* Tags Row */}
            <div className="mb-3">
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs mr-2 inline-block">
                Past Engagement
              </span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs mr-2 inline-block">
                Surging Intent
              </span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs inline-block">
                Finance Team Growth
              </span>
            </div>
            {/* Bullets */}
            <ul className="list-disc pl-4 text-sm text-gray-800 space-y-2">
              <li>{prospect.name} at {prospect.company} had 1 email thread with Acme.</li>
              <li>They were previously involved in discussions with Acme several months ago, along with other stakeholders, about addressing {prospect.company}'s data challenges.</li>
              <li>These challenges included slow reporting, data silos, and manual processes.</li>
              <li>While Acme proposed solutions like real-time dashboards, automated data integration, and self-service analytics, the deal did not progress due to budget constraints and limited resources.</li>
              <li>{prospect.name} highlighted these challenges and constraints during their interaction.</li>
            </ul>
          </div>

          {/* Local Time Card */}
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <span className="text-sm text-gray-600 mb-2 block text-left">Local Time</span>
            <span className="text-xl font-bold text-gray-900 block">12:30 AM</span>
            <span className="text-sm text-gray-500 block">PT</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface N2A3WorkModePanelProps {
  onClose?: () => void;
  mode: "queue" | "single";
  activeProspectIndex: number;
  onNext: () => void;
  onPrevious?: () => void;
  onSendEmail: (prospect: PriorityProspect, emailContent: string) => void;
}

/**
 * N2A3-specific Work Mode Panel component.
 * This component includes ProspectIdentityBlock, ResearchAccordion, and Draft Email.
 * Changes to this component should not affect N2A4.
 */
export function N2A3WorkModePanel({
  onClose,
  mode,
  activeProspectIndex,
  onNext,
  onPrevious,
  onSendEmail,
}: N2A3WorkModePanelProps) {
  const prospect = PRIORITY_PROSPECTS[activeProspectIndex];
  const [emailContent, setEmailContent] = useState(prospect?.draftEmail || "");
  const [recipientEmail, setRecipientEmail] = useState(prospect?.email || "");
  const [emailSubject, setEmailSubject] = useState("Let's reconnect");
  const [activeTab, setActiveTab] = useState<TabId>("messages");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRefinementDropdown, setShowRefinementDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update email content when prospect changes
  useEffect(() => {
    if (prospect) {
      setEmailContent(prospect.draftEmail);
      setRecipientEmail(prospect.email);
      setEmailSubject("Let's reconnect");
      setIsGenerating(false);
      setShowRefinementDropdown(false);
    }
  }, [prospect]);

  // Close dropdown when clicking outside
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
    
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false);
      // Mock refined content based on refinement type
      let refinedContent = emailContent;
      
      if (refinement === "Make it shorter") {
        const lines = emailContent.split('\n');
        const greeting = lines[0];
        const keyPoints = lines.filter(line => 
          line.includes('reconnect') || 
          line.includes('platform') || 
          line.includes('conversation') ||
          line.includes('call')
        ).slice(0, 2);
        refinedContent = `${greeting}\n\n${keyPoints.join('\n')}\n\nBest,\nRita`;
      } else if (refinement === "More formal") {
        refinedContent = emailContent
          .replace(/Hi /g, "Dear ")
          .replace(/Best,/g, "Best regards,")
          .replace(/I've/g, "I have")
          .replace(/I'd/g, "I would")
          .replace(/you're/g, "you are")
          .replace(/we're/g, "we are");
      } else if (refinement === "Friendlier") {
        refinedContent = emailContent
          .replace(/Dear /g, "Hi ")
          .replace(/Best regards,/g, "Best,")
          .replace(/I have/g, "I've")
          .replace(/I would/g, "I'd")
          .replace(/you are/g, "you're")
          .replace(/we are/g, "we're");
        if (!refinedContent.includes('!')) {
          refinedContent = refinedContent.replace(/\./g, (match, offset) => {
            if (offset < 100) return '!';
            return match;
          });
        }
      }
      
      setEmailContent(refinedContent);
    }, 1500);
  };

  if (!prospect) {
    return null;
  }

  const handleSendAndNext = () => {
    onSendEmail(prospect, emailContent);
    if (mode === "queue" && activeProspectIndex < PRIORITY_PROSPECTS.length - 1) {
      onNext();
    } else {
      onClose?.();
    }
  };

  const handlePrevious = () => {
    if (onPrevious && activeProspectIndex > 0) {
      onPrevious();
    }
  };

  const handleNext = () => {
    if (activeProspectIndex < PRIORITY_PROSPECTS.length - 1) {
      onNext();
    }
  };

  const handleSkip = () => {
    if (activeProspectIndex < PRIORITY_PROSPECTS.length - 1) {
      onNext();
    }
  };

  const isFirstProspect = activeProspectIndex === 0;
  const isLastProspect = activeProspectIndex === PRIORITY_PROSPECTS.length - 1;

  const handleChatSubmit = (message: string) => {
    console.log("Chat message:", message);
  };

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{
        backgroundColor: T.colors.background,
        borderLeft: `1px solid ${T.colors.border}`,
        fontFamily: T.typography.fontFamily,
      }}
    >
      {/* Header */}
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
            <span className="font-semibold" style={{ fontSize: T.typography.body, color: T.colors.text }}>Slackbot</span>
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

      {/* Tabs */}
      <div className="flex border-b shrink-0" style={{ borderColor: T.colors.border }}>
        <button
          type="button"
          onClick={() => setActiveTab("messages")}
          className={cn(
            "px-3 py-2.5 font-medium transition-colors",
            activeTab === "messages" ? "border-b-2" : "hover:text-[#1d1c1d]"
          )}
          style={activeTab === "messages" ? { color: T.colors.link, borderBottomColor: T.colors.link, fontSize: T.typography.small } : { color: T.colors.textSecondary, fontSize: T.typography.small }}
        >
          Messages
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={cn(
            "px-3 py-2.5 font-medium transition-colors",
            activeTab === "history" ? "border-b-2" : "hover:text-[#1d1c1d]"
          )}
          style={activeTab === "history" ? { color: T.colors.link, borderBottomColor: T.colors.link, fontSize: T.typography.small } : { color: T.colors.textSecondary, fontSize: T.typography.small }}
        >
          History
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("files")}
          className={cn(
            "px-3 py-2.5 font-medium transition-colors",
            activeTab === "files" ? "border-b-2" : "hover:text-[#1d1c1d]"
          )}
          style={activeTab === "files" ? { color: T.colors.link, borderBottomColor: T.colors.link, fontSize: T.typography.small } : { color: T.colors.textSecondary, fontSize: T.typography.small }}
        >
          Files
        </button>
        <button type="button" className="p-2 hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Add">
          <IconPlus width={T.iconSizes.slackbotTab} height={T.iconSizes.slackbotTab} stroke="currentColor" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
        {activeTab === "messages" && (
          <div className="flex-1 overflow-y-auto p-5 flex flex-col custom-scrollbar min-h-0">
            {/* Prospect Identity Block */}
            <div className="mb-6">
              <ProspectIdentityBlock prospect={prospect} priority={isFirstProspect ? "hot" : "warm"} />
            </div>

            {/* Research Accordion */}
            <div className="mb-6">
              <ResearchAccordion prospect={prospect} />
            </div>

            {/* Draft Email Header */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-900">Draft Email</h3>
                <div className="flex items-center gap-1">
                  {/* Sparkle Icon - Refinement Dropdown */}
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
                        <button
                          type="button"
                          onClick={() => handleRefinement("Make it shorter")}
                          className="w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer text-left transition-colors"
                        >
                          Make it shorter
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRefinement("More formal")}
                          className="w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer text-left transition-colors"
                        >
                          More formal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRefinement("Friendlier")}
                          className="w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer text-left transition-colors"
                        >
                          Friendlier
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Pencil Icon - Manual Edit Indicator */}
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-100 rounded text-gray-500 cursor-pointer transition-colors"
                    title="Edit manually"
                  >
                    <IconPencil width={16} height={16} strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* To Field */}
              <div className="mb-2">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none text-gray-800"
                  style={{
                    backgroundColor: T.colors.background,
                    fontFamily: T.typography.fontFamily,
                  }}
                  placeholder="recipient@example.com"
                />
              </div>

              {/* Subject Field */}
              <div className="mb-3">
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none text-gray-800"
                  style={{
                    backgroundColor: T.colors.background,
                    fontFamily: T.typography.fontFamily,
                  }}
                  placeholder="Email subject"
                />
              </div>

              {/* Editable Text Area with Loading State */}
              <div className="border border-gray-300 rounded-md p-3 min-h-[200px]">
                {isGenerating ? (
                  // Shimmer Loading State
                  <div className="space-y-2">
                    <div className="animate-pulse bg-gray-200 h-4 rounded w-full"></div>
                    <div className="animate-pulse bg-gray-200 h-4 rounded w-5/6"></div>
                    <div className="animate-pulse bg-gray-200 h-4 rounded w-full"></div>
                    <div className="animate-pulse bg-gray-200 h-4 rounded w-4/5"></div>
                    <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="animate-pulse bg-gray-200 h-4 rounded w-5/6 mt-2"></div>
                  </div>
                ) : (
                  <textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    disabled={isGenerating}
                    className="w-full min-h-[200px] resize-y text-sm text-gray-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed leading-normal"
                    style={{
                      backgroundColor: "transparent",
                      fontFamily: T.typography.fontFamily,
                      lineHeight: "1.5",
                      caretColor: "#1d1c1d",
                    }}
                    placeholder="Email draft will appear here..."
                  />
                )}
              </div>

              {/* Primary Action Bar */}
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
          </div>
        )}
        {(activeTab === "history" || activeTab === "files") && (
          <div className="p-4" style={{ fontSize: T.typography.small, color: T.colors.textSecondary }}>Coming soon.</div>
        )}
      </div>

      {/* Message Input */}
      <div className="shrink-0 border-t" style={{ borderColor: T.colors.border }}>
        <MessageInput
          placeholder="Message Slackbot..."
          onSendMessage={handleChatSubmit}
        />
      </div>
    </div>
  );
}
