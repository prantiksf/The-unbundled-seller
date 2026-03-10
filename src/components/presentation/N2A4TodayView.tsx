"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { SlackTodayView } from "./SlackTodayView";
import { N2A4WorkModeLayout } from "./WorkModeLayout";
import type { PriorityProspect } from "@/data/priorityProspects";

interface N2A4TodayViewProps {
  onStartWorkMode: () => void;
  onReviewDraft: (prospect: PriorityProspect) => void;
  onExitWorkMode?: () => void;
  onNavigateToActivity?: () => void;
  externalWorkModeActive?: boolean;
  externalBuilderOpen?: boolean;
  externalSelectedProspectId?: string;
}

export function N2A4TodayView({ 
  onStartWorkMode, 
  onReviewDraft,
  onExitWorkMode,
  onNavigateToActivity,
  externalWorkModeActive = false,
  externalBuilderOpen = false,
  externalSelectedProspectId: _externalSelectedProspectId
}: N2A4TodayViewProps) {
  const [isWorkMode, setIsWorkMode] = useState(externalWorkModeActive);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  useEffect(() => {
    setIsWorkMode(externalWorkModeActive);
    if (!externalWorkModeActive) {
      setIsBuilderOpen(false);
    }
  }, [externalWorkModeActive]);

  useEffect(() => {
    setIsBuilderOpen(externalBuilderOpen);
  }, [externalBuilderOpen]);

  const handleWorkModeToggle = () => {
    if (!isWorkMode) {
      // Use flushSync to force synchronous state update and immediate re-render
      flushSync(() => {
        setIsWorkMode(true);
      });
      
      // Callbacks after state is updated and component has re-rendered
      onStartWorkMode();
      setIsBuilderOpen(false);
    } else {
      // When exiting work mode
      flushSync(() => {
        setIsWorkMode(false);
      });
      setIsBuilderOpen(false);
      onExitWorkMode?.();
    }
  };

  const handleOpenBuilder = (prospect: PriorityProspect) => {
    setIsBuilderOpen(true);
    onReviewDraft(prospect);
  };

  if (isWorkMode) {
    return (
      <N2A4WorkModeLayout 
        onWorkModeToggle={handleWorkModeToggle}
        onOpenBuilder={handleOpenBuilder}
        isBuilderOpen={isBuilderOpen}
      />
    );
  }

  return (
    <SlackTodayView 
      onNavigateToActivity={onNavigateToActivity}
      workModeToggle={
        <button
          onClick={handleWorkModeToggle}
          className="px-3 py-1 text-[12px] rounded-lg font-medium transition-colors"
          style={{ backgroundColor: "transparent", color: "#4A154B", border: "1px solid #c9a8ca" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f9f0f9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          Work Mode
        </button>
      }
    />
  );
}
