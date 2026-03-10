"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import type { PriorityProspect } from "@/data/priorityProspects";

interface ProspectRowProps {
  prospect: PriorityProspect;
  priority?: "hot" | "warm" | "cold"; // Priority level for the badge
  isSelected?: boolean; // Whether this prospect is currently selected
  compact?: boolean;
  onReviewDraft: (prospect: PriorityProspect) => void;
}

// Generate initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Get avatar color classes based on prospect (rotates through pastel colors)
function getAvatarColorClasses(name: string): { bg: string; text: string } {
  // Rotate through pastel colors based on first letter of name
  const colors = [
    { bg: "bg-red-100", text: "text-red-900" },      // MC example
    { bg: "bg-yellow-100", text: "text-yellow-900" }, // JR example
    { bg: "bg-pink-100", text: "text-pink-900" },     // SK example
    { bg: "bg-blue-100", text: "text-blue-900" },
    { bg: "bg-green-100", text: "text-green-900" },
    { bg: "bg-purple-100", text: "text-purple-900" },
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

// Get badge color styles based on signal text (matches image color palette exactly)
function getBadgeColorStyles(signal: string, index: number): { backgroundColor: string; color: string } {
  // Exact color palette from the image
  const badgeColors = [
    { backgroundColor: "#F2F2F2", color: "#4A4A4A" },      // Very light grey / Dark grey
    { backgroundColor: "#EAE0D6", color: "#915C3D" },     // Light beige/tan / Medium brown
    { backgroundColor: "#FFEDBB", color: "#AA7F1F" },      // Light yellow/gold / Golden brown
    { backgroundColor: "#FFDCDC", color: "#CC2C5E" },       // Light pink / Dark pink/magenta
    { backgroundColor: "#EEDDFF", color: "#8E3DA8" },       // Light lavender / Dark purple
    { backgroundColor: "#E3EEFD", color: "#3B58C1" },     // Light blue/periwinkle / Dark blue
    { backgroundColor: "#CFF5F8", color: "#1C95A7" },     // Light teal/sky blue / Dark teal/cyan
    { backgroundColor: "#DBF6E4", color: "#379965" },      // Light mint green / Dark green
    { backgroundColor: "#F4FDCC", color: "#83A03B" },     // Pale lime green / Olive green
  ];
  
  // Use signal text hash + index to get consistent color per signal
  const hash = signal.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = (hash + index) % badgeColors.length;
  return badgeColors[colorIndex];
}

export function ProspectRow({
  prospect,
  priority = "warm",
  isSelected = false,
  compact = false,
  onReviewDraft,
}: ProspectRowProps) {
  const initials = getInitials(prospect.name);
  const avatarColors = getAvatarColorClasses(prospect.name);
  const [avatarError, setAvatarError] = useState(false);
  const [visibleBadgeCount, setVisibleBadgeCount] = useState<number | null>(null);
  const badgeContainerRef = useRef<HTMLDivElement>(null);

  // Determine priority badge
  const priorityBadge = priority === "hot" ? "Hot 🔥" : null;

  // Get step text (e.g., "Step 5: Email")
  const stepText = `Step ${prospect.stepNumber}: Email`;

  // Collect all badges (priority + signals)
  const allBadges = [];
  if (priorityBadge) {
    allBadges.push({ text: priorityBadge, isPriority: true });
  }
  prospect.signals.forEach((signal) => {
    allBadges.push({ text: signal, isPriority: false });
  });

  // Calculate visible badges based on container width
  useEffect(() => {
    if (compact) return;
    if (!badgeContainerRef.current) return;

    const calculateVisibleBadges = () => {
      const container = badgeContainerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const badges = container.querySelectorAll('[data-badge]');
      
      if (badges.length === 0) {
        // Initial render - show all badges first, then recalculate
        setVisibleBadgeCount(allBadges.length);
        return;
      }

      let visibleCount = 0;
      let totalWidth = 0;
      const gap = 8; // gap-2 = 8px
      const overflowBadgeReserve = 50; // Reserve space for "+X" badge

      // Measure each badge
      badges.forEach((badge, index) => {
        const badgeWidth = (badge as HTMLElement).offsetWidth;
        const wouldFit = totalWidth + badgeWidth + (index > 0 ? gap : 0) <= containerWidth - overflowBadgeReserve;
        
        if (wouldFit || index === 0) {
          totalWidth += badgeWidth + (index > 0 ? gap : 0);
          visibleCount++;
        }
      });

      setVisibleBadgeCount(visibleCount);
    };

    // Initial calculation
    calculateVisibleBadges();

    // Use ResizeObserver to recalculate on container resize
    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleBadges();
    });

    if (badgeContainerRef.current) {
      resizeObserver.observe(badgeContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [allBadges.length, compact]);

  const visibleBadges = visibleBadgeCount !== null 
    ? allBadges.slice(0, visibleBadgeCount)
    : allBadges;
  const hiddenBadgeCount = allBadges.length - visibleBadges.length;

  return (
    <div
      className={`group flex flex-row items-start gap-3 rounded-lg relative transition-colors cursor-pointer ${
        compact
          ? isSelected
            ? "bg-blue-50 border border-blue-100 border-l-4 border-l-blue-600 py-3 px-4"
            : "bg-white border border-transparent hover:bg-gray-50 py-3 px-4"
          : isSelected
            ? "bg-white border-2 border-blue-500 shadow-sm p-4"
            : "bg-white border border-gray-100 hover:bg-gray-50 p-4"
      }`}
      onClick={() => onReviewDraft(prospect)}
    >
      {/* Avatar - Real photograph with fallback */}
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

      {/* Content Stack */}
      <div className={`flex-1 min-w-0 flex flex-col ${compact ? "gap-1" : "gap-1.5"}`}>
        {/* Line 1: Name (left) + Step (right) */}
        <div className="flex items-center justify-between min-w-0 gap-2">
          <span className="text-gray-900 font-semibold text-sm flex-shrink-0">{prospect.name}</span>
          <span className="text-gray-500 text-xs whitespace-nowrap flex-shrink-0">{stepText}</span>
        </div>

        {/* Line 2: Job Role (Title · Company) */}
        <div className="flex items-center min-w-0">
          <span className="text-gray-500 text-xs font-normal">
            {prospect.title} · {prospect.company}
          </span>
        </div>

        {!compact && (
          <>
            {/* Line 3: Badges (single line with overflow indicator) */}
            <div
              ref={badgeContainerRef}
              className="flex items-center gap-2 overflow-hidden"
            >
              {/* Render all badges for measurement, but only show visible ones */}
              {allBadges.map((badge, idx) => {
                const badgeStyles = badge.isPriority
                  ? { backgroundColor: "#FFEDBB", color: "#AA7F1F" }
                  : getBadgeColorStyles(badge.text, idx);
                const isVisible = visibleBadgeCount === null || idx < visibleBadgeCount;

                return (
                  <span
                    key={idx}
                    data-badge
                    className={`px-3 py-0.5 h-5 text-xs font-medium inline-flex items-center justify-center whitespace-nowrap flex-shrink-0 ${!isVisible ? "invisible" : ""}`}
                    style={{
                      borderRadius: "4px",
                      backgroundColor: badgeStyles.backgroundColor,
                      color: badgeStyles.color,
                    }}
                  >
                    {badge.text}
                  </span>
                );
              })}
              {hiddenBadgeCount > 0 && (
                <span
                  className="px-3 py-0.5 h-5 text-xs font-medium inline-flex items-center justify-center whitespace-nowrap flex-shrink-0 text-gray-500 bg-gray-100"
                  style={{ borderRadius: "4px" }}
                >
                  +{hiddenBadgeCount}
                </span>
              )}
            </div>

            {/* Line 4: AI Insight (truncated to 2 lines) */}
            <div className="flex items-start gap-1.5">
              <span className="text-gray-700 text-xs flex-shrink-0">✨</span>
              <span className="text-gray-700 text-xs min-w-0 line-clamp-2">{prospect.context}</span>
            </div>
          </>
        )}
      </div>

      {/* Hover Button - Review Draft (absolute positioned) */}
      {!compact && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReviewDraft(prospect);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto border border-gray-300 bg-white text-gray-700 shadow-sm rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-opacity"
        >
          Review Draft
        </button>
      )}
    </div>
  );
}
