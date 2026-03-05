"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ScenarioConfig, INITIAL_SCENARIOS } from "@/lib/scenarioConfig";

const NARRATIVE_LABELS: Record<string, string> = {
  default: "01 : Quarter Closing Story",
  leadership: "02 : AE JTBDs in Slack",
};

// Default narrative can be set via environment variable (for Heroku deployment)
// Valid values: "default" | "leadership"
const DEFAULT_NARRATIVE = (process.env.NEXT_PUBLIC_DEFAULT_NARRATIVE as string) || "default";

// localStorage key for user's default narrative preference
const DEFAULT_NARRATIVE_STORAGE_KEY = "default_narrative_preference";

// Helper to get default narrative from localStorage
function getDefaultNarrativeFromStorage(): string {
  if (typeof window === "undefined") return DEFAULT_NARRATIVE;
  const stored = localStorage.getItem(DEFAULT_NARRATIVE_STORAGE_KEY);
  if (stored && Object.keys(NARRATIVE_LABELS).includes(stored)) {
    return stored;
  }
  return DEFAULT_NARRATIVE;
}

// Helper to save default narrative to localStorage
function saveDefaultNarrativeToStorage(narrativeId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEFAULT_NARRATIVE_STORAGE_KEY, narrativeId);
}

// Explicitly list IDs for each narrative so copies added for other narratives don't bleed in
const NARRATIVE_1_IDS = [
  "quarter-start",
  "deal-recovery",
  "sentiment-detection",
  "team-collaboration",
  "autonomous-close",
  "capacity-management",
  "multi-surface-decisions",
  "ambient-crm",
  "zero-touch-proof",
  "final-push",
  "mobile-pulse",
  "watch-win",
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
  // Default narrative management
  defaultNarrative: string;
  setDefaultNarrative: (narrativeId: string) => void;
}

const ScenarioVisibilityContext = createContext<ScenarioVisibilityContextType | undefined>(undefined);

