"use client";

import { useState } from "react";
import { MoreHorizontal, ChevronRight } from "lucide-react";
import { PRIORITY_PROSPECTS, type PriorityProspect } from "@/data/priorityProspects";
import { ProspectRow } from "./ProspectRow";

// Work Mode Button with animated gradient border
function WorkModeButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-lg cursor-pointer overflow-hidden transition-all ${hovered ? "p-[1px]" : "p-[1.5px]"}`}
      style={{ boxShadow: hovered ? "0 2px 8px rgba(0,0,0,0.1)" : "none" }}
    >
      {/* Resting border — static gradient, visible at rest */}
      <div
        className="absolute inset-0 rounded-lg transition-opacity duration-300"
        style={{ 
          background: "linear-gradient(135deg, #e5e7eb, #d1d5db)",
          opacity: hovered ? 0 : 0.3
        }}
      />
      {/* Spinning conic-gradient — animated on hover */}
      <div
        className="absolute transition-opacity duration-300"
        style={{
          top: "50%",
          left: "50%",
          width: "400px",
          height: "400px",
          transform: "translate(-50%, -50%)",
          background: "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981, #3b82f6)",
          animation: hovered ? "spin-border 3s linear infinite" : "none",
          opacity: hovered ? 1 : 0,
        }}
      />
      <div className={`relative px-3 py-1 text-[11px] font-bold text-gray-700 bg-white whitespace-nowrap ${hovered ? "rounded-[calc(0.5rem-1px)]" : "rounded-[calc(0.5rem-1.5px)]"}`}>
        Work Mode
      </div>
    </div>
  );
}

interface PriorityProspectsCardProps {
  onStartWorkMode: () => void;
  onReviewDraft: (prospect: PriorityProspect) => void;
}

export function PriorityProspectsCard({ onStartWorkMode, onReviewDraft }: PriorityProspectsCardProps) {
  const [showAllProspects, setShowAllProspects] = useState(false);
  
  const INITIAL_DISPLAY_COUNT = 3;
  const initialProspects = PRIORITY_PROSPECTS.slice(0, INITIAL_DISPLAY_COUNT);
  const remainingProspects = PRIORITY_PROSPECTS.slice(INITIAL_DISPLAY_COUNT);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[18px] flex-shrink-0">🎯</span>
          <h2 className="text-[15px] font-bold text-gray-900">Priority Prospects</h2>
          <span className="text-[13px] font-normal text-gray-400">· {PRIORITY_PROSPECTS.length}</span>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <WorkModeButton onClick={onStartWorkMode} />
          <button
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Show first 3 prospects */}
      <div className="flex flex-col gap-3">
        {initialProspects.map((prospect, index) => (
          <ProspectRow
            key={prospect.id}
            prospect={prospect}
            priority={index === 0 ? "hot" : "warm"} // First prospect is "hot", others are "warm"
            onReviewDraft={onReviewDraft}
          />
        ))}
      </div>

      {/* Show All Prospects Accordion */}
      {remainingProspects.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => setShowAllProspects(!showAllProspects)}
            className="flex items-center gap-1.5 text-[13px] font-bold text-gray-700 hover:text-gray-900 transition-colors w-full"
          >
            <ChevronRight
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showAllProspects ? "rotate-90" : ""}`}
            />
            Show all prospects
            {remainingProspects.length > 0 && (
              <span className="font-normal text-gray-400 ml-0.5">{remainingProspects.length}</span>
            )}
          </button>
          {showAllProspects && (
            <div className="mt-3 flex flex-col gap-3">
              {remainingProspects.map((prospect, index) => (
                <ProspectRow
                  key={prospect.id}
                  prospect={prospect}
                  priority="warm"
                  onReviewDraft={onReviewDraft}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
