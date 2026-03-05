"use client";

import { PriorityProspectsCard } from "./PriorityProspectsCard";
import { SlackTodayView } from "./SlackTodayView";
import type { PriorityProspect } from "@/data/priorityProspects";

interface N2A3TodayViewProps {
  onStartWorkMode: () => void;
  onReviewDraft: (prospect: PriorityProspect) => void;
  onNavigateToActivity?: () => void;
}

export function N2A3TodayView({ 
  onStartWorkMode, 
  onReviewDraft,
  onNavigateToActivity 
}: N2A3TodayViewProps) {
  // N2A3 uses SlackTodayView but injects PriorityProspectsCard at the top
  // We'll modify SlackTodayView to accept an optional topCard prop
  return (
    <SlackTodayView 
      onNavigateToActivity={onNavigateToActivity}
      topCard={
        <PriorityProspectsCard
          onStartWorkMode={onStartWorkMode}
          onReviewDraft={onReviewDraft}
        />
      }
    />
  );
}
