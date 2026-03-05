"use client";

import Image from "next/image";
import { useState } from "react";
import type { PriorityProspect } from "@/data/priorityProspects";

interface ProspectRowProps {
  prospect: PriorityProspect;
  priority?: "hot" | "warm" | "cold"; // Priority level for the badge
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

export function ProspectRow({ prospect, priority = "warm", onReviewDraft }: ProspectRowProps) {
  const initials = getInitials(prospect.name);
  const avatarColors = getAvatarColorClasses(prospect.name);
  const [avatarError, setAvatarError] = useState(false);

  // Determine priority badge
  const priorityBadge = priority === "hot" ? "Hot 🔥" : null;

  // Get step text (e.g., "Step 5: Email")
  const stepText = `Step ${prospect.stepNumber}: Email`;

  return (
    <div
      className="group flex flex-row items-start gap-4 p-4 border border-gray-100 rounded-lg relative hover:bg-gray-50 transition-colors cursor-pointer"
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

      {/* Content Stack - Three lines */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Line 1: Name + Title/Company inline */}
        <div className="flex items-center min-w-0 gap-2">
          <span className="text-gray-900 font-semibold text-sm flex-shrink-0">{prospect.name}</span>
          <span className="text-gray-500 text-xs font-normal truncate min-w-0">
            {prospect.title} · {prospect.company}
          </span>
        </div>

        {/* Line 2: Badges & Step */}
        <div className="flex items-center gap-2">
          {priorityBadge && (
            <span 
              className="text-xs px-3 py-0.5 h-5 font-medium inline-flex items-center justify-center whitespace-nowrap"
              style={{ 
                borderRadius: '4px',
                backgroundColor: '#FFEDBB',
                color: '#AA7F1F'
              }}
            >
              {priorityBadge}
            </span>
          )}
          {prospect.signals.map((signal, idx) => {
            const badgeStyles = getBadgeColorStyles(signal, idx);
            return (
              <span
                key={idx}
                className="px-3 py-0.5 h-5 text-xs font-medium inline-flex items-center justify-center whitespace-nowrap"
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
          <span className="text-gray-500 text-xs">{stepText}</span>
        </div>

        {/* Line 3: AI Insight */}
        <div className="flex items-start gap-1.5">
          <span className="text-gray-700 text-xs flex-shrink-0">✨</span>
          <span className="text-gray-700 text-xs truncate min-w-0">{prospect.context}</span>
        </div>
      </div>

      {/* Hover Button - Review Draft (absolute positioned) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onReviewDraft(prospect);
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto border border-gray-300 bg-white text-gray-700 shadow-sm rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-opacity"
      >
        Review Draft
      </button>
    </div>
  );
}
