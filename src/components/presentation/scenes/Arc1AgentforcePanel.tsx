"use client";

import { motion } from "framer-motion";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import Image from "next/image";
import { IconStar, IconPencil, IconMoreVertical, IconX, IconChevronDown, IconSearch, IconFilter, IconMessage, IconLightbulb, IconUsers } from "@/components/icons";
import { MessageInput } from "@/components/shared/MessageInput";
import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Reusable SlackButton component for consistent CTA styling
interface SlackButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const SlackButton = memo(function SlackButton({ 
  children, 
  onClick, 
  className = "", 
  disabled = false,
  type = "button"
}: SlackButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-white border border-gray-300 text-gray-900 font-semibold text-sm px-4 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center whitespace-nowrap ${className}`}
    >
      {children}
    </button>
  );
});

// Universal ToolIcon component with native Slack-style tooltip
interface ToolIconProps {
  name: string;
  size?: "sm" | "md";
  showInStack?: boolean; // If true, renders for avatar stack (with border-white)
}

const ToolIcon = memo(function ToolIcon({ name, size = "md", showInStack = false }: ToolIconProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  
  // Strict mapping: tool names to exact PNG filenames (handling spaces with encodeURI)
  const toolMap: Record<string, string> = {
    "Salesforce": "/Salesforce.png",
    "Gmail": "/Gmail.png",
    "Highspot": "/Highspot.png",
    "Gong": "/gong.png", // Lowercase filename
    "Google Calendar": "/Google Calendar.png", // Exact string with space
    "Google Drive": "/Google Drive.png", // Exact string with space
    "Clari": "/Clari.png",
    "Salesloft": "/salesloft.png", // Lowercase filename
    "Slack": "/Slack.png",
  };

  const iconPath = toolMap[name] || null;
  // Keep original path - Next.js handles spaces in public folder paths
  const encodedPath = iconPath;
  const sizeClasses = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  const pixelSize = size === "sm" ? 16 : 24;

  // Generate fallback with initials
  const getInitials = (toolName: string): string => {
    return toolName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageError = React.useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.preventDefault();
    setImageError(true);
    setImageLoaded(false);
  }, []);

  const handleImageLoad = React.useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  // Preload image on mount
  React.useEffect(() => {
    if (!encodedPath) {
      setImageError(true);
      return;
    }

    // Create a new image to test loading - use window.Image to avoid conflict with Next.js Image import
    const testImg = new window.Image();
    testImg.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    testImg.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
    };
    testImg.src = encodedPath;

    return () => {
      testImg.onload = null;
      testImg.onerror = null;
    };
  }, [encodedPath]);

  const showFallback = !encodedPath || imageError || !imageLoaded;
  const shouldShowImage = encodedPath && imageLoaded && !imageError;

  return (
    <div className={`group relative cursor-pointer ${showInStack ? 'relative' : 'inline-flex items-center justify-center'}`} style={{ position: 'relative' }}>
      {/* Fallback: colored circle with initials - shown by default */}
      <div
        className={`${sizeClasses} rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold ${showInStack ? 'border-2 border-white relative' : ''}`}
        style={{ 
          backgroundColor: '#611f69',
          fontSize: size === "sm" ? '8px' : '10px',
          display: showFallback ? 'flex' : 'none'
        }}
        title={name}
        aria-label={name}
      >
        {getInitials(name)}
      </div>
      {/* Invisible img for error detection - prevents broken icon display */}
      {shouldShowImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={encodedPath}
          alt=""
          style={{ 
            position: 'absolute',
            width: 0,
            height: 0,
            opacity: 0,
            visibility: 'hidden',
            pointerEvents: 'none',
            zIndex: -1
          }}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
      {/* Use background-image div instead of img to avoid broken image icons */}
      {shouldShowImage && (
        <div
          className={`${sizeClasses} shrink-0 ${showInStack ? 'rounded-full border-2 border-white bg-white relative' : ''}`}
          style={{ 
            backgroundImage: `url(${encodedPath})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative'
          }}
          title={name}
          aria-label={name}
          role="img"
        />
      )}
      {/* Tooltip with bottom nubbin */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block pointer-events-none z-[100]">
        <div className="bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap relative">
          {name}
          {/* Bottom nubbin (triangle) */}
          <div className="absolute top-full left-1/2 -translate-x-1/2">
            <div className="w-0 h-0 border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      </div>
    </div>
  );
});