export function ScenarioVisibilityProvider({ children }: { children: ReactNode }) {
  const [scenarios, setScenarios] = useState<ScenarioConfig[]>(INITIAL_SCENARIOS);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Read narrative from URL parameter (support both 'n' and 'narrative' for backward compatibility)
  // Fallback to localStorage, then env var, then default to "default"
  const narrativeFromUrl = searchParams.get("n") || searchParams.get("narrative");
  const defaultFromStorage = getDefaultNarrativeFromStorage();
  const validNarrative = narrativeFromUrl && Object.keys(NARRATIVE_LABELS).includes(narrativeFromUrl)
    ? narrativeFromUrl
    : (Object.keys(NARRATIVE_LABELS).includes(defaultFromStorage) ? defaultFromStorage : "default");
  
  // Read style/density from URL parameter
  const styleFromUrl = searchParams.get("style");
  
  // Read arcs count from URL parameter
  const arcsFromUrl = searchParams.get("arcs");
  
  const [defaultNarrative, setDefaultNarrativeState] = useState<string>(defaultFromStorage);
  
  const [activeNarrativeRaw, setActiveNarrativeRaw] = useState<string>(validNarrative);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync defaultNarrative from localStorage on mount (only once)
  useEffect(() => {
    const stored = getDefaultNarrativeFromStorage();
    setDefaultNarrativeState(stored);
  }, []); // Empty deps - only run once on mount

  // Initialize from URL on mount, or set default if no URL param (only run once)
  useEffect(() => {
    if (isInitialized) return; // Guard to prevent re-running
    
    if (narrativeFromUrl && Object.keys(NARRATIVE_LABELS).includes(narrativeFromUrl)) {
      setActiveNarrativeRaw(narrativeFromUrl);
      
      // Apply style/density from URL if present
      if (styleFromUrl) {
        setPresentationDensities(prev => ({
          ...prev,
          [narrativeFromUrl]: styleFromUrl
        }));
      }
      
      // Apply arcs visibility from URL if present
      if (arcsFromUrl) {
        const targetCount = parseInt(arcsFromUrl, 10);
        const narrativeArcIds = NARRATIVE_ARC_MAP[narrativeFromUrl] || NARRATIVE_ARC_MAP.default;
        if (targetCount < narrativeArcIds.length) {
          const arcsToHide = narrativeArcIds.length - targetCount;
          const arcsToHideIds: string[] = [];
          for (let i = narrativeArcIds.length - arcsToHide; i < narrativeArcIds.length; i++) {
            arcsToHideIds.push(narrativeArcIds[i]);
          }
          setHiddenArcIdsByNarrative(prev => ({
            ...prev,
            [narrativeFromUrl]: arcsToHideIds
          }));
        }
      }
      
      setIsInitialized(true);
    } else {
      // No URL param - use default from storage/env and update URL
      const defaultToUse = getDefaultNarrativeFromStorage();
      setActiveNarrativeRaw(defaultToUse);
      // Use router.replace only once, don't include router in deps
      const params = new URLSearchParams(window.location.search);
      params.set("n", defaultToUse); // Use 'n' instead of 'narrative' for consistency
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
      setIsInitialized(true);
    }
  }, [isInitialized, narrativeFromUrl, styleFromUrl, arcsFromUrl]); // Include style and arcs deps

  // Sync state when URL changes (after initialization) - only when URL param actually changes
  const prevNarrativeFromUrlRef = useRef<string | null>(narrativeFromUrl);
  useEffect(() => {
    if (isInitialized && narrativeFromUrl && Object.keys(NARRATIVE_LABELS).includes(narrativeFromUrl)) {
      // Only update if URL param actually changed (not just reference)
      if (narrativeFromUrl !== prevNarrativeFromUrlRef.current) {
        prevNarrativeFromUrlRef.current = narrativeFromUrl;
        // Use functional update to avoid needing activeNarrativeRaw in deps
        setActiveNarrativeRaw(prev => {
          if (prev !== narrativeFromUrl) {
            return narrativeFromUrl;
          }
          return prev; // No change needed
        });
      }
    }
  }, [narrativeFromUrl, isInitialized]); // Removed activeNarrativeRaw to prevent infinite loop

  // When switching narratives, update URL and seed a default density if that narrative hasn't been configured yet
  const setActiveNarrative = useCallback((narrativeId: string) => {
    setActiveNarrativeRaw(narrativeId);
    setPresentationDensities(prev =>
      narrativeId in prev ? prev : { ...prev, [narrativeId]: "detailed-narrative" }
    );
    
    // Update URL with new narrative parameter (preserve other params)
    // Use window.location to avoid dependency on router/searchParams/pathname which can cause loops
    const params = new URLSearchParams(window.location.search);
    params.set("n", narrativeId); // Use 'n' for consistency with new URL format
    // Also set 'narrative' for backward compatibility
    params.set("narrative", narrativeId);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, []); // Empty deps - use window.location directly to avoid loop-causing dependencies

  // Set default narrative (saves to localStorage)
  const setDefaultNarrative = useCallback((narrativeId: string) => {
    if (Object.keys(NARRATIVE_LABELS).includes(narrativeId)) {
      saveDefaultNarrativeToStorage(narrativeId);
      setDefaultNarrativeState(narrativeId);
      
      // If there's no URL parameter, update URL to reflect the new default
      // Use window.location to avoid dependency on router/searchParams/pathname
      const urlParams = new URLSearchParams(window.location.search);
      if (!urlParams.get("narrative")) {
        urlParams.set("narrative", narrativeId);
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []); // Empty deps - use window.location directly to avoid loop-causing dependencies

  const activeNarrative = activeNarrativeRaw;
  // Density is stored per-narrative so switching narratives preserves each one's setting
  // Initialize from URL param 'style' if present
  const initialDensity = styleFromUrl || "detailed-narrative";
  const [presentationDensities, setPresentationDensities] = useState<Record<string, string>>({
    default: initialDensity,
    leadership: initialDensity,
  });
  
  // Initialize arcs visibility from URL param 'arcs' if present
  const initialHiddenArcs: string[] = [];
  if (arcsFromUrl && validNarrative) {
    const targetCount = parseInt(arcsFromUrl, 10);
    const narrativeArcIds = NARRATIVE_ARC_MAP[validNarrative] || NARRATIVE_ARC_MAP.default;
    if (targetCount < narrativeArcIds.length) {
      // Hide arcs to match target count (hide from the end)
      const arcsToHide = narrativeArcIds.length - targetCount;
      for (let i = narrativeArcIds.length - arcsToHide; i < narrativeArcIds.length; i++) {
        initialHiddenArcs.push(narrativeArcIds[i]);
      }
    }
  }
  const [hiddenArcIdsByNarrative, setHiddenArcIdsByNarrative] = useState<Record<string, string[]>>({
    default: initialHiddenArcs,
    leadership: initialHiddenArcs,
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
    // Update URL with style parameter
    const params = new URLSearchParams(window.location.search);
    params.set("style", density);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
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
        defaultNarrative,
        setDefaultNarrative,
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
