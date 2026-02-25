"use client";

import { useState, useEffect, useMemo } from "react";
import { DemoDataProvider } from "@/context/DemoDataContext";
import { usePresentationScene } from "@/context/PresentationSceneContext";
import { useScenarioVisibility } from "@/context/ScenarioVisibilityContext";
import { SCENES, SceneData } from "@/lib/presentation-data";
import { Hero } from "./Hero";
import { Unbundling } from "./Unbundling";
import { SceneLayout } from "./SceneLayout";

type ViewState = "hero" | "unbundling" | number;

export function TheStage() {
  const { currentScene, setCurrentScene } = usePresentationScene();
  const { activeScenarios, getScenarioBySceneId } = useScenarioVisibility();
  const [currentView, setCurrentView] = useState<ViewState>("hero");

  // Sync currentView with currentScene from context
  useEffect(() => {
    if (currentScene === 0) {
      setCurrentView("hero");
    } else if (currentScene > 0) {
      // Allow any sceneId, not just 1-13, to support new scenarios
      setCurrentView(currentScene);
    }
  }, [currentScene]);

  // Safety check: If current scene is hidden, fallback to first visible or home
  useEffect(() => {
    if (currentScene > 0) {
      const isCurrentSceneActive = activeScenarios.some((scenario) => scenario.sceneId === currentScene);
      if (!isCurrentSceneActive) {
        // Current scene is hidden, fallback to first visible scenario or home
        if (activeScenarios.length > 0) {
          setCurrentScene(activeScenarios[0].sceneId);
        } else {
          setCurrentScene(0);
        }
      }
    }
  }, [currentScene, activeScenarios, setCurrentScene]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentView === "hero") return;
      if (currentView === "unbundling") {
        if (e.key === "ArrowRight" || e.key === " ") {
          e.preventDefault();
          // Unbundling handles its own advance
        }
        if (e.key === "Escape") {
          setCurrentView("hero");
          setCurrentScene(0);
        }
        return;
      }
      // Scene navigation - uses activeScenarios
      if (typeof currentView === "number") {
        const currentIdx = activeScenarios.findIndex((s) => s.sceneId === currentView);
        if (e.key === "ArrowRight" && currentIdx < activeScenarios.length - 1) {
          const nextScenario = activeScenarios[currentIdx + 1];
          setCurrentView(nextScenario.sceneId);
          setCurrentScene(nextScenario.sceneId);
        }
        if (e.key === "ArrowLeft") {
          if (currentIdx > 0) {
            const prevScenario = activeScenarios[currentIdx - 1];
            setCurrentView(prevScenario.sceneId);
            setCurrentScene(prevScenario.sceneId);
          } else {
            setCurrentView("hero");
            setCurrentScene(0);
          }
        }
        if (e.key === "Escape") {
          setCurrentView("hero");
          setCurrentScene(0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentView, setCurrentScene, activeScenarios]);

  const handleUnbundlingClick = () => {
    setCurrentView("unbundling");
  };

  const handleScenesClick = () => {
    // Navigate to first active scenario
    if (activeScenarios.length > 0) {
      const firstScenario = activeScenarios[0];
      setCurrentView(firstScenario.sceneId);
      setCurrentScene(firstScenario.sceneId);
    }
  };

  const handleBack = () => {
    setCurrentView("hero");
    setCurrentScene(0);
  };

  const handleScenePrev = () => {
    if (typeof currentView === "number") {
      const currentIdx = activeScenarios.findIndex((s) => s.sceneId === currentView);
      if (currentIdx > 0) {
        const prevScenario = activeScenarios[currentIdx - 1];
        setCurrentView(prevScenario.sceneId);
        setCurrentScene(prevScenario.sceneId);
      }
    }
  };

  const handleSceneNext = () => {
    if (typeof currentView === "number") {
      const currentIdx = activeScenarios.findIndex((s) => s.sceneId === currentView);
      if (currentIdx < activeScenarios.length - 1) {
        const nextScenario = activeScenarios[currentIdx + 1];
        setCurrentView(nextScenario.sceneId);
        setCurrentScene(nextScenario.sceneId);
      }
    }
  };

  // Convert ScenarioConfig to SceneData format
  const convertScenarioToSceneData = (scenario: ReturnType<typeof getScenarioBySceneId>): SceneData | null => {
    if (!scenario) return null;
    
    return {
      id: scenario.sceneId,
      enabled: scenario.isVisible,
      jtbd: scenario.coverPageData.headline,
      name: scenario.internalName.replace(/^Scene \d+: /, ""), // Remove "Scene X: " prefix
      subtitle: scenario.coverPageData.subHeadline,
      sceneTag: scenario.coverPageData.headerLine,
      commission: 0,
      quotaPct: 0,
      bundled: scenario.coverPageData.bundled,
      unbundled: scenario.coverPageData.unbundled,
      metrics: scenario.coverPageData.metrics,
      pipeline: scenario.coverPageData.pipeline,
      protoUrl: null,
      image: scenario.coverPageData.bgImage || null,
      prototypeComponent: scenario.prototypeComponent,
    };
  };

  // Get current scene data - prioritize scenario config over SCENES to ensure correct images
  const currentSceneData = useMemo(() => {
    if (typeof currentView !== "number") return null;
    
    // First, check if there's a scenario config for this sceneId (prioritizes scenario config)
    const scenario = getScenarioBySceneId(currentView);
    if (scenario) {
      return convertScenarioToSceneData(scenario);
    }
    
    // Fallback to SCENES array if no scenario config exists
    const sceneFromScenes = SCENES.find((s) => s.id === currentView);
    if (sceneFromScenes) return sceneFromScenes;
    
    return null;
  }, [currentView, getScenarioBySceneId]);

  const currentIdx =
    typeof currentView === "number"
      ? activeScenarios.findIndex((s) => s.sceneId === currentView)
      : -1;

  return (
    <DemoDataProvider>
      <div
        className="relative w-full flex-1 overflow-hidden"
        style={{
          isolation: "isolate",
          backgroundColor: currentView === "hero" ? "#0047FF" : "var(--bg, #060608)",
          color: "var(--text, #ECEBF5)",
        }}
      >
        {/* Content area - naturally flows below fixed header */}
        <div className="relative w-full h-full" style={{ overflow: "hidden" }}>
          {currentView === "hero" && (
            <Hero onUnbundlingClick={handleUnbundlingClick} onScenesClick={handleScenesClick} />
          )}
          {currentView === "unbundling" && (
            <Unbundling onScenesClick={handleScenesClick} onBack={handleBack} />
          )}
          {typeof currentView === "number" && activeScenarios.length === 0 && (
            <div className="text-white p-8">No Arcs mapped to this Narrative yet.</div>
          )}
          {typeof currentView === "number" && activeScenarios.length > 0 && currentSceneData && (
            <SceneLayout
              scene={currentSceneData}
              onBack={handleBack}
              onPrev={currentIdx > 0 ? handleScenePrev : undefined}
              onNext={currentIdx < activeScenarios.length - 1 ? handleSceneNext : undefined}
            />
          )}
        </div>
      </div>
    </DemoDataProvider>
  );
}
