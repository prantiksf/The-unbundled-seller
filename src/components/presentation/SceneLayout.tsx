"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { SceneData, SCENES } from "@/lib/presentation-data";
import { SlackAppShellWrapper } from "./SlackAppShellWrapper";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { resetQuotaTrackerMemory } from "./QuotaTracker";
import { resetAnimatedCounterMemory } from "./AnimatedCounter";
import { resetPulseDataCardMemory } from "./scenes/PulseDataCard";
import { resetDealVelocityCardMemory } from "./scenes/DealVelocityCard";
import { resetPipelineHealthCardMemory } from "./scenes/PipelineHealthCard";
import { resetWinRateCardMemory } from "./scenes/WinRateCard";
import { resetConfirmationMemory } from "./scenes/Arc1AgentforcePanel";
import { usePrototypeMode } from "@/context/PrototypeModeContext";
import { usePresentationScene } from "@/context/PresentationSceneContext";
import { useArcNavigation } from "@/context/ArcNavigationContext";
import { useScenarioVisibility } from "@/context/ScenarioVisibilityContext";
import { ExecReadyLayout } from "./ExecReadyLayout";
import { getMetadataForScene, getNarrativeArcFromSceneId } from "@/config/demoMetadata";

interface SceneLayoutProps {
  scene: SceneData;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

// Map scene IDs to arc numbers (scenes 1-10 map to arcs 1-10)
const SCENE_TO_ARC: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11, // Mobile Pulse maps to Arc 11
  12: 12, // Watch Win maps to Arc 12
  13: 10, // Multiple scenes can map to same arc
};

// Map arc numbers to first scene ID in that arc
const ARC_TO_SCENE: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
};

