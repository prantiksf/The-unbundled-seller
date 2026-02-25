"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ScenarioConfig, INITIAL_SCENARIOS } from "@/lib/scenarioConfig";

const NARRATIVE_LABELS: Record<string, string> = {
  default: "01 : Quarter Closing Story",
  leadership: "02 : AE JTBDs in Slack",
};

// Explicitly list IDs for each narrative so copies added for other narratives don't bleed in
const NARRATIVE_1_IDS = [
  "quarter-start",
  "mobile-pulse",
  "watch-win",
  "deal-recovery",
  "sentiment-detection",
  "team-collaboration",
  "autonomous-close",
  "capacity-management",
  "multi-surface-decisions",
  "ambient-crm",
  "zero-touch-proof",
  "final-push",
];

const NARRATIVE_ARC_MAP: Record<string, string[]> = {
  default: NARRATIVE_1_IDS,
  leadership: ["slack-jtbd-1", "slack-jtbd-2", "slack-jtbd-3", "slack-jtbd-4", "slack-jtbd-5", "slack-jtbd-6"],
};

interface ScenarioVisibilityContextType {
  scenarios: ScenarioConfig[];
  currentNarrativeData: ScenarioConfig[];
  activeScenarios: ScenarioConfig[];
  activeNarrative: string;
  setActiveNarrative: (narrativeId: string) => void;
  narrativeOptions: Array<{ id: string; label: string }>;
  hiddenArcIds: string[];
  toggleArcVisibility: (scenarioId: string) => void;
  toggleScenario: (scenarioId: string) => void;
  setScenarioVisibility: (scenarioId: string, isVisible: boolean) => void;
  getScenarioBySceneId: (sceneId: number) => ScenarioConfig | undefined;
  getScenarioById: (id: string) => ScenarioConfig | undefined;
  // Global settings — per-narrative density
  presentationDensity: string;           // active narrative's density (read shortcut)
  setPresentationDensity: (density: string) => void; // writes to active narrative
  allPresentationDensities: Record<string, string>;  // full dictionary for inspection
  // Arc ordering per narrative
  reorderArcs: (narrativeId: string, fromIndex: number, toIndex: number) => void;
}

const ScenarioVisibilityContext = createContext<ScenarioVisibilityContextType | undefined>(undefined);

