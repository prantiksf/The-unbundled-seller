"use client";

/**
 * ARCHITECTURAL PRINCIPLE: Each arc (N2A3, N2A4, etc.) should have its own design components.
 * Changes to one arc's components should not affect other arcs. Only the global Slack app
 * shell should be shared across arcs.
 */

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, ChevronDown } from "lucide-react";
import { PRIORITY_PROSPECTS, type PriorityProspect } from "@/data/priorityProspects";
import { ProspectRow } from "./ProspectRow";

interface N2A4PriorityProspectsCardProps {
  onProspectSelect: (prospect: PriorityProspect) => void;
  selectedProspectId?: string;
  onOpenSlackbot: () => void;
}

const JTBD_OPTIONS = [
  "Prospecting",
  "Deal Closing",
  "Pipeline Review",
  "Account Expansion",
  "Customer Success",
];

/**
 * N2A4-specific Priority Prospects Card component.
 * This component is exclusive to N2A4 and includes the JTBD dropdown.
 * Changes to this component should not affect other arcs.
 */
export function N2A4PriorityProspectsCard({ 
  onProspectSelect, 
  selectedProspectId,
  onOpenSlackbot 
}: N2A4PriorityProspectsCardProps) {
  const [selectedJtbd, setSelectedJtbd] = useState(JTBD_OPTIONS[0]);
  const [isJtbdDropdownOpen, setIsJtbdDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsJtbdDropdownOpen(false);
      }
    };

    if (isJtbdDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isJtbdDropdownOpen]);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-[18px] flex-shrink-0">🎯</span>
          {/* JTBD Dropdown */}
          <div className="relative flex-1 min-w-0" ref={dropdownRef}>
            <button
              onClick={() => setIsJtbdDropdownOpen(!isJtbdDropdownOpen)}
              className="flex items-center gap-1.5 text-[15px] font-bold text-gray-900 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors min-w-0"
            >
              <span className="truncate">{selectedJtbd}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 flex-shrink-0 transition-transform ${isJtbdDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isJtbdDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
                {JTBD_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedJtbd(option);
                      setIsJtbdDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      selectedJtbd === option ? 'bg-gray-50 font-medium' : ''
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="text-[13px] font-normal text-gray-400">({PRIORITY_PROSPECTS.length})</span>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Prospect List - All Prospects with Scroll */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex flex-col gap-3">
          {PRIORITY_PROSPECTS.map((prospect, index) => {
            const isSelected = selectedProspectId === prospect.id;
            return (
              <ProspectRow
                key={prospect.id}
                prospect={prospect}
                priority={index === 0 ? "hot" : "warm"}
                isSelected={isSelected}
                compact
                onReviewDraft={(prospect) => {
                  // Select prospect and open Slackbot panel when clicking anywhere on card
                  onProspectSelect(prospect);
                  onOpenSlackbot();
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