// ReplyDivider component - native Slack thread divider (text on left, line extends right)
const ReplyDivider = memo(function ReplyDivider({ replyCount = 1 }: { replyCount?: number }) {
  return (
    <div data-agent-role="reply-divider" className="relative py-2">
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t"
        style={{ borderTopColor: '#D1D5DB', borderTopWidth: '1px' }}
      />
      <span
        className="relative inline-flex items-center text-xs font-semibold pr-2"
        style={{ color: '#616061', backgroundColor: '#ffffff' }}
      >
        {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
      </span>
    </div>
  );
});

// ToolIconStack component for overlapping avatar group pattern
interface ToolIconStackProps {
  tools: string[];
  maxVisible?: number;
  size?: "sm" | "md";
}

const ToolIconStack = memo(function ToolIconStack({ tools, maxVisible = 4, size = "md" }: ToolIconStackProps) {
  const visibleTools = tools.slice(0, maxVisible);
  const remainingCount = Math.max(0, tools.length - maxVisible);
  const sizeClasses = size === "sm" ? "w-4 h-4" : "w-6 h-6";

  return (
    <div className="flex -space-x-2 flex-row-reverse justify-end items-center">
      {/* Render visible icons in reverse order (rightmost first) for proper overlapping */}
      {[...visibleTools].reverse().map((tool, index) => (
        <div key={`${tool}-${index}`} style={{ zIndex: 10 + index }}>
          <ToolIcon name={tool} size={size} showInStack={true} />
        </div>
      ))}
      {/* +N counter if there are more tools */}
      {remainingCount > 0 && (
        <div className={`flex items-center justify-center ${sizeClasses} rounded-full border-2 border-white bg-blue-50 text-[10px] font-bold text-blue-600 z-0 relative group cursor-pointer`}>
          +{remainingCount}
          {/* Tooltip for remaining tools */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block pointer-events-none z-[100]">
            <div className="bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap relative">
              {tools.slice(maxVisible).join(", ")}
              {/* Bottom nubbin */}
              <div className="absolute top-full left-1/2 -translate-x-1/2">
                <div className="w-0 h-0 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// Helper function to parse tool names from text and inject ToolIcon components
function parseTextWithToolIcons(text: string, iconSize: "sm" | "md" = "sm"): React.ReactNode[] {
  // Match tool names with optional colon (e.g., "Gmail:" or "Gmail")
  const toolPatterns: Array<{ pattern: RegExp; name: string }> = [
    { pattern: /\bSalesforce\b:?/gi, name: "Salesforce" },
    { pattern: /\bGmail\b:?/gi, name: "Gmail" },
    { pattern: /\bHighspot\b:?/gi, name: "Highspot" },
    { pattern: /\bGong\b:?/gi, name: "Gong" },
    { pattern: /\bGoogle Calendar\b:?/gi, name: "Google Calendar" },
    { pattern: /\bGoogle Drive\b:?/gi, name: "Google Drive" },
    { pattern: /\bClari\b:?/gi, name: "Clari" },
    { pattern: /\bSalesloft\b:?/gi, name: "Salesloft" },
    { pattern: /\bSlack\b:?/gi, name: "Slack" },
  ];

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const matches: Array<{ index: number; name: string; length: number }> = [];

  // Find all tool matches
  toolPatterns.forEach(({ pattern, name }) => {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    // Reset regex lastIndex to avoid issues
    regex.lastIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        name,
        length: match[0].length,
      });
    }
  });

  // Sort matches by index
  matches.sort((a, b) => a.index - b.index);

  // Build parts array with text and icons
  matches.forEach((match) => {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    // Add icon (replace the tool name + colon with just the icon)
    parts.push(
      <span key={`${match.index}-${match.name}`} className="inline-flex items-center justify-center gap-1" style={{ verticalAlign: 'middle' }}>
        <ToolIcon name={match.name} size={iconSize} />
      </span>
    );
    lastIndex = match.index + match.length;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// Module-level Set to track if confirmation message has become static
const staticConfirmations = new Set<string>();
// Module-level flag to prevent animation restart - more robust than refs
const animationStartedFlags = new Set<string>();
// Module-level flag to track checklist completion - survives remounts
const checklistCompletedFlags = new Set<string>();
// Module-level flag to prevent completion callback from firing multiple times
const completionCallbackFired = new Set<string>();
// Module-level counter to track confirmation count - survives remounts
let prevConfirmationCount = 0;

// Reset function to clear static state (called when Scene 1 resets)
export function resetConfirmationMemory() {
  staticConfirmations.clear();
  animationStartedFlags.clear();
  checklistCompletedFlags.clear();
  completionCallbackFired.clear();
  prevConfirmationCount = 0;
}

const T = SLACK_TOKENS;

// Stable checklist items array - defined outside component to prevent re-renders
// This will be populated with dynamic values when component renders
const getChecklistItems = (targetK: number, stepperValue: number): string[] => [
  `$${targetK}K committed. Here's what just happened:`,
  "Quota logged in Salesforce — confirmed",
  "Scanning Gong transcripts for buyer-risk signals",
  "Syncing Highspot decks and recent engagement history",
  "Validating Clari forecast against live pipeline movement",
  "Salesloft cadence updated: 8 named accounts prioritized",
  "Google Calendar protected: 2 mornings blocked for deep work",
  "Drafting Gmail follow-up for Sarah (saved to drafts)",
  "Deal Room Created: #deal-acme-q1-strategic",
  "Team Onboarded: @Rita, @Priya, and @Jordan synced to playbook",
  "Engagement Tracking Active: sentiment monitoring enabled across Acme threads",
];

function getChecklistDelay(text: string): number {
  // Variable rhythms for realism: CRM fast, transcript/email scanning slower.
  const lower = text.toLowerCase();
  if (lower.includes("salesforce") || lower.includes("salesloft") || lower.includes("calendar")) {
    return 200;
  }
  if (lower.includes("gong") || lower.includes("gmail") || lower.includes("highspot")) {
    return 1200;
  }
  if (lower.includes("clari")) {
    return 900;
  }
  return 600;
}

// Clean, stable AnimatedChecklist component - built from scratch with pure React logic
export const AnimatedChecklist = memo(({ 
  items, 
  onComplete,
  containerRef 
}: { 
  items: string[]; 
  onComplete?: () => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}) => {
  // Use stable key to track completion across remounts
  // This is the 2nd checklist (confirmation checklist) - the one that should trigger scroll
  const checklistKey = "confirmation-checklist";
  const [step, setStep] = useState(() => {
    // If already completed, start at the end
    if (checklistCompletedFlags.has(checklistKey)) {
      return items.length;
    }
    return 0;
  });
  const [showCheckmarks, setShowCheckmarks] = useState<Set<number>>(() => {
    // If already completed, show all checkmarks
    if (checklistCompletedFlags.has(checklistKey)) {
      return new Set(items.map((_, i) => i));
    }
    return new Set();
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Safely store the onComplete function so it never triggers a useEffect restart
  const savedOnComplete = useRef(onComplete);
  useEffect(() => {
    savedOnComplete.current = onComplete;
  }, [onComplete]);

  // 1. Nudge the scroll every time a new item appears (Grow-With-Me scroll)
  // DISABLED: This was interfering with the final scroll to next-steps
  // The checklist has fixed height, so items will be visible without this scroll
  // useEffect(() => {
  //   if (step > 0 && step < items.length) {
  //     // Small delay to ensure DOM has updated with new item
  //     const scrollTimer = setTimeout(() => {
  //       // Scroll the container (which will scroll the parent) to keep spinner in view
  //       if (containerRef?.current) {
  //         containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  //       } else if (scrollRef.current) {
  //         // Fallback: scroll the tracker div itself
  //         scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  //       }
  //     }, 150);
  //     return () => clearTimeout(scrollTimer);
  //   }
  // }, [step, containerRef, items.length]);

  // The single, master timer - shows spinner, then checkmark, then moves to next item
  useEffect(() => {
    // CRITICAL: If already completed (module-level check), don't restart
    if (checklistCompletedFlags.has(checklistKey) || step >= items.length) {
      return;
    }

    if (step < items.length) {
      const itemText = items[step] || "";
      const itemDelay = getChecklistDelay(itemText);
      const checkmarkDelay = Math.min(350, Math.floor(itemDelay * 0.55));

      // Show checkmark for current item before advancing.
      const checkmarkTimer = setTimeout(() => {
        setShowCheckmarks(prev => {
          const newSet = new Set(prev);
          newSet.add(step);
          return newSet;
        });
      }, checkmarkDelay);

      // Move to next step with variable rhythm.
      const stepTimer = setTimeout(() => {
        setStep(prev => {
          const next = prev + 1;
          // Mark as completed when we reach the end (module-level, survives remounts)
          if (next >= items.length) {
            checklistCompletedFlags.add(checklistKey);
            // Trigger completion callback only once (module-level check prevents multiple calls)
            if (!completionCallbackFired.has(checklistKey) && savedOnComplete.current) {
              completionCallbackFired.add(checklistKey);
              setTimeout(() => {
                if (savedOnComplete.current) {
                  savedOnComplete.current();
                }
              }, 250);
            }
          }
          return next;
        });
      }, itemDelay);

      return () => {
        clearTimeout(checkmarkTimer);
        clearTimeout(stepTimer);
      };
    }
  }, [step, items.length, checklistKey]);

  return (
    <div className="space-y-1 min-h-[320px] overflow-y-auto">
      {items.map((text, index) => {
        // Render all completed items plus the currently-processing item.
        // This guarantees the spinner is visible before each checkmark appears.
        if (step < items.length && index > step) {
          return null;
        }

        const showCheckmark = showCheckmarks.has(index);
        const isCurrentItem = step < items.length && index === step;
        const isSpinning = isCurrentItem && !showCheckmark;
        const textColor = isSpinning ? '#616061' : '#1d1c1d';
        return (
          <div
            key={index}
            className="flex items-center gap-2 text-[15px]"
            style={{ 
              minHeight: '21px'
            }}
          >
            {isSpinning ? (
              <motion.div
                className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full flex-shrink-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
              />
            ) : showCheckmark ? (
              <span
                className="font-semibold flex-shrink-0 flex items-center justify-center w-4 h-4"
                style={{ color: '#16a34a', lineHeight: '1' }}
              >
                ✓
              </span>
            ) : (
              <div className="w-4 h-4 flex-shrink-0" />
            )}
            <span style={{ color: textColor, lineHeight: '1.5' }} className="inline-flex items-center gap-1 flex-wrap">
              {parseTextWithToolIcons(text, "sm")}
            </span>
          </div>
        );
      })}
      {/* Growth tracker - invisible div at bottom that triggers scroll as items appear */}
      <div ref={scrollRef} style={{ height: '1px', visibility: 'hidden' }} />
    </div>
  );
});

type Screen = 1 | 2 | 3 | 4 | 5;

// High-density data pulling items - shows depth of AI analysis across ecosystem
// Order and delays are critical for realistic rhythmic progression
const DATA_PULL_ITEMS = [
  "Connecting to Sales Cloud... Authenticated", // [200ms]
  "Scanning Q4 Gong transcripts: Identified 12 'Budget' objections", // [1200ms]
  "Syncing with Highspot: 3 decks shared with Acme Corp last week", // [800ms]
  "Extracting 'Decision Criteria' from recent Gong recordings", // [1000ms]
  "Validating Clari forecast history vs. real-time pipeline", // [600ms]
  "Aggregating cross-functional 'Slack Sentiment' from deal channels", // [400ms]
  "Inherited pipeline loaded: $1.2M · 14 deals",
  "Q4 velocity analysed: win rate, cycle, deal size",
  "Closing pattern mapped: 68% personal vs 41% delegated",
  "Deal stage distribution: Discovery 32%, Negotiation 28%, Closed 40%",
  "Account engagement scores: 12 accounts flagged for high-touch",
  "Meeting frequency patterns: Tues-Thurs peak conversion windows",
  "Email response rates: 4.2hr avg response time correlates with 2.3x close rate",
  "Pipeline health metrics: $340K at risk, 3 deals need attention",
  "Historical Q3 performance: 52% win rate, 48-day avg cycle",
  "Capacity constraints identified: 8 active deals max for optimal rate",
  "Three scenarios modelled. Here's your Q1.",
];

// Helper function to identify which tool icon should appear for a given text item
function getToolIconForText(text: string): string | null {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('sales cloud') || lowerText.includes('salesforce')) {
    return "Salesforce";
  }
  if (lowerText.includes('gong')) {
    return "Gong";
  }
  if (lowerText.includes('highspot')) {
    return "Highspot";
  }
  if (lowerText.includes('clari')) {
    return "Clari";
  }
  if (lowerText.includes('slack sentiment') || lowerText.includes('slack')) {
    return "Slack";
  }
  if (lowerText.includes('meeting frequency') || (lowerText.includes('meeting') && lowerText.includes('pattern'))) {
    return "Google Calendar";
  }
  return null;
}

// Determine loading speed based on item index for exact rhythmic control
// First 6 items have specific delays, rest use intelligent defaults
const getItemDelay = (itemText: string, index: number): number => {
  // Exact delays for first 6 ecosystem items (reduced for faster animation)
  const exactDelays: Record<number, number> = {
    0: 120,   // Connecting to Sales Cloud
    1: 700,   // Scanning Q4 Gong transcripts
    2: 500,   // Syncing with Highspot
    3: 600,   // Extracting Decision Criteria
    4: 350,   // Validating Clari forecast
    5: 250,   // Aggregating Slack Sentiment
  };
  
  if (index in exactDelays) {
    return exactDelays[index];
  }
  
  // Intelligent defaults for remaining items (reduced for faster animation)
  const lowerText = itemText.toLowerCase();
  // Fast (120ms): Status checks
  if (lowerText.includes('connecting') || lowerText.includes('authenticated') || 
      lowerText.includes('loaded') || lowerText.includes('validating')) {
    return 120;
  }
  // Medium (350ms): Syncing apps
  if (lowerText.includes('syncing') || lowerText.includes('cross-referencing')) {
    return 350;
  }
  // Slow (700ms): Analysis tasks
  if (lowerText.includes('scanning') || lowerText.includes('processing') || 
      lowerText.includes('analysed') || lowerText.includes('analysing') ||
      lowerText.includes('modelled')) {
    return 700;
  }
  // Default to medium for other items
  return 350;
};

// Loading reveals component - uses spinner → tick pattern with variable speeds for realism
function LoadingRevealsComponent({ onComplete }: { onComplete?: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showCheckmarks, setShowCheckmarks] = useState<Set<number>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Safely store the onComplete function so it never triggers a useEffect restart
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Event-driven progression with variable speeds - each item has its own realistic delay
  useEffect(() => {
    if (activeIndex >= DATA_PULL_ITEMS.length) {
      // All items complete - ensure final checkmark is shown, then fire callback
      setShowCheckmarks(prevCheckmarks => {
        const newSet = new Set(prevCheckmarks);
        // Ensure the last item (activeIndex - 1) has a checkmark
        if (activeIndex > 0) {
          newSet.add(activeIndex - 1);
        }
        return newSet;
      });
      if (onCompleteRef.current) {
        setTimeout(() => onCompleteRef.current!(), 300);
      }
      return;
    }

    // Get variable delay for current item (pass index for exact delay mapping)
    const currentItem = DATA_PULL_ITEMS[activeIndex];
    const itemDelay = getItemDelay(currentItem, activeIndex);
    const checkmarkDelay = Math.min(180, itemDelay); // Show checkmark before or at same time as moving to next

    // Show checkmark for current item (ensure it always appears)
    const checkmarkTimer = setTimeout(() => {
      setShowCheckmarks(prevCheckmarks => {
        const newSet = new Set(prevCheckmarks);
        newSet.add(activeIndex);
        return newSet;
      });
    }, checkmarkDelay);

    // Move to next item after variable delay
    timerRef.current = setTimeout(() => {
      // Ensure checkmark is added before moving to next item
      setShowCheckmarks(prevCheckmarks => {
        const newSet = new Set(prevCheckmarks);
        newSet.add(activeIndex);
        return newSet;
      });
      setActiveIndex(prev => prev + 1);
    }, itemDelay);

    return () => {
      clearTimeout(checkmarkTimer);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [activeIndex]);

  return (
    <div className="space-y-1 min-h-[420px] overflow-y-auto">
      {DATA_PULL_ITEMS.map((text, index) => {
        // Render completed items plus the currently-processing row.
        // This guarantees spinner -> gray text -> green check progression.
        if (activeIndex < DATA_PULL_ITEMS.length && index > activeIndex) {
          return null;
        }

        const showCheckmark = showCheckmarks.has(index);
        const isCurrentItem = activeIndex < DATA_PULL_ITEMS.length && index === activeIndex;
        const isSpinning = isCurrentItem && !showCheckmark;
        const textColor = isSpinning ? '#616061' : '#1d1c1d';
        return (
          <div
            key={index}
            className="flex items-center gap-2 text-[15px]"
            style={{ 
              minHeight: '21px'
            }}
          >
            {isSpinning ? (
              <motion.div
                className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full flex-shrink-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
              />
            ) : showCheckmark ? (
              <span
                className="font-semibold flex-shrink-0 flex items-center justify-center w-4 h-4"
                style={{ color: '#16a34a', lineHeight: '1' }}
              >
                ✓
              </span>
            ) : (
              <div className="w-4 h-4 flex-shrink-0" />
            )}
            {/* Tool icon - appears between checkmark and text */}
            {(() => {
              const toolName = getToolIconForText(text);
              return toolName ? (
                <div className="flex-shrink-0">
                  <ToolIcon name={toolName} size="sm" />
                </div>
              ) : null;
            })()}
            <span style={{ color: textColor, lineHeight: '1.5' }} className="flex-1">
              {text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface Arc1AgentforcePanelProps {
  currentScreen: Screen; // Kept for backward compatibility with arcNavigation
  panelFeed: PanelFeedItem[]; // Array-based feed for incremental rendering
  stepperValue: number;
  onStepperChange: (value: number) => void;
  onApprove: () => void;
  onLoadingComplete?: () => void; // Callback when data pull loading completes
  onChecklistComplete?: () => void; // Callback when checklist animation completes
  onEnterDealRoom?: () => void; // Callback when "Enter Acme Deal Room" is clicked
  onReviewHeatmap?: () => void; // Callback when "Review Heatmap Analysis" is clicked
  onViewActivities?: () => void; // Callback when "View Account Activities" is clicked
  onMessageSend?: (message: string) => void;
  onScreenChange?: (screen: Screen) => void;
  onQuickPrompt?: (prompt: string) => void;
  onClose?: () => void;
}

// Linear interpolation functions
function calculateCommission(target: number): number {
  return Math.round(target * 0.14);
}

function calculateAIWorkload(target: number): number {
  // Linear interpolation: 400 tasks at $400K, 1,240 tasks at $600K+
  const minTarget = 400000;
  const maxTarget = 600000;
  const minTasks = 400;
  const maxTasks = 1240;
  
  if (target <= minTarget) return minTasks;
  if (target >= maxTarget) return maxTasks;
  
  const ratio = (target - minTarget) / (maxTarget - minTarget);
  return Math.round(minTasks + (maxTasks - minTasks) * ratio);
}

function calculateClientFacingHours(target: number): number {
  // Inverse scaling: 7 hrs at $500K, 9 hrs at $600K+
  const minTarget = 400000;
  const maxTarget = 600000;
  const minHours = 6;
  const maxHours = 9;
  
  if (target <= minTarget) return minHours;
  if (target >= maxTarget) return maxHours;
  
  const ratio = (target - minTarget) / (maxTarget - minTarget);
  return Math.round((minHours + (maxHours - minHours) * ratio) * 10) / 10;
}

function calculatePipelineGap(target: number): number {
  const inheritedPipeline = 1200000;
  const winRate = 0.52; // 52% win rate
  // Expected close from pipeline = pipeline * win rate
  const expectedClose = inheritedPipeline * winRate;
  // Gap = target - expected close (what we can realistically expect from pipeline)
  return Math.max(0, target - expectedClose);
}

function calculateInternalMeetings(target: number): number {
  // As quota increases, internal sync overhead grows (3 -> 7/week).
  if (target <= 500000) return 3;
  if (target >= 700000) return 7;
  return 3 + Math.round((target - 500000) / 50000);
}

function calculatePersonalEngagementDeals(target: number): number {
  // At $500K: 6 of 14, At $600K+: 4 of 14 (focused on highest value)
  if (target >= 600000) return 4;
  return 6;
}

function calculateDilutionRisk(target: number): { level: "Low" | "Medium" | "High"; color: string } {
  if (target >= 650000) return { level: "High", color: "#dc2626" }; // red
  if (target >= 550000) return { level: "Medium", color: "#f59e0b" }; // yellow
  return { level: "Low", color: "#10b981" }; // green
}

function calculateProjectedWinRate(target: number): number {
  // Agentic Recommendation Engine: Optimal quota is $615K with 56.4% win rate
  // Base: 52% at $500K
  // Optimal: 56.4% at $615K (via agentic follow-ups)
  // Dilution: Drops below 50% past $640K
  const OPTIMAL_QUOTA = 615000;
  const OPTIMAL_WIN_RATE = 56.4;
  const BASE_QUOTA = 500000;
  const BASE_WIN_RATE = 52;
  const DILUTION_THRESHOLD = 640000;
  const MIN_WIN_RATE = 44; // At $700K+
  
  if (target <= BASE_QUOTA) {
    return BASE_WIN_RATE;
  } else if (target <= OPTIMAL_QUOTA) {
    // Increasing toward optimal: Linear interpolation from 52% to 56.4%
    const ratio = (target - BASE_QUOTA) / (OPTIMAL_QUOTA - BASE_QUOTA);
    return Math.round((BASE_WIN_RATE + (OPTIMAL_WIN_RATE - BASE_WIN_RATE) * ratio) * 10) / 10;
  } else if (target <= DILUTION_THRESHOLD) {
    // Between optimal and dilution threshold: Gradual decline from 56.4% to 50%
    const ratio = (target - OPTIMAL_QUOTA) / (DILUTION_THRESHOLD - OPTIMAL_QUOTA);
    return Math.round((OPTIMAL_WIN_RATE - (OPTIMAL_WIN_RATE - 50) * ratio) * 10) / 10;
  } else {
    // Past dilution threshold: Steep decline to minimum
    const ratio = Math.min(1, (target - DILUTION_THRESHOLD) / (700000 - DILUTION_THRESHOLD));
    return Math.round((50 - (50 - MIN_WIN_RATE) * ratio) * 10) / 10;
  }
}

// Permanent Panel Header Component
function PanelHeader({ 
  activeTab, 
  onTabChange, 
  onClose 
}: { 
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose?: () => void;
}) {
  const tabs = [
    { id: 'seller-edge', label: 'Seller Edge' },
    { id: 'messages', label: 'Messages' },
    { id: 'history', label: 'History' },
    { id: 'files', label: 'Files' },
  ];

  return (
    <div className="border-b shrink-0" style={{ borderColor: T.colors.border }}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Favorite">
            <IconStar width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
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
          <button 
            type="button" 
            className="p-1.5 rounded hover:bg-[#f8f8f8]" 
            style={{ color: T.colors.textSecondary }} 
            title="Close"
            onClick={onClose}
          >
            <IconX width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
          </button>
        </div>
      </div>
      {/* Tab Bar */}
      <div className="flex items-center border-b" style={{ borderColor: T.colors.border }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="px-3 py-2.5 font-medium relative"
              style={{
                fontSize: T.typography.small,
                color: isActive ? "#6B21A8" : T.colors.textSecondary,
                borderBottom: isActive ? "2px solid #6B21A8" : "none",
              }}
            >
              {tab.label}
            </button>
          );
        })}
        <button type="button" className="p-2 hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Add">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Permanent Input Box Component
function PanelInputBox({ 
  onSubmit, 
  value, 
  onChange 
}: { 
  onSubmit: (message: string) => void; 
  value: string; 
  onChange: (value: string) => void;
}) {
  return (
    <div className="shrink-0 border-t bg-white" style={{ borderColor: T.colors.border }}>
      <div className="p-3">
        <MessageInput
          placeholder="Message Slackbot..."
          onSubmit={onSubmit}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

// Screen 1 Body Content
function Screen1Body({ onScreenChange }: { onScreenChange?: (screen: Screen) => void }) {
  return (
    <div className="p-6" style={{ backgroundColor: "#ffffff" }}>
      {/* Zone A: Greeting */}
      <div className="py-8 px-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white border-2" style={{ borderColor: "#E0E0E0" }}>
            <Image src="/slackbot-logo.svg" alt="Slackbot" width={80} height={80} className="object-contain" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "#000000", fontSize: "20px" }}>
          Good morning, Rita!
        </h2>
        <p className="text-sm" style={{ color: "#666666", fontSize: "14px" }}>
          Q1 starts today. Here's how Q4 looked.
        </p>
      </div>

      {/* Zone B: 2×2 Q4 Insight Grid */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Q4 ATTAINMENT */}
          <div
            className="bg-white rounded-lg p-4"
            style={{
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              borderRadius: "8px",
            }}
          >
            <div className="text-[11px] uppercase mb-2" style={{ color: "#888", fontWeight: 600, letterSpacing: "0.5px" }}>
              Q4 ATTAINMENT
            </div>
            <div className="text-[28px] font-bold mb-1" style={{ color: "#000000" }}>
              $471K
            </div>
            <div className="text-xs" style={{ color: "#666", fontSize: "12px" }}>
              94% of $500K
            </div>
          </div>

          {/* Card 2: WIN RATE */}
          <div
            className="bg-white rounded-lg p-4"
            style={{
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              borderRadius: "8px",
            }}
          >
            <div className="text-[11px] uppercase mb-2" style={{ color: "#888", fontWeight: 600, letterSpacing: "0.5px" }}>
              WIN RATE
            </div>
            <div className="text-[28px] font-bold mb-1" style={{ color: "#000000" }}>
              52%
            </div>
            <div className="text-xs" style={{ color: "#666", fontSize: "12px" }}>
              ↑ from 48% Q3
            </div>
          </div>

          {/* Card 3: TOP DEAL */}
          <div
            className="bg-white rounded-lg p-4"
            style={{
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              borderRadius: "8px",
            }}
          >
            <div className="text-[11px] uppercase mb-2" style={{ color: "#888", fontWeight: 600, letterSpacing: "0.5px" }}>
              TOP DEAL
            </div>
            <div className="text-[28px] font-bold mb-1" style={{ color: "#000000" }}>
              $89K
            </div>
            <div className="text-xs" style={{ color: "#666", fontSize: "12px" }}>
              Acme Corp · Dec
            </div>
          </div>

          {/* Card 4: ⚠️ MISSED (Amber treatment) */}
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: "#FFFBF0",
              borderLeft: "3px solid #A57401",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              borderRadius: "8px",
            }}
          >
            <div className="text-[11px] uppercase mb-2 flex items-center gap-1" style={{ color: "#888", fontWeight: 600, letterSpacing: "0.5px" }}>
              <span>⚠️</span> MISSED
            </div>
            <div className="text-[28px] font-bold mb-1" style={{ color: "#000000" }}>
              $29K short
            </div>
            <div className="text-xs" style={{ color: "#666", fontSize: "12px" }}>
              = $4K left on the table
            </div>
          </div>
        </div>
      </div>

      {/* Zone C: 4 Prompt Buttons */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => onScreenChange?.(2)}
            className="px-3.5 py-2.5 rounded-lg font-medium text-sm transition-colors border hover:bg-gray-50"
            style={{
              backgroundColor: "#ffffff",
              color: "#1d1c1d",
              borderColor: "#E0E0E0",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            🎯 Plan my Q1
          </button>
          <button
            type="button"
            className="px-3.5 py-2.5 rounded-lg font-medium text-sm transition-colors border"
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
              borderColor: "#E0E0E0",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f8f8f8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            📊 Q4 deep dive
          </button>
          <button
            type="button"
            className="px-3.5 py-2.5 rounded-lg font-medium text-sm transition-colors border"
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
              borderColor: "#E0E0E0",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F3EEFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            ⚠️ At-risk deals
          </button>
          <button
            type="button"
            className="px-3.5 py-2.5 rounded-lg font-medium text-sm transition-colors border"
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
              borderColor: "#E0E0E0",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F3EEFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            📅 Today's plate
          </button>
        </div>
      </div>
    </div>
  );
}

// Screen 2 Body Content
function Screen2Body({ onLoadingComplete }: { onLoadingComplete?: () => void }) {
  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      <div className="flex items-start gap-3 mb-6">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <Image src="/slackbot-logo.svg" alt="Slackbot" width={32} height={32} />
        </div>
        <div className="flex-1">
          <p className="text-[15px] mb-4" style={{ color: "#1d1c1d" }}>
            On it. Pulling your data now... <span className="inline-block animate-pulse">•••</span>
          </p>
          <div className="mb-6">
            <LoadingRevealsComponent onComplete={onLoadingComplete} />
          </div>
        </div>
      </div>

      {/* Pulsing Skeleton Cards */}
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg opacity-50" />
        ))}
      </div>
    </div>
  );
}

// Active Strategy Widget - Compact read-only summary post-approval
const ActiveStrategyWidget = memo(function ActiveStrategyWidget({
  stepperValue,
  projectedWinRate,
  onAdjustStrategy,
}: {
  stepperValue: number;
  projectedWinRate: number;
  onAdjustStrategy: () => void;
}) {
  const targetK = Math.round(stepperValue / 1000);
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.3 }}
      className="mb-6 p-4 rounded-xl border flex justify-between items-center"
      style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}
    >
      <div className="text-sm font-medium" style={{ color: "#1d1c1d" }}>
        🎯 Q1 Active Strategy: ${targetK.toLocaleString()}K Target | {projectedWinRate.toFixed(1)}% Win Rate
      </div>
      <SlackButton onClick={onAdjustStrategy}>
        ⚙️ Adjust Strategy
      </SlackButton>
    </motion.div>
  );
});

// Agent Tool Hub - Workflow cards post-approval
const AgentToolHub = memo(function AgentToolHub() {
  const tools = [
    {
      id: 'deal-room-architect',
      title: 'Deal Room Architect',
      subtext: 'Build strategic workspaces',
      icon: '🏗️',
    },
    {
      id: 'pipeline-risk-scanner',
      title: 'Pipeline Risk Scanner',
      subtext: 'Identify slipped deals',
      icon: '🔍',
    },
    {
      id: 'meeting-prep-agent',
      title: 'Meeting Prep Agent',
      subtext: 'Generate exec summaries',
      icon: '📅',
    },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mb-6"
    >
      <h2 className="text-lg font-semibold mb-6" style={{ color: T.colors.text }}>
        Agent Tool Library
      </h2>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="p-4 rounded-lg border bg-white"
            style={{ 
              borderColor: "#E5E7EB",
            }}
          >
            <div className="text-2xl mb-2">{tool.icon}</div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: "#000000" }}>
              {tool.title}
            </h3>
            <p className="text-xs" style={{ color: "#666", lineHeight: "1.4" }}>
              {tool.subtext}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

// Screen 3 Body Content - Now supports disabled/locked state and post-approval collapse
function Screen3Body({
  stepperValue,
  onStepperChange,
  onApprove,
  onExecuteInMessages,
  isDisabled = false,
  isPlanApproved = false,
  onAdjustStrategy,
}: {
  stepperValue: number;
  onStepperChange: (value: number) => void;
  onApprove: () => void;
  onExecuteInMessages?: () => void;
  isDisabled?: boolean;
  isPlanApproved?: boolean;
  onAdjustStrategy?: () => void;
}) {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  // Multi-tier mitigation state: null = no mitigation, 'time-crunch' = Tier 2, 'pipeline-dilution' = Tier 3
  const [mitigationType, setMitigationType] = useState<'time-crunch' | 'pipeline-dilution' | null>(null);
  const [mitigatedAIWorkload, setMitigatedAIWorkload] = useState(0);
  const [mitigatedClientHours, setMitigatedClientHours] = useState(0);
  // Pipeline Generation Mitigation state (separate from Win Rate Dilution)
  const [activePipelineValue, setActivePipelineValue] = useState(1200000); // Base $1.2M, can increase to $1.36M
  const [pipelineShortageMitigated, setPipelineShortageMitigated] = useState(false);
  const [additionalProspectingAgents, setAdditionalProspectingAgents] = useState(0);
  
  const commission = calculateCommission(stepperValue);
  const baseAIWorkload = calculateAIWorkload(stepperValue);
  const aiWorkload = mitigationType ? baseAIWorkload + mitigatedAIWorkload : baseAIWorkload;
  const baseClientHours = calculateClientFacingHours(stepperValue);
  const clientHours = mitigationType === 'time-crunch' ? Math.max(6, baseClientHours - mitigatedClientHours) : baseClientHours;
  const internalMeetings = calculateInternalMeetings(stepperValue);
  const personalDeals = calculatePersonalEngagementDeals(stepperValue);
  const dilutionRisk = calculateDilutionRisk(stepperValue);
  const baseProjectedWinRate = calculateProjectedWinRate(stepperValue);
  const targetK = Math.round(stepperValue / 1000);
  const baselineWinRate = 52;
  // Pipeline dilution mitigation restores win rate: each additional agent adds ~2% back (capped at 52%)
  const mitigationBoost = mitigationType === 'pipeline-dilution' ? Math.min(2 * Math.ceil(mitigatedAIWorkload / 200), baselineWinRate - baseProjectedWinRate) : 0;
  const projectedWinRate = Math.min(baselineWinRate, baseProjectedWinRate + mitigationBoost);
  const winRateDrop = Math.max(0, baselineWinRate - projectedWinRate);
  
  // Dynamic Pipeline Gap Calculation: Uses real-time projected win rate and dynamic pipeline value
  const expectedRevenue = Math.round(activePipelineValue * (projectedWinRate / 100));
  const pipelineGap = Math.max(0, stepperValue - expectedRevenue);
  
  // Multi-tier mitigation logic: Determine current tier and reset when moving down
  useEffect(() => {
    if (stepperValue < 540000) {
      // Tier 1: Safe zone - reset all mitigations
      setMitigationType(null);
      setMitigatedAIWorkload(0);
      setMitigatedClientHours(0);
    } else if (stepperValue >= 600000) {
      // Tier 3: Pipeline Dilution - keep existing mitigations but allow Tier 3 fix
      // Don't reset if already mitigated, but allow upgrading from Tier 2 to Tier 3
      if (mitigationType === 'time-crunch') {
        // User moved from Tier 2 to Tier 3 - they need more help
        // Keep time-crunch mitigation but allow pipeline dilution fix too
      }
    }
    // Tier 2 (540K-590K) doesn't need reset logic - it's handled by the alert condition
    
    // Pipeline shortage mitigation: Reset only if gap is naturally resolved (without mitigation)
    // This happens when user moves slider down enough that gap becomes 0 without needing extra pipeline
    if (pipelineGap === 0 && pipelineShortageMitigated && activePipelineValue > 1200000) {
      // Check if gap would still be 0 with base pipeline (1200000)
      const baseExpectedRevenue = Math.round(1200000 * (projectedWinRate / 100));
      const baseGap = Math.max(0, stepperValue - baseExpectedRevenue);
      if (baseGap === 0) {
        // Gap is naturally resolved, reset pipeline shortage mitigation
        setPipelineShortageMitigated(false);
        setAdditionalProspectingAgents(0);
        setActivePipelineValue(1200000);
      }
    }
  }, [stepperValue, mitigationType, pipelineGap, projectedWinRate, pipelineShortageMitigated, activePipelineValue]);
  
  // Determine which mitigation alert to show based on tier
  const getMitigationTier = (): 'tier2' | 'tier3' | null => {
    // Tier 3: >= $640K with win rate drop (Pipeline Dilution)
    if (stepperValue >= 640000 && baseProjectedWinRate < 50 && mitigationType !== 'pipeline-dilution') {
      return 'tier3';
    }
    // Tier 2: $540K-$590K with elevated client hours (Time Crunch/Admin Overload)
    // At $540K, hours are ~7.2; at $590K, hours are ~8.4 - both indicate admin overload
    if (stepperValue >= 540000 && stepperValue < 640000 && baseClientHours >= 7 && mitigationType !== 'time-crunch') {
      return 'tier2';
    }
    return null;
  };
  
  // Calculate win rate change from baseline
  const winRateChange = projectedWinRate - baselineWinRate;
  const isOptimalRange = stepperValue >= 500000 && stepperValue <= 640000 && projectedWinRate > baselineWinRate;
  
  const currentMitigationTier = getMitigationTier();
  
  const handleAutomateFollowups = () => {
    // Tier 2 fix: Automate follow-ups reduces client-facing hours
    setMitigatedClientHours(2); // Reduce by 2 hours
    setMitigationType('time-crunch');
    // Also increase AI workload for follow-up sequences
    setMitigatedAIWorkload(300); // Add 300 tasks for automated follow-ups
  };
  
  const handleDeployAgents = () => {
    // Tier 3 fix: Deploy 2 additional prospecting agents (400 tasks boost)
    setMitigatedAIWorkload(400);
    setMitigationType('pipeline-dilution');
    // If they already had time-crunch mitigation, keep it but add pipeline dilution
    // The state will show both mitigations are active
  };
  
  // Pipeline Generation Mitigation handler
  const handleDeployProspectingAgents = () => {
    // Deploy 3x Prospecting Agents to source new pipeline
    setAdditionalProspectingAgents(3);
    // Increase active pipeline by $160K (from $1.2M to $1.36M)
    setActivePipelineValue(1360000);
    setPipelineShortageMitigated(true);
    // This will automatically recalculate pipelineGap to $0K
  };

  const OPTIMAL_QUOTA = 615000;
  const handleApplyOptimalPlan = () => {
    // Set slider to optimal quota
    onStepperChange(OPTIMAL_QUOTA);
    // Auto-apply optimal mitigations: Deploy 3 sequence agents
    setMitigatedAIWorkload(450); // 3 agents × 150 tasks each
    setMitigationType('time-crunch'); // This enables the optimal win rate boost
    
    // Switch to Messages tab and trigger approval flow
    // Use setTimeout to ensure slider value is updated before approval
    setTimeout(() => {
      if (onApprove) {
        onApprove();
      }
    }, 150);
  };
  
  // Post-approval view: Compact widget + Tool Hub
  if (isPlanApproved) {
    return (
      <div style={{ backgroundColor: "#ffffff" }}>
        {/* Active Strategy Widget - Compact Summary */}
        <ActiveStrategyWidget
          stepperValue={stepperValue}
          projectedWinRate={projectedWinRate}
          onAdjustStrategy={onAdjustStrategy || (() => {})}
        />
        
        {/* Agent Tool Hub */}
        <AgentToolHub />
      </div>
    );
  }
  
  // Pre-approval view: Full Planner UI
  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      {/* Proactive Recommendation Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 p-4 rounded-lg border" 
        style={{ backgroundColor: "#F0F9FF", borderColor: "#0EA5E9" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="text-sm font-semibold mb-1 flex items-start gap-2" style={{ color: "#0C4A6E" }}>
              <Image src="/slackbot-logo.svg" alt="Slackbot" width={16} height={16} className="shrink-0 mt-0.5" />
              <span>Slackbot analyzed your $1.2M pipeline. Recommended optimal quota: $615,000.</span>
            </div>
            <div className="text-xs" style={{ color: "#075985" }}>
              Deploying 3 sequence agents will boost your win rate to 56.4%.
            </div>
          </div>
          <SlackButton onClick={handleApplyOptimalPlan}>
            Apply Optimal Plan
          </SlackButton>
        </div>
      </motion.div>
      
      {/* Formal Header */}
      <div className="mb-4 flex items-center gap-2">
        <Image src="/slackbot-logo.svg" alt="Slackbot" width={24} height={24} />
        <h1 className="text-lg font-semibold" style={{ color: T.colors.text }}>
          Q1 Planner
        </h1>
      </div>
      
      {/* Full Planner UI - Collapsible when approved */}
      <motion.div
        initial={false}
        animate={{ height: isPlanApproved ? 0 : "auto", opacity: isPlanApproved ? 0 : 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        {/* Sleek Header - Icon Stack */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-xs whitespace-nowrap" style={{ color: "#666" }}>
            Active Pipeline: ${(activePipelineValue / 1000000).toFixed(activePipelineValue >= 1000000 ? 1 : 2)}M · Win Rate: 52% · Quota: $500K · Close rate: 68%
          </div>
          {/* Right-aligned overlapping icon stack */}
          <ToolIconStack 
            tools={["Salesforce", "Gong", "Highspot", "Gmail", "Google Calendar", "Clari"]} 
            maxVisible={4}
            size="md"
          />
        </div>

        {/* Plan Selector */}
      <div className="mb-4">
        <div className={`flex gap-2 mb-4 ${isDisabled ? "opacity-70 pointer-events-none" : ""}`}>
          {[
            { label: "Conservative", value: 400000 },
            { label: "Quota", value: 500000 },
            { label: "Stretch", value: 600000 },
          ].map(({ label, value }) => {
            const isActive = Math.abs(stepperValue - value) < 50000;
            return (
              <button
                key={value}
                type="button"
                onClick={() => !isDisabled && onStepperChange(value)}
                disabled={isDisabled}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  isActive ? "" : "hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor: isActive ? "#F3F4F6" : "#ffffff",
                  color: "#1d1c1d",
                  border: "1px solid #E0E0E0",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
        {/* Inline Confidence Slider - Single Row */}
        <div className={`flex items-center gap-4 ${isDisabled ? "opacity-70 pointer-events-none" : ""}`}>
          <label className="text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "#666", letterSpacing: "0.5px" }}>
            CONFIDENCE SLIDER
          </label>
          <input
            type="number"
            min={400000}
            max={700000}
            step={5000}
            value={stepperValue}
            onChange={(e) => {
              const next = Number(e.target.value || 500000);
              onStepperChange(Math.max(400000, Math.min(700000, next)));
            }}
            className="w-24 px-2 py-1.5 rounded border text-sm whitespace-nowrap"
            style={{ borderColor: "#E0E0E0", color: "#1d1c1d" }}
          />
          <input
            type="range"
            min={400000}
            max={700000}
            step={5000}
            value={stepperValue}
            onChange={(e) => onStepperChange(Number(e.target.value))}
            className="flex-1 accent-gray-700"
          />
          <motion.span
            key={stepperValue}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold whitespace-nowrap"
            style={{ color: "#000000" }}
          >
            ${targetK.toLocaleString()},000
          </motion.span>
        </div>
      </div>

      {/* Plan Impact Card */}
      <div className="mb-6 p-5 rounded-lg border bg-white" style={{ borderColor: "#E0E0E0", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold uppercase tracking-wide" style={{ color: "#000000", fontSize: "12px", letterSpacing: "0.5px" }}>
            PLAN IMPACT AT ${targetK.toLocaleString()}K
          </div>
          {/* Advanced Mode Toggle */}
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: "#666" }}>Advanced Mode</label>
            <button
              type="button"
              onClick={() => setIsAdvancedMode(!isAdvancedMode)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                isAdvancedMode ? 'bg-[#6B21A8]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAdvancedMode ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {/* Basic View - Always Visible */}
          <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: "#E0E0E0" }}>
            <span className="text-sm" style={{ color: "#666" }}>Estimated Commission</span>
            <motion.span
              key={commission}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold"
              style={{ color: "#000000" }}
            >
              ${commission.toLocaleString()}
            </motion.span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: "#666" }}>Pipeline gap to close</span>
            <span 
              className="text-sm font-medium"
              style={{ color: pipelineGap > 0 ? "#dc2626" : "#000000" }}
            >
              {pipelineGap === 0 ? "$0K" : `$${pipelineGap.toLocaleString()}`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: "#666" }}>AI workload</span>
            <motion.span
              key={aiWorkload}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-sm font-medium"
              style={{ color: "#000000" }}
            >
              {aiWorkload >= 1000 ? "High" : aiWorkload >= 600 ? "Medium" : "Low"} ({aiWorkload.toLocaleString()} tasks)
            </motion.span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: "#666" }}>Projected Win Rate</span>
            <span 
              className="text-sm font-medium"
              style={{ 
                color: projectedWinRate < 50 ? "#dc2626" : isOptimalRange ? "#10b981" : "#000000" 
              }}
            >
              {projectedWinRate.toLocaleString(undefined, { maximumFractionDigits: 1 })}%
              {winRateChange > 0 && (
                <span style={{ color: "#10b981" }}> (+{winRateChange.toFixed(1)}% via Agentic Follow-ups)</span>
              )}
              {winRateChange < 0 && projectedWinRate < 50 && (
                <span style={{ color: "#dc2626" }}> (drop from {baselineWinRate}%)</span>
              )}
              {mitigationType === 'pipeline-dilution' && winRateChange >= 0 && (
                <span style={{ color: "#10b981" }}> (mitigated)</span>
              )}
            </span>
          </div>
          
          {/* Pipeline Shortage Mitigation Alert (separate from Win Rate Dilution) */}
          {pipelineGap > 0 && !pipelineShortageMitigated && (
            <motion.div
              key="pipeline-shortage-alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 p-3 rounded-lg border"
              style={{ 
                backgroundColor: "#FEF3C7",
                borderColor: "#F59E0B",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-1" style={{ color: "#92400E" }}>
                    ⚠️ Pipeline Shortfall of ${(pipelineGap / 1000).toFixed(0)}K detected.
                  </div>
                  <div className="text-xs mb-2" style={{ color: "#78350F" }}>
                    Recommendation: Deploy 3x Prospecting Agents to source top-of-funnel accounts and bridge the gap.
                  </div>
                  <div className="text-xs font-medium" style={{ color: "#78350F" }}>
                    System Confidence: 82% based on historical Q1 outbound conversion.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDeployProspectingAgents}
                  className="px-3 py-1.5 rounded text-xs font-semibold transition-colors border border-transparent hover:border-[#92400E] hover:bg-[#FDE68A] bg-white whitespace-nowrap"
                  style={{ color: "#92400E" }}
                >
                  Deploy 3x Prospecting Agents
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Pipeline Shortage Success State */}
          {pipelineShortageMitigated && pipelineGap === 0 && (
            <motion.div
              key="pipeline-shortage-success"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.2 }}
              className="mt-3 p-3 rounded-lg border"
              style={{ 
                backgroundColor: "#D1FAE5",
                borderColor: "#10b981",
              }}
            >
              <div className="text-sm font-semibold" style={{ color: "#065F46" }}>
                ✅ 3x Prospecting Agents deployed. Pipeline gap resolved.
              </div>
            </motion.div>
          )}
          
          {/* Multi-Tier Mitigation Alerts */}
          {currentMitigationTier === 'tier2' && (
            <motion.div
              key="tier2-alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 p-3 rounded-lg border"
              style={{ 
                backgroundColor: "#FEF3C7",
                borderColor: "#F59E0B",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-1" style={{ color: "#92400E" }}>
                    ⚠️ Admin Overload Risk
                  </div>
                  <div className="text-xs mb-2" style={{ color: "#78350F" }}>
                    Recommendation: Deploy Sequence Agents to automate routine follow-ups.
                  </div>
                  <div className="text-xs font-medium" style={{ color: "#78350F" }}>
                    System Confidence: 88%
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAutomateFollowups}
                  className="px-3 py-1.5 rounded text-xs font-semibold transition-colors border border-transparent hover:border-[#92400E] hover:bg-[#FDE68A] bg-white whitespace-nowrap"
                  style={{ color: "#92400E" }}
                >
                  Automate Follow-ups
                </button>
              </div>
            </motion.div>
          )}
          
          {currentMitigationTier === 'tier3' && (
            <motion.div
              key="tier3-alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 p-3 rounded-lg border"
              style={{ 
                backgroundColor: "#FEF3C7",
                borderColor: "#F59E0B",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-1" style={{ color: "#92400E" }}>
                    ⚠️ Dilution Risk
                  </div>
                  <div className="text-xs mb-2" style={{ color: "#78350F" }}>
                    Recommendation: Deploy 2 Prospecting Agents.
                  </div>
                  <div className="text-xs font-medium" style={{ color: "#78350F" }}>
                    System Confidence: 88%
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDeployAgents}
                  className="px-3 py-1.5 rounded text-xs font-semibold transition-colors border border-transparent hover:border-[#92400E] hover:bg-[#FDE68A] bg-white whitespace-nowrap"
                  style={{ color: "#92400E" }}
                >
                  Deploy Agents
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Advanced View - Conditionally Visible */}
          <motion.div
            initial={false}
            animate={{ height: isAdvancedMode ? "auto" : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="pt-3 border-t mt-3" style={{ borderColor: "#E0E0E0" }}>
              <div className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: "#666", letterSpacing: "0.5px" }}>YOUR WEEK</div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "#666" }}>Client-facing hours/week</span>
                  <span style={{ color: "#000000", fontWeight: 500 }}>{clientHours} hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#666" }}>Internal meetings/week</span>
                  <div className="flex items-center gap-2">
                    {stepperValue >= 600000 && (
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#D1FAE5", color: "#065F46", borderLeft: "3px solid #10b981" }}>
                        3 → 2 ↓
                      </span>
                    )}
                    <span style={{ color: "#000000", fontWeight: 500 }}>{internalMeetings}</span>
                    {stepperValue >= 600000 && (
                      <span className="text-xs" style={{ color: "#666" }}>
                        I handle pipeline reviews. You get this hour back.
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#666" }}>Deals needing personal engagement</span>
                  <span style={{ color: "#000000", fontWeight: 500 }}>{personalDeals} of 14</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "#666" }}>Risk: pipeline dilution</span>
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: dilutionRisk.color === "#10b981" ? "#D1FAE5" : dilutionRisk.color === "#f59e0b" ? "#FEF3C7" : "#FEE2E2",
                      color: dilutionRisk.color,
                    }}
                  >
                    🟡 {dilutionRisk.level}
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t mt-3" style={{ borderColor: "#E0E0E0" }}>
              <div className="flex flex-row justify-between items-center mb-3">
                <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#666", letterSpacing: "0.5px" }}>AGENTFORCE HANDLES</div>
                {/* Dynamic Confidence Badge */}
                {(() => {
                  const isHighRisk = stepperValue > 680000;
                  const confidenceScore = isHighRisk ? 89 : 98;
                  const badgeBgColor = isHighRisk ? "#FEF3C7" : "#D1FAE5";
                  const badgeTextColor = isHighRisk ? "#92400E" : "#065F46";
                  
                  return (
                    <div 
                      className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                      style={{ 
                        backgroundColor: badgeBgColor,
                        color: badgeTextColor,
                      }}
                    >
                      ✨ {confidenceScore}% Execution Confidence
                    </div>
                  );
                })()}
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "#666" }}>Follow-up sequences</span>
                  <span style={{ color: "#000000", fontWeight: 500 }}>{aiWorkload}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#666" }}>Prospecting agents</span>
                  <span style={{ color: "#000000", fontWeight: 500 }}>{8 + additionalProspectingAgents} accounts</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#666" }}>Contract chase</span>
                  <span style={{ color: "#000000", fontWeight: 500 }}>{stepperValue >= 600000 ? "18" : "18"} automations</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Side-by-Side CTAs - Left-aligned */}
      {!isDisabled && (
        <div className="flex items-center justify-start gap-3 mt-4">
          <SlackButton onClick={onApprove}>
            Approve ${targetK.toLocaleString()}K Plan →
          </SlackButton>
          {onExecuteInMessages && (
            <SlackButton onClick={onExecuteInMessages}>
              Execute Plan in Messages
            </SlackButton>
          )}
        </div>
      )}
      </motion.div>
    </div>
  );
}

// Screen 4 Body Content - Approval Confirmation Checklist (Styled as Slackbot message)
function Screen4Body({ 
  stepperValue, 
  onComplete 
}: { 
  stepperValue: number;
  onComplete?: () => void;
}) {
  const targetK = Math.round(stepperValue / 1000);
  const checklistContainerRef = useRef<HTMLDivElement>(null);
  
  // Memoize checklistItems to prevent recreation on every render
  const checklistItems = useMemo(
    () => getChecklistItems(targetK, stepperValue),
    [targetK, stepperValue]
  );

  return (
    <div className="mb-4">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <Image src="/slackbot-logo.svg" alt="Slackbot" width={32} height={32} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#616061] mb-1">Slackbot</div>
          <div 
            ref={checklistContainerRef}
            className="mb-6"
          >
            {/* CRITICAL: Hardcoded stable key prevents React from unmounting/remounting */}
            <AnimatedChecklist 
              key="q1-planner-checklist" 
              items={checklistItems} 
              onComplete={onComplete}
              containerRef={checklistContainerRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Simplified Next Steps - Bridge to Part 2 (Execution phase)
// Appears after confirmation checklist completes
// Memoized to prevent unnecessary re-renders that cause blinking
const PostApprovalMessage = memo(function PostApprovalMessage({ 
  stepperValue,
  onEnterDealRoom,
  onReviewHeatmap
}: { 
  stepperValue: number;
  onEnterDealRoom?: () => void;
  onReviewHeatmap?: () => void; // This will set showHeatmap state in parent
}) {
  const targetK = Math.round(stepperValue / 1000);
  const commission = Math.round(stepperValue * 0.14);
  
  return (
    <div className="mb-4">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <Image src="/slackbot-logo.svg" alt="Slackbot" width={32} height={32} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#616061] mb-1">Slackbot</div>
          {/* Dual CTA - outlined buttons */}
          <div className="mb-6">
            <div>
              <p className="text-[15px] font-medium mb-2" style={{ color: '#1d1c1d', fontFamily: 'DM Sans, sans-serif' }}>
                Your environment is ready. 1 High-Risk Deal needs a human signal.
              </p>
              <p className="text-[13px] mb-4" style={{ color: '#616061', fontFamily: 'DM Sans, sans-serif' }}>
                ${targetK.toLocaleString()}K quota · ${commission.toLocaleString()} commission at stake
              </p>
              <div className="flex flex-wrap gap-3">
                <SlackButton onClick={onEnterDealRoom}>
                  Enter Acme Deal Room
                </SlackButton>
                <SlackButton onClick={onReviewHeatmap}>
                  Review Heatmap Analysis
                </SlackButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Sentiment Heatmap Card - Shows "Champion Drift" insight
const SentimentHeatmapCard = memo(function SentimentHeatmapCard({
  onViewActivities
}: {
  onViewActivities?: () => void;
}) {
  return (
    <div data-agent-role="playbook-card" className="mb-4">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <Image src="/slackbot-logo.svg" alt="Slackbot" width={32} height={32} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#616061] mb-1">Slackbot</div>
          <div className="mb-6">
            <div className="mb-3">
              <div className="text-xs font-semibold uppercase mb-2 flex items-center gap-1.5" style={{ fontSize: '11px', color: '#0176D3', fontFamily: 'DM Sans, sans-serif' }}>
                <IconFilter className="w-3 h-3" />
                CHAMPION DRIFT
              </div>
              <p className="text-[15px] font-medium mb-1" style={{ color: '#1d1c1d', fontFamily: 'DM Sans, sans-serif' }}>
                Acme Corp sentiment shifted from +0.8 to +0.3 in last 2 weeks
              </p>
              <p className="text-[13px] mb-4" style={{ color: '#616061', fontFamily: 'DM Sans, sans-serif' }}>
                Key signal: Budget conversations stalled. Decision criteria unclear.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onViewActivities}
                className="px-4 py-2 rounded text-sm font-medium border border-gray-300 transition-colors hover:bg-gray-50 bg-white"
                style={{ 
                  color: '#1d1c1d',
                  fontFamily: 'DM Sans, sans-serif' 
                }}
              >
                View Account Activities
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded text-sm font-medium border border-gray-300 transition-colors hover:bg-gray-50 bg-white"
                style={{ 
                  color: '#1d1c1d',
                  fontFamily: 'DM Sans, sans-serif' 
                }}
              >
                Review Sentiment Timeline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Stakeholder Insights Card - Tableau-style table showing evidence from apps
const StakeholderInsightsCard = memo(function StakeholderInsightsCard({
  onViewActivities,
  onEnterDealRoom,
  containerRef
}: {
  onViewActivities?: () => void;
  onEnterDealRoom?: () => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}) {
  const insightsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to table when it appears
  useEffect(() => {
    if (insightsRef.current && containerRef?.current) {
      setTimeout(() => {
        const container = containerRef.current;
        const element = insightsRef.current;
        if (container && element) {
          const containerRect = container.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const currentScrollTop = container.scrollTop;
          const targetOffsetTop = elementRect.top - containerRect.top + currentScrollTop;
          const scrollToPosition = Math.max(0, targetOffsetTop - 20);
          
          container.scrollTo({
            top: scrollToPosition,
            behavior: 'smooth'
          });
        } else {
          // Fallback to scrollIntoView if container ref not available
          insightsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 150);
    }
  }, [containerRef]);

  const stakeholders = [
    { name: "Sarah Chen (VP)", sentiment: "Neutral", signal: "Gmail: 3 unreplied threads. Gong: Budget questions paused." },
    { name: "Michael Park (Director)", sentiment: "+0.6 →", signal: "Highspot: Viewed pricing guide 2x. Gong: Technical concerns raised." },
    { name: "Lisa Wang (Champion)", sentiment: "+0.2 ↓↓", signal: "Gong: Reduced meeting frequency. Gmail: Forwarded to finance team." },
  ];

  return (
    <div className="mb-4" ref={insightsRef}>
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <Image src="/slackbot-logo.svg" alt="Slackbot" width={32} height={32} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#616061] mb-1">Slackbot</div>
          <div className="mb-6">
            <div className="mb-4">
              <div className="text-xs font-semibold uppercase mb-3" style={{ fontSize: '11px', color: '#0176D3', fontFamily: 'DM Sans, sans-serif' }}>
                OBJECTIVE INSIGHTS
              </div>
              
              {/* Tableau-style table - keep internal grid lines */}
              <div className="overflow-x-auto" style={{ overflowY: 'visible' }}>
                <table className="w-full border-collapse" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-xs font-semibold uppercase" style={{ color: '#616061' }}>Stakeholder</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold uppercase" style={{ color: '#616061' }}>Sentiment</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold uppercase" style={{ color: '#616061' }}>Ecosystem Signal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stakeholders.map((stakeholder, index) => (
                      <tr key={index} className="border-b border-gray-100" style={{ overflow: 'visible' }}>
                        <td className="py-3 px-3 text-sm font-medium" style={{ color: '#1d1c1d' }}>{stakeholder.name}</td>
                        <td className="py-3 px-3 text-sm" style={{ color: '#1d1c1d' }}>{stakeholder.sentiment}</td>
                        <td className="py-3 px-3 text-sm" style={{ color: '#616061', overflow: 'visible', verticalAlign: 'middle' }}>
                          <div className="flex items-center gap-2 flex-wrap" style={{ lineHeight: '1.5' }}>
                            {parseTextWithToolIcons(stakeholder.signal, "sm")}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Data source attribution */}
              <p className="text-xs mt-3" style={{ color: '#616061', fontFamily: 'DM Sans, sans-serif' }}>
                Analysis based on Gong transcripts, Gmail metadata, and Highspot engagement.
              </p>
            </div>

            {/* Navigation CTAs */}
            <div className="flex gap-3 pt-3 border-t border-gray-200">
              <SlackButton onClick={onViewActivities} className="flex-1">
                View Account Activities
              </SlackButton>
              <SlackButton onClick={onEnterDealRoom} className="flex-1">
                Enter Acme Deal Room
              </SlackButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Account Activity Card - Shows "Sellers' Playbook" with specific tasks
const AccountActivityCard = memo(function AccountActivityCard({
  onEnterDealRoom,
  onDraftScalabilityEmail
}: {
  onEnterDealRoom?: () => void;
  onDraftScalabilityEmail?: () => void;
}) {
  const activities = [
    { person: "Rita (AE)", task: "Respond to Sarah's scalability concern (Draft ready in Gmail)", status: "pending" },
    { person: "Priya (SE)", task: "Send the integration whitepaper Daniel requested in Highspot", status: "pending" },
    { person: "Jordan (VP)", task: "Reach out to Mike for an executive alignment check-in", status: "pending" },
  ];

  return (
    <div data-agent-role="playbook-card" className="mb-4">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <Image src="/slackbot-logo.svg" alt="Slackbot" width={32} height={32} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#616061] mb-1">Slackbot</div>
          <div className="mb-6">
            <div className="mb-3">
              <div className="text-xs font-semibold uppercase mb-3" style={{ fontSize: '11px', color: '#0176D3', fontFamily: 'DM Sans, sans-serif' }}>
                SELLERS' PLAYBOOK
              </div>
              <div className="space-y-2.5 mb-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-2 text-[14px]" style={{ color: '#1d1c1d', fontFamily: 'DM Sans, sans-serif' }}>
                    <span className="font-semibold text-[#616061] shrink-0 w-28">{activity.person}:</span>
                    <span className="flex-1">{activity.task}</span>
                  </div>
                ))}
              </div>
              
              {/* Helpful prompt */}
              <div className="pt-3 border-t border-gray-200">
                <p className="text-[13px] mb-2" style={{ color: '#1d1c1d', fontFamily: 'DM Sans, sans-serif' }}>
                  Would you like me to draft the specific "Scalability" email draft for Sarah so Rita can "Human Signal" it immediately?
                </p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <SlackButton onClick={onEnterDealRoom}>
                    Enter Acme Deal Room
                  </SlackButton>
                  <SlackButton onClick={onDraftScalabilityEmail}>
                    Draft Scalability Email
                  </SlackButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export function Arc1AgentforcePanel({
  currentScreen,
  panelFeed,
  stepperValue,
  onStepperChange,
  onApprove,
  onLoadingComplete,
  onChecklistComplete,
  onEnterDealRoom,
  onReviewHeatmap,
  onViewActivities,
  onMessageSend,
  onScreenChange,
  onQuickPrompt,
  onClose,
}: Arc1AgentforcePanelProps) {
  const [activeTab, setActiveTab] = useState<string>("seller-edge"); // Default to Seller Edge
  const [chatInput, setChatInput] = useState("");
  const [checklistDone, setChecklistDone] = useState(false);
  // Seller Edge onboarding state - isolated from Messages tab feed
  const [isSellerEdgeLoadingComplete, setIsSellerEdgeLoadingComplete] = useState(false);
  // Strict conditional rendering for Heatmap - only show on explicit button click
  const [showHeatmap, setShowHeatmap] = useState(false);
  // Plan approval state - controls Seller Edge workspace view
  const [isPlanApproved, setIsPlanApproved] = useState(false);
  const executionFeedTypes = useMemo(
    () => panelFeed.filter((item) => item.type !== 'loading' && item.type !== 'planner').map((item) => item.type),
    [panelFeed]
  );
  const lastConfirmationIndexInExecution = useMemo(
    () => executionFeedTypes.lastIndexOf('confirmation'),
    [executionFeedTypes]
  );
  const currentCycleTypes = useMemo(
    () => (lastConfirmationIndexInExecution >= 0 ? executionFeedTypes.slice(lastConfirmationIndexInExecution) : executionFeedTypes),
    [executionFeedTypes, lastConfirmationIndexInExecution]
  );
  const hasCurrentCycleActivities = useMemo(
    () => currentCycleTypes.includes('activities'),
    [currentCycleTypes]
  );
  const shouldRenderActivitiesAfterInsights = showHeatmap && hasCurrentCycleActivities;
  
  // Reset showHeatmap and showActivities when panel closes or feed is cleared
  useEffect(() => {
    const hasNextSteps = panelFeed.some(item => item.type === 'next-steps');
    if (!hasNextSteps) {
      setShowHeatmap(false); // Reset when next-steps is removed
    }
  }, [panelFeed]);

  // Handler for "View Account Activities" button - sets showActivities state
  const handleViewActivities = useCallback(() => {
    if (onViewActivities) {
      onViewActivities();
    }
  }, [onViewActivities]);

  // Auto-scroll to bottom when feed-based activities card is added
  useEffect(() => {
    if (activeTab === 'messages' && shouldRenderActivitiesAfterInsights && scrollContainerRef.current) {
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    }
  }, [activeTab, shouldRenderActivitiesAfterInsights, panelFeed.length]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const nextStepsRef = useRef<HTMLDivElement>(null);
  const confirmationChecklistRef = useRef<HTMLDivElement>(null);
  const activitiesBlockRef = useRef<HTMLDivElement | null>(null);

  

  // Preserve scroll position when feed updates to prevent scroll-to-top
  const scrollPositionRef = useRef<number>(0);
  const isRestoringScrollRef = useRef<boolean>(false);
  const prevFeedLengthRef = useRef<number>(panelFeed.length);
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Save current scroll position before feed updates
      const currentScroll = container.scrollTop;
      scrollPositionRef.current = currentScroll;
    }
  }, [panelFeed.length]); // Save position when feed length changes (before new item renders)

  // Restore scroll position after feed update, BUT skip when confirmation or next-steps is added (we'll scroll to them instead)
  useEffect(() => {
    const container = scrollContainerRef.current;
    const hasNextSteps = panelFeed.some(item => item.type === 'next-steps');
    const hasConfirmation = panelFeed.some(item => item.type === 'confirmation');
    const prevLength = prevFeedLengthRef.current; // Get the previous length value
    
    // If next-steps or confirmation was just added, DON'T restore - we'll scroll to them instead
    const nextStepsJustAdded = hasNextSteps && panelFeed.length > prevLength;
    const confirmationJustAdded = hasConfirmation && panelFeed.length > prevLength;
    prevFeedLengthRef.current = panelFeed.length; // Update the ref with new length
    
    if (container && !hasScrolledToNextStepsRef.current && !nextStepsJustAdded && !confirmationJustAdded && !isScrollingToChecklistRef.current) {
      // Only restore if next-steps or confirmation wasn't just added AND we're not currently scrolling to checklist
      isRestoringScrollRef.current = true;
      // Use double RAF to ensure DOM has fully updated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (container && scrollPositionRef.current > 0 && !hasScrolledToNextStepsRef.current) {
            container.scrollTop = scrollPositionRef.current;
            isRestoringScrollRef.current = false;
          }
        });
      });
    }
  }, [panelFeed]);

  // Listen for scroll trigger from parent after next-steps is added
  useEffect(() => {
    const handleScrollToNextSteps = () => {
      if (!hasScrolledToNextStepsRef.current && scrollContainerRef.current) {
        // Mark as scrolled immediately to prevent race condition with reset effect
        hasScrolledToNextStepsRef.current = true;
        
        // Scroll directly to bottom (where next-steps is) - simpler and more reliable
        // Use longer delay to ensure DOM has fully rendered next-steps
        setTimeout(() => {
          if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            
            // Simple approach: scroll to bottom where next-steps is located
            const scrollBefore = container.scrollTop;
            const targetScroll = container.scrollHeight;
            
            container.scrollTo({
              top: targetScroll,
              behavior: 'smooth'
            });
            
            // Verify scroll actually happened after a delay
            setTimeout(() => {
              if (scrollContainerRef.current) {
                const scrollAfter = scrollContainerRef.current.scrollTop;
                void scrollAfter;
                void scrollBefore;
                void targetScroll;
              }
            }, 1000);
          }
        }, 800);
      }
    };
    
    window.addEventListener('scroll-to-next-steps', handleScrollToNextSteps);
    return () => window.removeEventListener('scroll-to-next-steps', handleScrollToNextSteps);
  }, []);

  // Reset checklistDone when confirmation is removed from feed (e.g., on restart)
  useEffect(() => {
    const hasConfirmation = panelFeed.some(item => item.type === 'confirmation');
    if (!hasConfirmation) {
      setChecklistDone(false);
    }
  }, [panelFeed]);

  // Track if completion callback has been called to prevent multiple calls
  const completionCalledRef = useRef(false);

  // Stable callback for checklist completion - triggers parent to add next-steps and updates local state
  const handleChecklistComplete = useCallback(() => {
    // Only call once to prevent infinite loop
    if (completionCalledRef.current) {
      return;
    }
    completionCalledRef.current = true;

    setChecklistDone(true);
    // Notify parent to add next-steps item to feed
    if (onChecklistComplete) {
      onChecklistComplete();
    }
    
    // Scroll will be triggered by parent via custom event after feed updates
  }, [onChecklistComplete]);

  // Reset completion flag when confirmation is removed from feed
  useEffect(() => {
    const hasConfirmation = panelFeed.some(item => item.type === 'confirmation');
    if (!hasConfirmation) {
      setChecklistDone(false);
      completionCalledRef.current = false;
    }
  }, [panelFeed]);

  const handleChatSubmit = (message: string) => {
    if (message.trim()) {
      onMessageSend?.(message);
      setChatInput("");
    }
  };

  // Track if we've already scrolled to next-steps to prevent blinking
  const hasScrolledToNextStepsRef = useRef(false);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasScrolledToChecklistRef = useRef(false);
  const isScrollingToChecklistRef = useRef(false);
  
  // Scroll to show confirmation checklist when it's added to feed (on approve)
  useEffect(() => {
    const currentConfirmationCount = panelFeed.filter(item => item.type === 'confirmation').length;
    const confirmationJustAdded = currentConfirmationCount > prevConfirmationCount;

    // Don't check ref here - it might not be attached yet. Check inside delayed callback instead.
    if (confirmationJustAdded && !hasScrolledToChecklistRef.current && scrollContainerRef.current) {
      hasScrolledToChecklistRef.current = true;
      isScrollingToChecklistRef.current = true; // Mark that we're scrolling to prevent restore interference
      
      // Wait for DOM to render and ref to attach, then scroll to show the checklist.
      setTimeout(() => {
        if (scrollContainerRef.current && confirmationChecklistRef.current) {
          const container = scrollContainerRef.current;
          const checklistElement = confirmationChecklistRef.current;
          
          // Get position of checklist relative to scroll container
          const containerRect = container.getBoundingClientRect();
          const checklistRect = checklistElement.getBoundingClientRect();
          
          // Calculate scroll position to show checklist (with small offset from top)
          const currentScrollTop = container.scrollTop;
          const targetOffsetTop = checklistRect.top - containerRect.top + currentScrollTop;
          const scrollToPosition = Math.max(0, targetOffsetTop - 20);
          
          container.scrollTo({
            top: scrollToPosition,
            behavior: 'smooth'
          });

          setTimeout(() => {
            isScrollingToChecklistRef.current = false;
          }, 800);
        } else {
          isScrollingToChecklistRef.current = false;
        }
      }, 500);
    }
    
    // Always update module-level counter at the end to track current state for the next effect run
    // Update unconditionally to ensure it persists across effect runs and remounts
    prevConfirmationCount = currentConfirmationCount;
    
    // Reset flag when confirmation is removed (e.g., on restart)
    if (currentConfirmationCount === 0) {
      hasScrolledToChecklistRef.current = false;
    }
  }, [panelFeed]);

  // Finish-Line Snap: Scroll DOWN to next-steps section ONLY AFTER the 2nd checklist (AnimatedChecklist/confirmation) completes
  // NOTE: This is tied to the 2nd checklist (confirmation checklist with "$500K committed..."), NOT the 1st checklist (LoadingRevealsComponent)
  // FIX: Only reset scroll flag when feed is cleared (next-steps removed), NOT when checklistDone is false (React batching issue)
  useEffect(() => {
    const hasNextSteps = panelFeed.some(item => item.type === 'next-steps');

    // Reset scroll flag ONLY when next-steps is removed from feed (e.g., on restart)
    // DO NOT reset when checklistDone is false - this causes race condition with React state batching
    if (!hasNextSteps) {
      hasScrolledToNextStepsRef.current = false;
    }
  }, [panelFeed]);

  // Separate effect that triggers scroll ONLY when checklistDone becomes true AND next-steps exists
  useEffect(() => {
    const hasNextSteps = panelFeed.some(item => item.type === 'next-steps');
    
    // Clear any pending scroll timer
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }

    // Only scroll if the 2nd checklist (confirmation) is done AND next-steps is in feed AND we haven't scrolled yet
    if (checklistDone && hasNextSteps && !hasScrolledToNextStepsRef.current) {
      // Mark as scrolled immediately to prevent re-triggering
      hasScrolledToNextStepsRef.current = true;
      
      // Wait for DOM to fully render next-steps, then scroll DOWN to the next-steps element
      scrollTimerRef.current = setTimeout(() => {
        if (scrollContainerRef.current && nextStepsRef.current) {
          const container = scrollContainerRef.current;
          const targetElement = nextStepsRef.current;
          
          // Get the position of next-steps relative to the scroll container
          const containerRect = container.getBoundingClientRect();
          const targetRect = targetElement.getBoundingClientRect();
          
          // Calculate the scroll position needed to show next-steps
          // targetRect.top is relative to viewport, containerRect.top is container's position in viewport
          // We need the position relative to the scroll container's content
          const currentScrollTop = container.scrollTop;
          const targetOffsetTop = targetRect.top - containerRect.top + currentScrollTop;
          const scrollToPosition = Math.max(0, targetOffsetTop - 20);
          
          // Scroll DOWN to the next-steps section (with small offset from top for visibility)
          container.scrollTo({
            top: scrollToPosition, // 20px offset from top, ensure non-negative
            behavior: 'smooth'
          });
        }
        scrollTimerRef.current = null;
      }, 800); // Increased delay to ensure checklist animation is fully complete and DOM is ready
    }

    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
    };
  }, [checklistDone, panelFeed]); // Watch checklistDone FIRST to ensure it triggers after state update

  // Single return statement with permanent header, conditional body, and conditional input box
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: T.colors.background }}>
      {/* Header - PERMANENT, never changes */}
      <PanelHeader activeTab={activeTab} onTabChange={setActiveTab} onClose={onClose} />

      {/* Body - Conditional rendering based on activeTab */}
      <div 
        ref={(el) => {
          scrollContainerRef.current = el;
        }}
        className="flex-1 overflow-y-auto min-h-0"
        style={{ backgroundColor: "#ffffff", borderTop: "none" }}
      >
        {activeTab === 'seller-edge' ? (
          // Seller Edge Tab: Full onboarding sequence (loading → planner)
          <div className="p-6">
            {!isSellerEdgeLoadingComplete ? (
              // Step 1: Data loading animation
              <Screen2Body 
                onLoadingComplete={() => {
                  setIsSellerEdgeLoadingComplete(true);
                  // Also notify parent for any external state updates
                  if (onLoadingComplete) {
                    onLoadingComplete();
                  }
                }} 
              />
            ) : (
              // Step 2: Planner UI revealed after loading completes
              <Screen3Body 
                stepperValue={stepperValue} 
                onStepperChange={onStepperChange} 
                onApprove={() => {
                  // When approve is clicked, switch to Messages tab and trigger approval
                  setActiveTab('messages');
                  onApprove();
                }}
                onExecuteInMessages={() => {
                  // Execute Plan in Messages: Switch to Messages tab, trigger approval flow, AND mark plan as approved
                  setIsPlanApproved(true);
                  setActiveTab('messages');
                  onApprove();
                }}
                isPlanApproved={isPlanApproved}
                onAdjustStrategy={() => setIsPlanApproved(false)}
                isDisabled={false}
              />
            )}
          </div>
        ) : activeTab === 'messages' ? (
          // Messages Tab: Native Slackbot empty state or feed content
          (() => {
            const executionFeedItems = panelFeed.filter(item => item.type !== 'loading' && item.type !== 'planner');
            const lastConfirmationIndex = executionFeedItems.map((item) => item.type).lastIndexOf('confirmation');
            const currentCycleItems = lastConfirmationIndex >= 0 ? executionFeedItems.slice(lastConfirmationIndex) : executionFeedItems;
            const latestActivitiesItem = [...currentCycleItems].reverse().find((item) => item.type === 'activities');
            const hasExecutionContent = currentCycleItems.length > 0;
            
            return hasExecutionContent ? (
              // Show feed content when execution items exist
              <div className="flex flex-col gap-6 p-6">
                {currentCycleItems.map((item) => {
                // CRITICAL: Use stable key={item.id} so React never remounts existing items
                switch (item.type) {
                  case 'confirmation':
                    return (
                      <div
                        key={item.id}
                        ref={(el) => {
                          confirmationChecklistRef.current = el;
                        }}
                        className="pb-6"
                      >
                        <Screen4Body 
                          stepperValue={stepperValue} 
                          onComplete={handleChecklistComplete}
                        />
                      </div>
                    );
                  
                  case 'next-steps':
                    // Render next-steps immediately when it appears in feed
                    return (
                      <div
                        key={item.id}
                        ref={(el) => {
                          nextStepsRef.current = el;
                        }}
                        data-next-steps
                        className="pb-6"
                      >
                        <PostApprovalMessage 
                          stepperValue={stepperValue} 
                          onEnterDealRoom={onEnterDealRoom}
                          onReviewHeatmap={() => {
                            // Strict conditional: Only show heatmap when button is explicitly clicked
                            setShowHeatmap(true);
                            // Also notify parent for any external state updates
                            if (onReviewHeatmap) {
                              onReviewHeatmap();
                            }
                          }}
                        />
                      </div>
                    );
                  
                  case 'heatmap':
                    return (
                      <div key={item.id} className="pb-6">
                        <SentimentHeatmapCard onViewActivities={onViewActivities} />
                      </div>
                    );
                  
                  case 'activities':
                    return null;
                  
                  default:
                    return null;
                }
              })}
              
              {/* Strict conditional rendering: Heatmap only shows when button is clicked */}
              {showHeatmap && (
                <div className="pb-6">
                  <StakeholderInsightsCard 
                    onViewActivities={handleViewActivities}
                    onEnterDealRoom={onEnterDealRoom}
                    containerRef={scrollContainerRef}
                  />
                </div>
              )}

              {showHeatmap && latestActivitiesItem && (
                <div key={latestActivitiesItem.id} ref={(el) => { activitiesBlockRef.current = el; }} className="pb-6">
                  <ReplyDivider replyCount={1} />
                  <AccountActivityCard
                    onEnterDealRoom={onEnterDealRoom}
                    onDraftScalabilityEmail={() => onQuickPrompt?.('Draft the scalability email for Sarah with concise executive tone')}
                  />
                </div>
              )}
              
              </div>
            ) : (
              // Native Slackbot empty state - full height, centered
              <div className="flex flex-col items-center justify-center" style={{ minHeight: '100%', padding: '24px' }}>
                {/* Centered Content Group */}
                <div className="flex flex-col items-center text-center">
                  {/* Large Slackbot Avatar */}
                  <div className="mb-6">
                    <Image 
                      src="/slackbot-logo.svg" 
                      alt="Slackbot" 
                      width={64} 
                      height={64} 
                      className="rounded-full"
                    />
                  </div>
                  
                  {/* Greeting Header */}
                  <h2 className="text-2xl font-bold mb-2" style={{ color: T.colors.text }}>
                    Good morning, Rita!
                  </h2>
                  
                  {/* Subtext */}
                  <p className="text-[15px] mb-8" style={{ color: T.colors.textSecondary }}>
                    What's on your mind?
                  </p>
                  
                  {/* Action Pills */}
                  <div className="flex flex-row flex-wrap gap-3 justify-center items-center max-w-2xl">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-full text-sm font-medium transition-colors border border-gray-300 hover:bg-gray-50 bg-white whitespace-nowrap"
                      style={{
                        color: T.colors.text,
                      }}
                    >
                      ✨ Discover
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-full text-sm font-medium transition-colors border border-gray-300 hover:bg-gray-50 bg-white whitespace-nowrap"
                      style={{
                        color: T.colors.text,
                      }}
                    >
                      ✏️ Create
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-full text-sm font-medium transition-colors border border-gray-300 hover:bg-gray-50 bg-white whitespace-nowrap"
                      style={{
                        color: T.colors.text,
                      }}
                    >
                      🔍 Find
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-full text-sm font-medium transition-colors border border-gray-300 hover:bg-gray-50 bg-white whitespace-nowrap"
                      style={{
                        color: T.colors.text,
                      }}
                    >
                      🪄 Brainstorm
                    </button>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          // History and Files tabs: Placeholder for now
          <div className="px-6 py-8 text-center">
            <p className="text-[15px]" style={{ color: T.colors.textSecondary }}>
              {activeTab === 'history' ? 'History' : 'Files'} coming soon
            </p>
          </div>
        )}
      </div>

      {/* Input Box - Only visible when Messages tab is active */}
      {activeTab === 'messages' && (
        <PanelInputBox onSubmit={handleChatSubmit} value={chatInput} onChange={setChatInput} />
      )}
    </div>
  );
}
