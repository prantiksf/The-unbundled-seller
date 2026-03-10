"use client";

/**
 * ARCHITECTURAL PRINCIPLE: Each arc (N2A3, N2A4, etc.) should have its own design components.
 * Changes to one arc's components should not affect other arcs. Only the global Slack app
 * shell should be shared across arcs.
 */

import { MoreHorizontal } from "lucide-react";
import { PRIORITY_PROSPECTS, type PriorityProspect } from "@/data/priorityProspects";
import { ProspectRow } from "./ProspectRow";

interface N2A3PriorityProspectsCardProps {
  onStartWorkMode: () => void;
  onReviewDraft: (prospect: PriorityProspect) => void;
}

/**
 * N2A3-specific Priority Prospects Card component.
 * This component is exclusive to N2A3 and should not be shared with other arcs.
 */
export function N2A3PriorityProspectsCard({ onStartWorkMode, onReviewDraft }: N2A3PriorityProspectsCardProps) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[18px] flex-shrink-0">🎯</span>
          <h2 className="text-[15px] font-bold text-gray-900">Priority Prospects</h2>
          <span className="text-[13px] font-normal text-gray-400">· {PRIORITY_PROSPECTS.length}</span>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* All Prospects - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex flex-col gap-3">
          {PRIORITY_PROSPECTS.map((prospect, index) => (
            <ProspectRow
              key={prospect.id}
              prospect={prospect}
              priority={index === 0 ? "hot" : "warm"} // First prospect is "hot", others are "warm"
              onReviewDraft={onReviewDraft}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
