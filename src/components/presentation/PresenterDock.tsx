"use client";

import { useState, useEffect } from "react";
import { SCENES, type SceneData } from "@/lib/presentation-data";

interface PresenterDockProps {
  currentScene: number;
  onSceneChange: (scene: number) => void;
}

export function PresenterDock({ currentScene, onSceneChange }: PresenterDockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredScene, setHoveredScene] = useState<SceneData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<number>(0);

  const enabledScenes = SCENES.filter((s) => s.enabled && !s.isHero);
  const currentSceneData = SCENES.find((s) => s.id === currentScene);

  return (
    <>
      {/* Invisible trigger zone at top - only active when header is hidden */}
      {!isHovered && (
        <div 
          onMouseEnter={() => setIsHovered(true)} 
          className="fixed top-0 left-0 w-full h-10 z-[9997] pointer-events-auto"
        />
      )}

      {/* Hover-activated header */}
      <header
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed top-0 left-0 w-full h-14 bg-[#040A14]/80 backdrop-blur-xl border-b border-white/10 z-[9999] flex items-center justify-between px-8"
        style={{
          transform: isHovered ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isHovered ? 1 : 0,
          pointerEvents: isHovered ? 'auto' : 'none',
          transition: 'transform 500ms ease-in-out, opacity 500ms ease-in-out',
        }}
      >
        {/* Left Side: Branding/Scene Info */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <img src="/slackbot-logo.svg" alt="SlackbotPro" className="w-6 h-6 flex-shrink-0" />
          <span className="text-[10px] tracking-[0.2em] text-gray-500 uppercase font-medium whitespace-nowrap">
            SlackbotPro <span className="mx-2 text-white/20">|</span> {currentSceneData?.sceneTag || `Scene ${currentScene}`}
          </span>
        </div>

        {/* Center: The Scene Switcher Numbers */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5 flex-shrink-0">
          <button
            type="button"
            onClick={() => onSceneChange(0)}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const navContainer = e.currentTarget.closest('nav') as HTMLElement;
              if (navContainer) {
                const navRect = navContainer.getBoundingClientRect();
                setTooltipPosition(rect.left + rect.width / 2 - navRect.left);
              }
              setHoveredScene(SCENES.find((s) => s.id === 0) || null);
            }}
            onMouseLeave={() => setHoveredScene(null)}
            className={`w-8 h-8 rounded-full text-xs transition-colors select-none outline-none flex items-center justify-center flex-shrink-0 ${
              currentScene === 0 ? 'bg-white text-black font-bold' : 'text-gray-500 hover:text-white'
            }`}
          >
            ★
          </button>
          {enabledScenes.map((scene) => (
            <button
              key={scene.id}
              type="button"
              onClick={() => onSceneChange(scene.id)}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const navContainer = e.currentTarget.closest('nav') as HTMLElement;
                if (navContainer) {
                  const navRect = navContainer.getBoundingClientRect();
                  setTooltipPosition(rect.left + rect.width / 2 - navRect.left);
                }
                setHoveredScene(scene);
              }}
              onMouseLeave={() => setHoveredScene(null)}
              className={`w-8 h-8 rounded-full text-xs transition-colors select-none outline-none flex items-center justify-center flex-shrink-0 ${
                currentScene === scene.id ? 'bg-white text-black font-bold' : 'text-gray-500 hover:text-white'
              }`}
            >
              {scene.id}
            </button>
          ))}

          {/* Tooltip - Dark mode for readability */}
          {hoveredScene && (
            <div 
              className="absolute top-14 mt-2 bg-[#111] border border-white/10 rounded-xl p-3 shadow-2xl w-64 text-center pointer-events-none"
              style={{
                left: `${tooltipPosition}px`,
                transform: "translateX(-50%)",
                opacity: hoveredScene ? 1 : 0,
                transition: "opacity 0.17s ease",
              }}
            >
              <div className="font-mono text-[8px] tracking-[0.14em] uppercase mb-1 text-emerald-400">
                {hoveredScene.jtbd}
              </div>
              <div className="font-serif text-[14px] font-bold mb-1 text-white">
                {hoveredScene.name}
              </div>
              {hoveredScene.surface && (
                <div className="font-mono text-[8.5px] text-gray-300">
                  {hoveredScene.surfaceIcon || ""} {hoveredScene.surface}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Right Side: Back to Intro */}
        <button 
          onClick={() => onSceneChange(0)} 
          className="text-[10px] tracking-widest text-gray-400 hover:text-white uppercase font-bold transition-colors select-none outline-none flex-shrink-0 whitespace-nowrap"
        >
          Exit to Intro
        </button>
      </header>
    </>
  );
}
