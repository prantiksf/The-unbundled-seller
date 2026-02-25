"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import React from "react";
import { SceneData } from "@/lib/presentation-data";
import { DesktopSlackShell } from "./DesktopSlackShell";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { usePrototypeMode } from "@/context/PrototypeModeContext";
import { useScenarioVisibility } from "@/context/ScenarioVisibilityContext";

interface ExecReadyLayoutProps {
  scene: SceneData;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function ExecReadyLayout({ scene, onBack, onPrev, onNext }: ExecReadyLayoutProps) {
  const [showProto, setShowProto] = useState(false);
  const [protoMountReady, setProtoMountReady] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);
  const { isPrototypeMode, setIsPrototypeMode } = usePrototypeMode();
  const { activeScenarios, getScenarioBySceneId } = useScenarioVisibility();

  // Defer prototype content until after browser has laid out the fixed prototype zone
  useLayoutEffect(() => {
    if (showProto) {
      let rafId2: number;
      const rafId1 = requestAnimationFrame(() => {
        rafId2 = requestAnimationFrame(() => {
          setProtoMountReady(true);
        });
      });
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

  useEffect(() => {
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
    setIsPrototypeMode(showProto);
    if (showProto) {
      setContentOpacity(1);
    }
  }, [showProto, setIsPrototypeMode]);

  // Component registry
  const PROTOTYPE_COMPONENT_MAP: Record<string, React.ComponentType> = {
    "Scene1": Scene1,
    "Scene2": Scene2,
    "DesktopSlackShell": DesktopSlackShell,
    "SlackMyDay_V1": Scene1,
    "SlackMyDay_V2": Scene1,
    "WatchWin_V1": Scene2,
    "WatchWin_V2": Scene2,
    "AutoClose_V1": DesktopSlackShell,
    "AutoClose_V2": DesktopSlackShell,
    "DesktopRecovery_V1": DesktopSlackShell,
    "DesktopRecovery_V2": DesktopSlackShell,
  } as const;

  const hasPrototypeFromConfig = Boolean(
    scene.prototypeComponent && PROTOTYPE_COMPONENT_MAP[scene.prototypeComponent]
  );
  const hasPrototypeFromLegacy = Boolean(scene.protoUrl || [1, 2, 3, 4, 6].includes(scene.id));

  const renderComponentByKey = (componentKey: string) => {
    const Component = PROTOTYPE_COMPONENT_MAP[componentKey];
    if (Component) {
      if (componentKey.includes("Scene1") || componentKey === "SlackMyDay_V1" || componentKey === "SlackMyDay_V2") {
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
        return <DesktopSlackShell defaultNav="dms" defaultChannelId="slackbot" hideHeader={false} />;
      }
      return <Component />;
    }
    return null;
  };

  const renderProtoZone = () => {
    if (scene.prototypeComponent) {
      const rendered = renderComponentByKey(scene.prototypeComponent);
      if (rendered) {
        return rendered;
      }
    }

    const LEGACY_PROTOTYPE_MAP: Record<number, React.ComponentType> = {
      1: Scene1,
      2: DesktopSlackShell,
      3: Scene2,
      4: Scene2,
      6: DesktopSlackShell,
    } as const;
    
    const LegacyComponent = LEGACY_PROTOTYPE_MAP[scene.id];
    if (LegacyComponent) {
      if (scene.id === 1) {
        return <Scene1 onNext={() => {}} skipNarrative={true} />;
      }
      if ([2, 6].includes(scene.id)) {
        return <DesktopSlackShell defaultNav="dms" defaultChannelId="slackbot" hideHeader={false} />;
      }
      if ([3, 4].includes(scene.id)) {
        return <Scene2 onNext={() => {}} sceneId={scene.id} />;
      }
    }

    if (scene.protoUrl) {
      return <iframe src={scene.protoUrl} className="w-full h-full border-none" allowFullScreen />;
    }

    return (
      <div className="text-white text-center p-8">
        <p className="text-lg">Prototype for Scene {scene.id} coming soon.</p>
      </div>
    );
  };

  // Extract metrics for transformation block
  const painMetrics = scene.metrics?.filter(m => m.cls === 'fric-v') || [];
  const gainMetrics = scene.metrics?.filter(m => m.cls !== 'fric-v') || [];
  
  // Get current arc index for cinematic counter
  const currentScenario = getScenarioBySceneId(scene.id);
  const currentIndex = currentScenario ? activeScenarios.findIndex(s => s.id === currentScenario.id) : -1;
  const arcNumber = currentIndex >= 0 ? currentIndex + 1 : scene.id;
  
  // Extract device type from scenario config
  const deviceType = currentScenario?.device || 'Desktop';
  
  // Extract old vs new world metrics
  const oldWorldMetric = painMetrics[0]?.val || '3.2 hrs';
  const newWorldMetric = gainMetrics[0]?.val || '4 min';
  
  // Calculate pipeline percentages for ultra-thin bar
  const pipeline = scene.pipeline;
  const totalPipeline = pipeline ? pipeline.closed + pipeline.inProgress + pipeline.notStarted + pipeline.lost : 0;
  const closedPct = pipeline && totalPipeline > 0 ? (pipeline.closed / totalPipeline) * 100 : 10;
  const inProgressPct = pipeline && totalPipeline > 0 ? (pipeline.inProgress / totalPipeline) * 100 : 40;
  const notStartedPct = pipeline && totalPipeline > 0 ? (pipeline.notStarted / totalPipeline) * 100 : 40;
  const lostPct = pipeline && totalPipeline > 0 ? (pipeline.lost / totalPipeline) * 100 : 10;

  return (
    <div className="sp fixed z-[200] overflow-hidden" style={{ background: "#0a0a0a", animation: showProto ? undefined : "pageIn 0.4s ease both", top: "var(--header-height, 40px)", left: 0, right: 0, width: "100vw", minWidth: "100%", height: "calc(100vh - var(--header-height, 40px))", pointerEvents: showProto ? 'none' : 'auto' }}>
      {!showProto && (
        <div className="relative w-full h-screen overflow-hidden flex items-end bg-[#0a0a0a] text-white">
          {/* 1. Full Bleed Background & Gradients */}
          <div className="absolute inset-0 z-0">
            {scene.image ? (
              <img
                key={scene.image}
                src={scene.image.replace(/ /g, '%20')}
                alt={`Scene ${scene.id} - ${scene.name || ''}`}
                className="w-full h-full object-cover"
                style={{ 
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  console.error('[ExecReadyLayout] Image failed to load:', {
                    sceneId: scene.id,
                    sceneName: scene.name,
                    imagePath: scene.image,
                    encodedPath: scene.image.replace(/ /g, '%20')
                  });
                  img.style.display = "none";
                  if (img.parentElement) {
                    img.parentElement.style.background = "#0a0a0a";
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-[#0a0a0a]" />
            )}
            {/* Bottom gradient (darkest at bottom for text legibility) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
            {/* Left gradient (darkest on left for text legibility) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
          </div>

          {/* 2. Content Overlay - Bottom Aligned */}
          <div className="relative z-20 w-full px-12 pb-16 md:px-20 md:pb-24 items-end">
            
            {/* Left Column: Narrative & Metrics */}
            <div className="w-auto">
              {/* Eyebrow */}
              <div className="flex items-center gap-4 mb-4 text-xs tracking-[0.2em] text-white/50 uppercase">
                <span>Arc {arcNumber}</span>
                <span className="px-3 py-1 border border-white/20 rounded-full text-[10px]">{deviceType}</span>
              </div>

              {/* Headline */}
              <h2 className="text-5xl md:text-6xl font-medium leading-[1.1] tracking-tight text-white mb-4 max-w-4xl" style={{ fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif" }}>
                {scene.jtbd || scene.name}
              </h2>
              
              <p className="text-lg font-light text-white/60 mb-10 w-auto leading-relaxed">
                {scene.subtitle || scene.name || 'The transformation begins.'}
              </p>

              {/* Cinematic Metrics: Old -> New */}
              <div className="flex items-baseline gap-6 mb-8">
                <span className="text-3xl md:text-4xl font-normal text-white/30 line-through decoration-red-500/50 decoration-2">
                  {oldWorldMetric}
                </span>
                <span className="text-white/20 text-2xl font-light">→</span>
                <span className="text-4xl md:text-5xl font-semibold text-white" style={{ fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif" }}>
                  {newWorldMetric}
                </span>
              </div>


              {/* CTA */}
              <div className="flex items-center gap-4">
                {hasPrototypeFromConfig || hasPrototypeFromLegacy ? (
                  <button
                    className="flex items-center justify-center gap-3 px-8 py-3 bg-white/10 border border-white/20 backdrop-blur-md rounded-full text-sm hover:bg-white/20 transition-all w-[250px]"
                    onClick={() => {
                      setShowProto(true);
                      setIsPrototypeMode(true);
                    }}
                  >
                    Enter Prototype
                    <span>→</span>
                  </button>
                ) : (
                  <button
                    className="flex items-center justify-center gap-3 px-8 py-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-sm text-white/40 cursor-default w-[250px]"
                    disabled
                  >
                    Prototype Coming
                    <span>→</span>
                  </button>
                )}
                
                {/* Navigation Controls */}
                <div className="flex items-center gap-2">
                  {/* Always render back arrow, but disable on first screen */}
                  <button
                    onClick={onPrev || undefined}
                    disabled={!onPrev}
                    className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-white/10 enabled:hover:text-white enabled:text-white/60"
                    aria-label="Previous scene"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  {onNext && (
                    <button
                      onClick={onNext}
                      className="w-10 h-10 rounded-full border border-white/20 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center"
                      aria-label="Next scene"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Proto zone */}
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