export function SceneLayout({ scene, onBack, onPrev, onNext }: SceneLayoutProps) {
  const [showProto, setShowProto] = useState(false);
  const [protoMountReady, setProtoMountReady] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageKey, setImageKey] = useState<string>('');
  const { isPrototypeMode, setIsPrototypeMode } = usePrototypeMode();
  const {
    activeScenarios,
    getScenarioBySceneId,
    presentationDensity,
  } = useScenarioVisibility();

  // Defer prototype content until after browser has laid out the fixed prototype zone — fixes wrong layout on first "Enter scenario" click
  useLayoutEffect(() => {
    if (showProto) {
      // Double RAF ensures the fixed prototype zone container has been positioned and sized by the browser before mounting DesktopSlackShell
      let rafId2: number;
      const rafId1 = requestAnimationFrame(() => {
        rafId2 = requestAnimationFrame(() => {
          setProtoMountReady(true);
        });
      });
      // Fallback: ensure content mounts even if RAF is delayed
      const timeoutId = setTimeout(() => {
        setProtoMountReady(true);
      }, 200);
      return () => {
        cancelAnimationFrame(rafId1);
        if (rafId2) cancelAnimationFrame(rafId2);
        clearTimeout(timeoutId);
      };
    } else {
      setProtoMountReady(false);
    }
  }, [showProto]);
  const router = useRouter();
  const pathname = usePathname();
  const { currentScene, setCurrentScene } = usePresentationScene();
  const arcNavigation = useArcNavigation();

  // Get current arc from scene
  const currentArc = SCENE_TO_ARC[scene.id] || 1;

  const handleSceneChange = (scene: number) => {
    setCurrentScene(scene);
    // Navigate to root page if not already there, so TheStage can render the scene
    if (pathname !== "/") {
      router.replace("/");
    }
  };

  const handleArcChange = (arc: number, screen?: number) => {
    // Fade out
    setContentOpacity(0);
    setTimeout(() => {
      // Change to the first scene of the target arc
      const targetScene = ARC_TO_SCENE[arc] || arc;
      setCurrentScene(targetScene);
      arcNavigation.setArc(arc, screen || 1);
      // Fade in
      setTimeout(() => {
        setContentOpacity(1);
      }, 50);
    }, 150);
  };

  const handleRestartArc = () => {
    // Trigger fade animation first
    setContentOpacity(0.6);
    setTimeout(() => {
      arcNavigation.restartArc();
      setContentOpacity(1);
    }, 200);
  };

  const handleNextScreen = () => {
    arcNavigation.nextScreen();
  };

  useEffect(() => {
    // Reset prototype visibility when scene changes
    setShowProto(false);
    setIsPrototypeMode(false);
  }, [scene.id, setIsPrototypeMode]);

  // Sync local showProto state with global isPrototypeMode context
  // This ensures clicking numbers in nav properly closes prototype
  useEffect(() => {
    if (!isPrototypeMode && showProto) {
      setShowProto(false);
    }
  }, [isPrototypeMode, showProto]);

  useEffect(() => {
    // Update prototype mode context when showProto changes
    setIsPrototypeMode(showProto);
    // Reset opacity when entering prototype mode to ensure content is visible
    if (showProto) {
      setContentOpacity(1);
    }
  }, [showProto, setIsPrototypeMode]);
  
  // Reset memory vaults when starting scenarios (Scene 1) - run when Scene 1 becomes active
  useEffect(() => {
    if (scene.id === 1) {
      resetQuotaTrackerMemory();
      resetAnimatedCounterMemory();
      resetPulseDataCardMemory();
      resetDealVelocityCardMemory();
      resetPipelineHealthCardMemory();
      resetWinRateCardMemory();
      resetConfirmationMemory();
    }
  }, [scene.id]); // Reset whenever Scene 1 becomes active

  // Component registry (supports historical version keys).
  const PROTOTYPE_COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
    "Scene1": Scene1,
    "Scene2": Scene2,
    "DesktopSlackShell": SlackAppShellWrapper,
    "SlackMyDay_V1": Scene1,
    "SlackMyDay_V2": Scene1,
    "WatchWin_V1": Scene2,
    "WatchWin_V2": Scene2,
    "AutoClose_V1": SlackAppShellWrapper,
    "AutoClose_V2": SlackAppShellWrapper,
    "DesktopRecovery_V1": SlackAppShellWrapper,
    "DesktopRecovery_V2": SlackAppShellWrapper,
  } as const;

  const hasPrototypeFromConfig = Boolean(
    scene.prototypeComponent && PROTOTYPE_COMPONENT_MAP[scene.prototypeComponent]
  );
  const hasPrototypeFromLegacy = Boolean(scene.protoUrl || [1, 2, 3, 4, 6].includes(scene.id));

  const renderComponentByKey = (componentKey: string) => {
    const Component = PROTOTYPE_COMPONENT_MAP[componentKey];
    
    // Get metadata for this scene to inject arc-specific payload
    const { arc: activeArcMeta } = getMetadataForScene(scene.id);
    
    if (Component) {
      // Narrative 2 routing: sceneId 201 (N2A1) uses SlackAppShellWrapper with onboarding, sceneId 202 uses legacy SlackConceptArc1
      if (componentKey.includes("Scene1") || componentKey === "SlackMyDay_V1" || componentKey === "SlackMyDay_V2") {
        // SceneId 201 = NEW N2A1 (uses SlackAppShellWrapper with onboarding payload)
        if (scene.id === 201) {
          // NEW Arc 1: Use SlackAppShellWrapper with onboarding payload
          const payload = activeArcMeta?.payload || { defaultNavId: 'today' as const, sidebarDms: [] };
          return <SlackAppShellWrapper defaultNav="today" hideHeader={false} arcPayload={payload} />;
        } else if (scene.id === 202) {
          // RESTORED LEGACY STORY: Now living in Arc 2 (Scene 202)
          // Render Scene1 which wraps SlackConceptArc1
          return <Scene1 onNext={() => {}} skipNarrative={true} />;
        } else if (scene.id >= 203 && scene.id <= 206) {
          // N2A3-N2A6: Use generic SlackAppShellWrapper with arc payload
          // Ensure we always have a valid payload, fallback to default if metadata lookup fails
          const payload = activeArcMeta?.payload || { defaultNavId: 'today' as const, sidebarDms: [] };
          return <SlackAppShellWrapper defaultNav="today" hideHeader={false} arcPayload={payload} />;
        }
        // Fallback for other Scene1 scenarios (e.g., sceneId 1) - use old Scene1 component
        return <Scene1 onNext={() => {}} skipNarrative={true} />;
      }
      if (componentKey.includes("Scene2") || componentKey === "WatchWin_V1" || componentKey === "WatchWin_V2") {
        return <Scene2 onNext={() => {}} sceneId={scene.id} />;
      }
      if (
        componentKey.includes("DesktopSlackShell") ||
        componentKey === "AutoClose_V1" ||
        componentKey === "AutoClose_V2" ||
        componentKey === "DesktopRecovery_V1" ||
        componentKey === "DesktopRecovery_V2"
      ) {
        // Use generic SlackAppShellWrapper with arc payload
        return <SlackAppShellWrapper defaultNav="today" hideHeader={false} arcPayload={activeArcMeta?.payload} />;
      }
      return <Component />;
    }
    return null;
  };

  // Determine which shell to render based on prototypeComponent from scenario config
  const renderProtoZone = () => {
    // First, try to use prototypeComponent from scenario config
    if (scene.prototypeComponent) {
      const rendered = renderComponentByKey(scene.prototypeComponent);
      if (rendered) {
        return rendered;
      }
    }

    // Fallback: Legacy mapping by scene ID for scenes without prototypeComponent
    const LEGACY_PROTOTYPE_MAP: Record<number, React.ComponentType<any>> = {
      1: Scene1,
      2: SlackAppShellWrapper,
      3: Scene2,
      4: Scene2,
      6: SlackAppShellWrapper,
    } as const;
    
    // Get metadata for this scene to inject arc-specific payload
    const { arc: activeArcMeta } = getMetadataForScene(scene.id);
    
    const LegacyComponent = LEGACY_PROTOTYPE_MAP[scene.id];
    if (LegacyComponent) {
      if (scene.id === 1) {
        return <Scene1 onNext={() => {}} skipNarrative={true} />;
      }
      if ([2, 6].includes(scene.id)) {
        return <SlackAppShellWrapper defaultNav="today" hideHeader={false} arcPayload={activeArcMeta?.payload} />;
      }
      if ([3, 4].includes(scene.id)) {
        return <Scene2 onNext={() => {}} sceneId={scene.id} />;
      }
    }

    // Other scenes: iframe or placeholder
    if (scene.protoUrl) {
      return <iframe src={scene.protoUrl} className="w-full h-full border-none" allowFullScreen />;
    }

    return (
      <div className="text-black text-center p-8">
        <p className="text-lg">Prototype for Scene {scene.id} coming soon.</p>
      </div>
    );
  };

  // Get metadata for presentation overrides and dynamic image path
  const { narrative: activeNarrativeMeta, arc: activeArcMeta } = getMetadataForScene(scene.id);
  const overrides = activeArcMeta?.payload?.presentationOverrides;
  const arcPayload = activeArcMeta?.payload;
  
  // Compute dynamic cover image path: e.g., /N1A1.png, /N2A1.png (directly in public folder)
  // Use direct scene ID mapping as primary source for image path (more reliable)
  // Compute values for current scene (always use current scene.id, not stale state)
  const narrativeArc = getNarrativeArcFromSceneId(scene.id);
  const nValue = narrativeArc?.narrative || '1';
  const aValue = narrativeArc?.arc || '1';
  
  // Initialize and update image src when scene changes
  useEffect(() => {
    const narrativeArc = getNarrativeArcFromSceneId(scene.id);
    if (!narrativeArc) {
      console.error(`[SceneLayout] No mapping found for scene ID: ${scene.id}`);
      return;
    }
    
    const nValue = narrativeArc.narrative;
    const aValue = narrativeArc.arc;
    
    // Add cache-busting query parameter to ensure images reload when scene changes
    const timestamp = Date.now();
    const newImagePath = `/N${nValue}A${aValue}.png?scene=${scene.id}&t=${timestamp}`;
    const newImageKey = `img-${scene.id}-${nValue}-${aValue}-${timestamp}`;
    
    
    
    setImageSrc(newImagePath);
    setImageKey(newImageKey);
  }, [scene.id]);
  
  // CRITICAL FIX: Always compute currentImageSrc from current scene.id, not stale imageSrc state
  // Check if imageSrc matches current scene, if not use computed path immediately
  const expectedPath = `/N${nValue}A${aValue}.png`;
  const imageSrcMatchesScene = imageSrc && imageSrc.includes(`N${nValue}A${aValue}.png`);
  const timestamp = Date.now();
  const currentImageSrc = imageSrcMatchesScene ? imageSrc : `${expectedPath}?scene=${scene.id}&t=${timestamp}`;
  const imgSrc = currentImageSrc;
  
  // CRITICAL FIX: Also update imageKey immediately when scene doesn't match, not just in useEffect
  // This forces React to remount the <img> element, preventing browser caching
  const currentImageKey = imageSrcMatchesScene ? imageKey : `img-${scene.id}-${nValue}-${aValue}-${timestamp}`;
  
  
  
  // Compute fallback path: For N2 arcs 2-6, fallback to N2A1 if image doesn't exist
  const fallbackImagePath = (nValue === '2' && aValue !== '1') ? `/N2A1.png?scene=${scene.id}&t=${Date.now()}` : null;

  // Conditional rendering: Exec Ready density uses dark, metrics-focused layout
  if (presentationDensity === "exec-ready") {
    return <ExecReadyLayout scene={scene} onBack={onBack} onPrev={onPrev} onNext={onNext} />;
  }

  return (
    <div className="sp fixed z-[200] overflow-hidden" style={{ background: "var(--bg)", animation: showProto ? undefined : "pageIn 0.4s ease both", top: "var(--header-height, 40px)", left: 0, right: 0, width: "100vw", minWidth: "100%", height: "calc(100vh - var(--header-height, 40px))", pointerEvents: showProto ? 'none' : 'auto' }}>
      {!showProto && (
        <div className="relative w-full h-screen overflow-hidden bg-[#F4F7FA] font-sans text-gray-900">
          {/* 1. CINEMATIC BACKGROUND IMAGE */}
          <div className="absolute top-0 left-0 w-full md:w-[70%] h-full z-0">
            <img 
              key={currentImageKey}
              src={imgSrc} 
              alt={activeArcMeta?.title || "Arc Cover"}
              className="w-full h-full object-cover object-[center_20%]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/covers/default-cover.png";
              }}
            />
            {/* REFINED FADE: Pushed the transparency to 60% so more of the image is completely visible, with a sharper fade at the edge */}
            <div 
              className="absolute inset-0" 
              style={{ background: "linear-gradient(to right, transparent 0%, transparent 60%, rgba(244,247,250, 0.9) 85%, #F4F7FA 100%)" }} 
            />
          </div>

          {/* 2. FOREGROUND CONTENT AREA */}
          <div className="relative z-10 w-full h-full flex justify-end">
            <div className="w-[55%] max-w-4xl h-full flex flex-col justify-center pl-10 pr-24 py-16 overflow-y-auto">
              
              {/* HEADER */}
              <div className="mb-10">
                <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-3">
                  ARC {activeArcMeta?.value || "1"} • DESKTOP
                </div>
                <h1 className="text-[56px] font-extrabold tracking-tight text-gray-900 mb-4 leading-tight">
                  {activeArcMeta?.title || "Arc Title"}
                </h1>
                <p className="text-[18px] text-gray-700 leading-relaxed max-w-xl">
                  {activeArcMeta?.description || "Arc description goes here."}
                </p>
              </div>

              {/* THE QUOTA SLIDER (Only shows for N1) */}
              {!arcPayload?.presentationOverrides?.hideQuotaSlider && (
                <div className="mb-10 max-w-2xl">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">QUOTA IMPACT</span>
                    <div className="text-right">
                      <span className="text-4xl font-black block leading-none">0%</span>
                      <span className="text-[13px] text-gray-500">$0 / $500,000</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full mb-3 flex overflow-hidden">
                     <div className="h-full bg-[#2BAC76] w-[15%]"></div>
                     <div className="h-full border-l border-white bg-blue-500 w-[5%]"></div>
                  </div>
                  <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-[#2BAC76]">● CLOSED</span>
                    <span className="text-blue-500">● IN PROGRESS</span>
                    <span className="text-gray-400">● NOT STARTED</span>
                    <span className="text-red-500">● LOST</span>
                  </div>
                </div>
              )}

              {/* STORY TEXT (N2 Stacked vs N1 Side-by-Side) */}
              {arcPayload?.presentationOverrides?.layoutStyle === "breakthrough" ? (
                /* N2: Friction vs Breakthrough Layout */
                <div className="flex flex-col gap-4 mb-10 max-w-2xl">
                   <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">{arcPayload.presentationOverrides.oldWorldTitle || "🔴 THE FRICTION"}</h3>
                     <p className="text-[14px] text-gray-800 leading-relaxed">{arcPayload.presentationOverrides.oldWorldText}</p>
                   </div>
                   <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 shadow-sm">
                     <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">{arcPayload.presentationOverrides.newWorldTitle || "🔵 THE BREAKTHROUGH"}</h3>
                     <p className="text-[14px] text-gray-800 leading-relaxed">{arcPayload.presentationOverrides.newWorldText}</p>
                   </div>
                </div>
              ) : (
                /* N1: Original Side-by-Side Layout */
                <div className="grid grid-cols-2 gap-10 mb-10 pt-6 border-t border-gray-200/60 max-w-3xl">
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-3">🔴 OLD WORLD</h3>
                    <p className="text-[14px] text-gray-800 leading-relaxed">
                      Rita logs into Salesforce, opens a forecast spreadsheet, tabs between Clari, her manager's template, and last quarter's actuals. 3.2 hours of political alignment before she submits a number she doesn't fully believe in.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-3">🔵 WITH INTELLIGENCE</h3>
                    <p className="text-[14px] text-gray-800 leading-relaxed">
                      Slack opens. @slackbot has modelled three scenarios overnight. Rita drags a slider. The machine's workload grows. Her hours stay flat. She approves $600K in 4 minutes and believes it for the first time.
                    </p>
                  </div>
                </div>
              )}

              {/* METRICS GRID */}
              <div className="mb-10 pt-6 border-t border-gray-200/60 max-w-3xl">
                {arcPayload?.presentationOverrides?.heroMetric ? (
                  /* N2 Exec Ready Metric */
                  <div className="mt-2">
                    <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                      {arcPayload.presentationOverrides.heroMetric.label}
                    </h3>
                    <div className="flex items-center gap-6 text-[64px] font-black tracking-tighter">
                      <span className="text-gray-400 line-through decoration-red-400/60 decoration-4">
                        {arcPayload.presentationOverrides.heroMetric.old}
                      </span>
                      <span className="text-gray-300 text-5xl font-light pb-2">→</span>
                      <span className="text-[#0055FF]">
                        {arcPayload.presentationOverrides.heroMetric.new}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* N1 Original 2x2 Grid */
                  <div className="grid grid-cols-2 gap-y-10 gap-x-10 mt-2">
                    <div>
                      <h2 className="text-[52px] font-black text-[#FF4545] leading-none mb-2">{arcPayload?.presentationOverrides?.metricsGrid?.topLeft?.value || "3.2 hrs"}</h2>
                      <p className="text-[11px] font-bold tracking-widest text-gray-700 uppercase">{arcPayload?.presentationOverrides?.metricsGrid?.topLeft?.label || "LOST TO QUARTERLY PLANNING"}</p>
                    </div>
                    <div>
                      <h2 className="text-[52px] font-black text-[#0055FF] leading-none mb-2">{arcPayload?.presentationOverrides?.metricsGrid?.topRight?.value || "4 min"}</h2>
                      <p className="text-[11px] font-bold tracking-widest text-gray-700 uppercase">{arcPayload?.presentationOverrides?.metricsGrid?.topRight?.label || "TO APPROVE WITH INTELLIGENCE"}</p>
                    </div>
                    <div>
                      <h2 className="text-[52px] font-black text-[#FF4545] leading-none mb-2">{arcPayload?.presentationOverrides?.metricsGrid?.bottomLeft?.value || "67%"}</h2>
                      <p className="text-[11px] font-bold tracking-widest text-gray-700 uppercase">{arcPayload?.presentationOverrides?.metricsGrid?.bottomLeft?.label || "OF AES SANDBAG THEIR COMMIT"}</p>
                    </div>
                    <div>
                      <h2 className="text-[52px] font-black text-[#0055FF] leading-none mb-2">{arcPayload?.presentationOverrides?.metricsGrid?.bottomRight?.value || "$600K"}</h2>
                      <p className="text-[11px] font-bold tracking-widest text-gray-700 uppercase">{arcPayload?.presentationOverrides?.metricsGrid?.bottomRight?.label || "RITA'S PLAN — BELIEVED"}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER ACTION */}
              <div className="mt-auto flex items-center justify-between max-w-3xl">
                <button 
                  onClick={onNext}
                  className="px-8 py-3.5 bg-[#0055FF] text-white rounded-lg text-[14px] font-bold shadow-md hover:bg-blue-700 transition-all flex items-center gap-3"
                >
                  Enter Prototype <span className="text-xl leading-none font-normal pb-0.5">→</span>
                </button>
                <div className="flex items-center gap-4 text-blue-500">
                   <span className="text-[10px] font-bold tracking-widest uppercase">SCENE 1 / 6</span>
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">→</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Proto zone - positioned independently below global header, same as "sp" div, so layout is stable from first frame */}
      {showProto && (
        <div
          data-prototype-content
          className="prototype-screen fixed flex flex-col overflow-hidden transition-opacity duration-300"
          style={{
            opacity: contentOpacity,
            zIndex: 9999,
            top: 'var(--header-height, 40px)',
            left: 0,
            right: 0,
            height: 'calc(100vh - var(--header-height, 40px))',
            width: '100%',
            backgroundColor: 'var(--bg, #060608)',
            pointerEvents: 'auto',
          }}
        >
          <div className="w-full h-full flex flex-col min-h-0" style={{ height: '100%', opacity: protoMountReady ? 1 : 0.5 }}>
            {protoMountReady ? renderProtoZone() : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg, #060608)' }}>
                <p className="text-white text-lg">Loading prototype...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