export function ScenarioVisibilityProvider({ children }: { children: ReactNode }) {
  const [scenarios, setScenarios] = useState<ScenarioConfig[]>(INITIAL_SCENARIOS);
  const [activeNarrativeRaw, setActiveNarrativeRaw] = useState<string>("default");

  // When switching narratives, seed a default density if that narrative hasn't been configured yet
  const setActiveNarrative = useCallback((narrativeId: string) => {
    setActiveNarrativeRaw(narrativeId);
    setPresentationDensities(prev =>
      narrativeId in prev ? prev : { ...prev, [narrativeId]: "detailed-narrative" }
    );
  }, []);

  const activeNarrative = activeNarrativeRaw;
  // Density is stored per-narrative so switching narratives preserves each one's setting
  const [presentationDensities, setPresentationDensities] = useState<Record<string, string>>({
    default: "detailed-narrative",
    leadership: "detailed-narrative",
  });
  const [hiddenArcIdsByNarrative, setHiddenArcIdsByNarrative] = useState<Record<string, string[]>>({
    default: [],
    leadership: [],
  });
  
  // Store custom arc order per narrative (defaults to NARRATIVE_ARC_MAP order)
  const [arcOrderByNarrative, setArcOrderByNarrative] = useState<Record<string, string[]>>({
    default: NARRATIVE_ARC_MAP.default,
    leadership: NARRATIVE_ARC_MAP.leadership,
  });

  const narrativeOptions = Object.entries(NARRATIVE_LABELS).map(([id, label]) => ({ id, label }));
  // Use custom order if available, otherwise fall back to NARRATIVE_ARC_MAP
  const narrativeArcIds = arcOrderByNarrative[activeNarrative] || NARRATIVE_ARC_MAP[activeNarrative] || NARRATIVE_ARC_MAP.default;
  const hiddenArcIds = hiddenArcIdsByNarrative[activeNarrative] || [];
  const currentNarrativeData = narrativeArcIds
    .map((id) => scenarios.find((scenario) => scenario.id === id))
    .filter((scenario): scenario is ScenarioConfig => Boolean(scenario));

  // Derived: Filter visible arcs in selected narrative
  const activeScenarios = currentNarrativeData.filter((scenario) => !hiddenArcIds.includes(scenario.id));

  const toggleArcVisibility = useCallback((scenarioId: string) => {
    setHiddenArcIdsByNarrative((prev) => {
      const currentHidden = prev[activeNarrative] || [];
      const isHidden = currentHidden.includes(scenarioId);
      const nextHidden = isHidden
        ? currentHidden.filter((id) => id !== scenarioId)
        : [...currentHidden, scenarioId];
      return { ...prev, [activeNarrative]: nextHidden };
    });
  }, [activeNarrative]);

  // Backward-compatible alias: toggle arc visibility in active narrative
  const toggleScenario = useCallback((scenarioId: string) => {
    toggleArcVisibility(scenarioId);
  }, [toggleArcVisibility]);

  // Backward-compatible alias: set arc visibility in active narrative
  const setScenarioVisibility = useCallback((scenarioId: string, isVisible: boolean) => {
    setHiddenArcIdsByNarrative((prev) => {
      const currentHidden = prev[activeNarrative] || [];
      const isCurrentlyHidden = currentHidden.includes(scenarioId);
      if (isVisible && isCurrentlyHidden) {
        return { ...prev, [activeNarrative]: currentHidden.filter((id) => id !== scenarioId) };
      }
      if (!isVisible && !isCurrentlyHidden) {
        return { ...prev, [activeNarrative]: [...currentHidden, scenarioId] };
      }
      return prev;
    });
  }, [activeNarrative]);

  // Get scenario by original sceneId
  const getScenarioBySceneId = useCallback((sceneId: number) => {
    return scenarios.find(s => s.sceneId === sceneId);
  }, [scenarios]);

  // Get scenario by id
  const getScenarioById = useCallback((id: string) => {
    return scenarios.find(s => s.id === id);
  }, [scenarios]);

  // Active narrative's density (read shortcut)
  const presentationDensity = presentationDensities[activeNarrative] ?? "detailed-narrative";

  // Write density only for the active narrative — other narratives are untouched
  const setPresentationDensity = useCallback((density: string) => {
    setPresentationDensities(prev => ({ ...prev, [activeNarrative]: density }));
  }, [activeNarrative]);

  // Reorder arcs within a narrative
  const reorderArcs = useCallback((narrativeId: string, fromIndex: number, toIndex: number) => {
    setArcOrderByNarrative((prev) => {
      const currentOrder = prev[narrativeId] || NARRATIVE_ARC_MAP[narrativeId] || [];
      const newOrder = [...currentOrder];
      const [removed] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, removed);
      return { ...prev, [narrativeId]: newOrder };
    });
  }, []);

  return (
    <ScenarioVisibilityContext.Provider
      value={{
        scenarios,
        currentNarrativeData,
        activeScenarios,
        activeNarrative,
        setActiveNarrative,
        narrativeOptions,
        hiddenArcIds,
        toggleArcVisibility,
        toggleScenario,
        setScenarioVisibility,
        getScenarioBySceneId,
        getScenarioById,
        presentationDensity,
        setPresentationDensity,
        allPresentationDensities: presentationDensities,
        reorderArcs,
      }}
    >
      {children}
    </ScenarioVisibilityContext.Provider>
  );
}

export function useScenarioVisibility() {
  const context = useContext(ScenarioVisibilityContext);
  if (!context) {
    throw new Error("useScenarioVisibility must be used within ScenarioVisibilityProvider");
  }
  return context;
}
