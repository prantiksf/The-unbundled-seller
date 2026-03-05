"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePresentationScene } from "@/context/PresentationSceneContext";
import { usePrototypeMode } from "@/context/PrototypeModeContext";
import { useArcNavigation } from "@/context/ArcNavigationContext";
import { useScenarioVisibility } from "@/context/ScenarioVisibilityContext";
import { SCENES } from "@/lib/presentation-data";
import { useRouter } from "next/navigation";
import { IconHome, IconSettings } from "@/components/icons";
import { Monitor, Smartphone, Watch, X, ChevronDown, Check, Link as LinkIcon, Copy } from "lucide-react";
import { createPortal } from "react-dom";
import { resetQuotaTrackerMemory } from "./QuotaTracker";
import { resetAnimatedCounterMemory } from "./AnimatedCounter";
import { resetPulseDataCardMemory } from "./scenes/PulseDataCard";
import { resetDealVelocityCardMemory } from "./scenes/DealVelocityCard";
import { resetPipelineHealthCardMemory } from "./scenes/PipelineHealthCard";
import { resetWinRateCardMemory } from "./scenes/WinRateCard";
import { resetConfirmationMemory } from "./scenes/Arc1AgentforcePanel";

// Arc names mapping (1-10) - Tooltip text
const ARC_TOOLTIPS: Record<number, string> = {
  1: "Start the quarter on your terms",
  2: "A deal dies. The machine hunts overnight.",
  3: "The deal was cooling. She called from the street.",
  4: "Work naturally. Intelligence follows.",
  5: "The deal closed while she was at lunch.",
  6: "The system told her to stop. She listened.",
  7: "Three decisions. Nine minutes. Her call.",
  8: "Five surfaces. Zero CRM navigations.",
  9: "Revenue up. Software time down.",
  10: "She was $47K short. She made the calls herself.",
};

// Arc names mapping (1-10) - Full names
const ARC_NAMES: Record<number, string> = {
  1: "The Quarterly Commit",
  2: "The Loss & The Night Shift",
  3: "The Sentiment Save",
  4: "Work naturally. Intelligence follows.",
  5: "The Silent Close",
  6: "The Capacity Brake",
  7: "Three decisions. Nine minutes. Her call.",
  8: "Five surfaces. Zero CRM navigations.",
  9: "Revenue up. Software time down.",
  10: "She was $47K short. She made the calls herself.",
};

// Map scene IDs to arc numbers (scenes 1-13 map to arcs 1-10)
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
  13: 10,
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

type HeaderContext = "home" | "scenario" | "prototype";

// Device icon mapping
const getDeviceIcon = (device: 'desktop' | 'mobile' | 'watch') => {
  switch (device) {
    case 'desktop':
      return Monitor;
    case 'mobile':
      return Smartphone;
    case 'watch':
      return Watch;
    default:
      return Monitor;
  }
};

export function GlobalNavigationHeader() {
  const { currentScene, setCurrentScene } = usePresentationScene();
  const { isPrototypeMode, setIsPrototypeMode } = usePrototypeMode();
  const arcNavigation = useArcNavigation();
  const {
    activeScenarios,
    currentNarrativeData,
    activeNarrative,
    setActiveNarrative,
    narrativeOptions,
    hiddenArcIds,
    toggleArcVisibility,
    presentationDensity,
    setPresentationDensity,
    defaultNarrative,
    setDefaultNarrative,
    reorderArcs,
  } = useScenarioVisibility();
  const router = useRouter();
  const [hoveredScenarioIndex, setHoveredScenarioIndex] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  // Custom Dropdown Component for precise positioning
  const CustomDropdown = ({ label, value, options, onChange }: { 
    label: string; 
    value: string; 
    options: {label: string, value: string}[]; 
    onChange: (val: string) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside (but not on modal overlay)
    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        
        // Only close if click is truly outside the dropdown AND not on the modal overlay
        const isModalOverlay = target?.closest('[class*="bg-black/55"]');
        const isInsideDropdown = dropdownRef.current?.contains(target);
        
        if (!isInsideDropdown && !isModalOverlay) {
          setIsOpen(false);
        }
      };

      // Use a delay to allow button click to register first, then attach listener
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside, true);
      }, 100); // Increased delay to ensure button click completes
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }, [isOpen, label]);

    const handleButtonClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent modal overlay from closing
      setIsOpen(!isOpen);
    };

    const selectedOption = options.find(o => o.value === value);
    const displayText = selectedOption?.label || value;

    return (
      <div ref={dropdownRef} className="relative">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
        <div className="relative">
          <button 
            type="button"
            onClick={handleButtonClick}
            onMouseDown={(e) => e.stopPropagation()} // Prevent modal overlay from closing
            className="w-full bg-[#0F172A] border border-white/20 rounded-lg pl-4 pr-10 py-3 text-sm text-left appearance-none outline-none focus:border-blue-500 transition-colors relative text-white"
          >
            {displayText}
            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* The Menu - Strictly anchored to the bottom */}
          {isOpen && (
            <div 
              className="absolute top-full left-0 right-0 mt-1 bg-[#0F172A] border border-white/20 rounded-lg shadow-xl z-[10020] overflow-hidden"
              style={{ position: 'absolute' }}
              onClick={(e) => {
                // Stop propagation to prevent modal overlay from closing
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                // Also stop mousedown to prevent click-outside handler from firing
                e.stopPropagation();
              }}
            >
              {options.map(opt => (
                <div 
                  key={opt.value}
                  onClick={(e) => { 
                    e.stopPropagation();
                    onChange(opt.value); 
                    setIsOpen(false); 
                  }}
                  className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                    value === opt.value 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {opt.label}
                  {value === opt.value && <Check className="w-4 h-4 text-white" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Handle Save and Close - updates URL, copies link, then closes panel
  const handleSaveAndClose = () => {
    // Update URL with current configuration
    const params = new URLSearchParams(window.location.search);
    params.set('n', localNarrative);
    params.set('style', localDensity);
    // Removed 'arcs' param since we removed the dropdown
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
    
    // Copy full URL to clipboard
    const fullUrl = `${window.location.origin}${newUrl}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setIsCopied(true);
      // Give the user 600ms to see the "Saved & Copied!" text before closing
      setTimeout(() => {
        setIsCopied(false);
        setIsSettingsOpen(false);
      }, 600);
    });
  };

  // URL parameter helpers
  const getUrlParam = (key: string, defaultVal: string) => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get(key) || defaultVal;
    }
    return defaultVal;
  };

  // Initialize state from URL params (only on mount)
  const [localNarrative, setLocalNarrative] = useState(() => getUrlParam('n', activeNarrative));
  const [localDensity, setLocalDensity] = useState(() => getUrlParam('style', presentationDensity));
  
  // Dropdown options - convert context narrativeOptions to dropdown format
  const narrativeDropdownOptions = narrativeOptions.map(opt => ({
    label: opt.label,
    value: opt.id
  }));

  const densityOptions = [
    { label: "Detailed Narrative", value: "detailed-narrative" },
    { label: "Exec Ready", value: "exec-ready" },
    { label: "Auto Demo Mode", value: "auto-demo-mode" }
  ];


  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine context: home, scenario intro, or prototype viewing mode
  const context: HeaderContext = 
    currentScene === 0 ? "home" :
    isPrototypeMode ? "prototype" :
    "scenario";

  // Get date/time from scene tag - try SCENES first, then scenario config
  const currentSceneData = SCENES.find((s) => s.id === currentScene);
  const scenarioConfig = currentSceneData ? null : activeScenarios.find(s => s.sceneId === currentScene);
  const sceneTag = currentSceneData?.sceneTag || scenarioConfig?.coverPageData.headerLine || "";
  const sceneTagParts = sceneTag.split(" · ") || [];
  const currentDate = sceneTagParts.length >= 2 
    ? `${sceneTagParts[1]} · ${sceneTagParts[2] || ""}`.trim()
    : "January 2 · 9:00 AM";
  
  // Get current arc from scene - when on home (scene 0), no arc should be active
  // For new scenarios not in SCENE_TO_ARC, default to Arc 1
  const currentArc = currentScene > 0 ? (SCENE_TO_ARC[currentScene] || (scenarioConfig ? 1 : 1)) : null;
  const currentScreen = arcNavigation.arcState.screen || 1;
  const currentArcName = currentArc ? (ARC_NAMES[currentArc] || `Arc ${currentArc}`) : "";

  // Manage prototype-mode class on body - CSS-only visibility control
  useEffect(() => {
    if (context === "prototype") {
      document.body.classList.add("prototype-mode");
    } else {
      document.body.classList.remove("prototype-mode");
    }
    return () => {
      document.body.classList.remove("prototype-mode");
    };
  }, [context]);

  // Handle navigation to home
  const handleHome = () => {
    setIsPrototypeMode(false);
    setCurrentScene(0);
    router.push("/");
  };

  // Handle arc change - now uses activeScenarios index
  // Clicking a number always takes you to the arc's "home" (cover page), exiting prototype mode
  const handleArcChange = (activeIndex: number, screen: number = 1) => {
    const targetScenario = activeScenarios[activeIndex];
    if (!targetScenario) {
      return;
    }

    const targetScene = targetScenario.sceneId;
    const arc = SCENE_TO_ARC[targetScene] || 1;
    
    // Exit prototype mode to show cover page
    setIsPrototypeMode(false);
    
    // Update arc navigation state
    arcNavigation.setArc(arc, screen);
    
    // Set scene state - this should trigger re-render
    setCurrentScene(targetScene);
    
    // Navigate to home route
    router.push("/");
  };

  // Get current active index from currentScene
  const getCurrentActiveIndex = () => {
    return activeScenarios.findIndex(s => s.sceneId === currentScene);
  };

  // Close overlays on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
      if (event.key === "Escape" && isSettingsOpen) {
        setIsSettingsOpen(false);
      }
    };

    if (isMenuOpen || isSettingsOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isMenuOpen, isSettingsOpen]);

  // Handle restart arc - reset prototype to screen 1 while staying in prototype mode
  const handleRestartArc = () => {
    // Clear all memory caches to reset animations
    resetQuotaTrackerMemory();
    resetAnimatedCounterMemory();
    resetPulseDataCardMemory();
    resetDealVelocityCardMemory();
    resetPipelineHealthCardMemory();
    resetWinRateCardMemory();
    resetConfirmationMemory();
    
    // Reset arc navigation to screen 1 (stays in prototype mode)
    arcNavigation.restartArc();
    // Trigger fade animation on content
    const contentArea = document.querySelector('[data-prototype-content]') as HTMLElement;
    if (contentArea) {
      contentArea.style.opacity = "0.7";
      setTimeout(() => {
        contentArea.style.opacity = "1";
      }, 200);
    }
  };

  // Handle next arc - uses activeScenarios
  const handleNextArc = () => {
    const currentIndex = getCurrentActiveIndex();
    if (currentIndex >= 0 && currentIndex < activeScenarios.length - 1) {
      handleArcChange(currentIndex + 1, 1);
    } else {
      // Wrap to first active scenario
      if (activeScenarios.length > 0) {
        handleArcChange(0, 1);
      }
    }
    // Fade transition
    const contentArea = document.querySelector('[data-prototype-content]') as HTMLElement;
    if (contentArea) {
      contentArea.style.opacity = "0";
      setTimeout(() => {
        contentArea.style.opacity = "1";
      }, 200);
    }
  };

  // Keyboard shortcuts (only in prototype mode)
  useEffect(() => {
    if (context !== "prototype") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleRestartArc();
        return;
      }

      if ((e.key === "ArrowRight" || e.key === " ") && !e.shiftKey) {
        e.preventDefault();
        arcNavigation.nextScreen();
        return;
      }

      if (e.key === "ArrowRight" && e.shiftKey) {
        e.preventDefault();
        handleNextArc();
        return;
      }

      if (e.key === "ArrowLeft" && e.shiftKey) {
        e.preventDefault();
        const currentIndex = getCurrentActiveIndex();
        if (currentIndex > 0) {
          handleArcChange(currentIndex - 1, 1);
        } else {
          // Wrap to last active scenario
          if (activeScenarios.length > 0) {
            handleArcChange(activeScenarios.length - 1, 1);
          }
        }
        return;
      }

      if (e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        const targetIndex = parseInt(e.key) - 1; // Convert to 0-based index
        if (targetIndex >= 0 && targetIndex < activeScenarios.length) {
          handleArcChange(targetIndex, 1);
        }
        return;
      }
      if (e.key === "0") {
        e.preventDefault();
        // Navigate to last visible scenario (index 9, which is 10th item)
        if (activeScenarios.length > 9) {
          handleArcChange(9, 1);
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [context, currentScene, activeScenarios, arcNavigation]);

  // Conditionally hide border-b on landing screen (no AppHeader below)
  const shouldHideBorder = context === "home";
  const currentActiveIndex = getCurrentActiveIndex();
  
  return (
    <header className={`global-header fixed top-0 left-0 w-full bg-[#040A14]/80 backdrop-blur-xl z-[10000] flex items-center justify-between px-8 ${shouldHideBorder ? '' : 'border-b border-white/10'}`} style={{ height: '40px', pointerEvents: 'auto' }}>
      {/* Left Side: Hamburger Menu + Branding/Scene Info */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Hamburger Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 rounded-full text-xs transition-colors select-none outline-none flex items-center justify-center flex-shrink-0 text-gray-500 hover:text-white hover:bg-white/10"
            title="Toggle Scenarios"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          {/* Side Drawer */}
          {isMounted && isMenuOpen && createPortal(
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-y-0 left-96 right-0 bg-black/50 z-[10000]"
                onClick={() => setIsMenuOpen(false)}
              />
              {/* Drawer */}
              <div 
                className={`fixed inset-y-0 left-0 w-96 bg-slate-950/50 backdrop-blur-xl border-r border-white/10 shadow-[20px_0_30px_-15px_rgba(0,0,0,0.5)] z-[10001] transform transition-transform duration-300 ease-in-out ${
                  isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-950/60">
                  <h3 className="text-sm font-semibold text-white">Scenario Master Control</h3>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* List */}
                <div className="overflow-y-auto h-[calc(100vh-60px)]">
                  {activeScenarios.map((scenario, index) => {
                    const DeviceIcon = getDeviceIcon(scenario.device);
                    return (
                      <div
                        key={scenario.id}
                        className="flex items-start p-4 border-b border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => {
                          // Navigate to this scenario
                          setCurrentScene(scenario.sceneId);
                          router.push("/");
                          setIsMenuOpen(false);
                        }}
                      >
                        {/* Click to Navigate */}
                        <div className="flex items-start gap-3 min-w-0 w-full">
                          <DeviceIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white mb-1">
                              Scene {index + 1}: {scenario.internalName}
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed">
                              {scenario.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>,
            document.body
          )}
        </div>
        
        <img 
          src="/slackbot-logo.svg" 
          alt="SlackbotPro" 
          className="w-6 h-6 flex-shrink-0"
        />
        <span className="text-[10px] tracking-[0.2em] text-gray-500 uppercase font-medium whitespace-nowrap">
          SlackbotPro <span className="mx-2 text-white/20">|</span> {context === "home" ? "SCENE 0" : currentArc ? `ARC ${currentArc} · ${currentDate}` : "SCENE 0"}
        </span>
      </div>

      {/* Center: Arc Navigation */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5 flex-shrink-0" style={{ pointerEvents: 'auto', zIndex: 10001 }}>
        {/* Home Icon */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleHome();
          }}
          className={`w-8 h-8 rounded-full text-xs transition-colors select-none outline-none flex items-center justify-center flex-shrink-0 ${
            currentScene === 0 ? 'bg-white text-black font-bold' : 'text-gray-500 hover:text-white'
          }`}
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
        >
          <IconHome width={16} height={16} stroke="currentColor" strokeWidth={2} />
        </button>

        {/* Arc Numbers - Dynamically numbered based on activeScenarios */}
        {activeScenarios.map((scenario, index) => {
          const displayNumber = index + 1; // Dynamic numbering: 1, 2, 3...
          const arcNum = SCENE_TO_ARC[scenario.sceneId] || 1;
          // Only highlight if we're NOT on home AND this scenario matches currentScene
          const isActive = currentScene !== 0 && scenario.sceneId === currentScene;
          const DeviceIcon = getDeviceIcon(scenario.device);
          return (
            <div key={scenario.id} className="relative group" style={{ pointerEvents: 'auto' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleArcChange(index, 1);
                }}
                onMouseEnter={() => {
                  hoverTimeoutRef.current = setTimeout(() => {
                    setHoveredScenarioIndex(index);
                  }, 300);
                }}
                onMouseLeave={() => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                  }
                  setHoveredScenarioIndex(null);
                }}
                className={`w-8 h-8 rounded-full text-xs transition-colors select-none outline-none flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'bg-white text-black font-bold' : 'text-gray-500 hover:text-white'
                }`}
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              >
                {displayNumber}
              </button>
              {/* Hover Card */}
              {hoveredScenarioIndex === index && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl z-50 pointer-events-none">
                  <div className="flex items-center gap-2 mb-2">
                    <DeviceIcon className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-sm font-bold text-white">{scenario.internalName}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{scenario.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Right Zone - Context Dependent */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-auto" style={{ gap: "12px" }}>
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="w-8 h-8 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
          title="Pitch Engine Settings"
        >
          <IconSettings width={16} height={16} />
        </button>
        {context === "prototype" ? (
          <>
            {/* ↺ Restart Arc */}
            <button
              type="button"
              onClick={handleRestartArc}
              className="flex items-center gap-2 transition-all"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "6px",
                padding: "4px 12px",
                fontSize: "13px",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "white";
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                e.currentTarget.style.background = "transparent";
              }}
              title="Restart Arc (R)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              <span>Restart Arc</span>
            </button>
            {/* Next Arc → */}
            <button
              type="button"
              onClick={handleNextArc}
              className="flex items-center gap-2 transition-all"
              style={{
                background: "white",
                color: "#1A0A2E",
                borderRadius: "6px",
                padding: "4px 14px",
                fontSize: "13px",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
              }}
              title={(currentArc ?? 0) >= 10 ? "Back to Start" : "Next Arc (Shift+→)"}
            >
              <span>{(currentArc ?? 0) >= 10 ? "Back to Start" : "Next Arc"}</span>
              <span>→</span>
            </button>
          </>
        ) : (
          /* HOME label for home and scenario intro screens */
          <button 
            onClick={handleHome} 
            className="text-[10px] tracking-widest text-gray-400 hover:text-white uppercase font-bold transition-colors select-none outline-none flex-shrink-0 whitespace-nowrap"
          >
            Home
          </button>
        )}
      </div>
      {isMounted && isSettingsOpen && createPortal(
        <>
          <div
            className="fixed inset-0 bg-black/55 z-[10010]"
            onClick={() => setIsSettingsOpen(false)}
          />
          <div className="fixed inset-0 z-[10011] flex items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-slate-950/60 backdrop-blur-xl shadow-2xl overflow-visible flex flex-col" style={{ minHeight: '680px' }}>
              {/* HEADER - Title only */}
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-slate-950/70">
                <h3 className="text-white text-base font-semibold">Prototype Configuration</h3>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close settings"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Scrollable body — grows to fill space */}
              {/* BODY - Scrollable content */}
              <div className="p-6 space-y-5 flex-1 overflow-y-auto overflow-x-visible">
                {/* Narrative Dropdown */}
                <CustomDropdown 
                  label="Select Narrative" 
                  value={localNarrative} 
                  options={narrativeDropdownOptions} 
                  onChange={(val) => {
                    setLocalNarrative(val);
                    setActiveNarrative(val);
                  }} 
                />
                
                {/* Presentation Density Dropdown */}
                <CustomDropdown 
                  label="Presentation Density" 
                  value={localDensity} 
                  options={densityOptions} 
                  onChange={(val) => {
                    setLocalDensity(val);
                    setPresentationDensity(val);
                  }} 
                />
                
                {/* Removed redundant "Arcs to Display" dropdown */}
                <div className="mb-4">
                  <div className="flex items-center mb-4 mt-6">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Story Arcs</label>
                    <span className="ml-2 bg-gray-800 border border-gray-700 text-gray-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[20px]">
                      {currentNarrativeData.length}
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto pr-2 pb-2 space-y-3">
                    {currentNarrativeData.map((arc, index) => {
                      const isDragging = draggedIndex === index;
                      const isDragOver = dragOverIndex === index;
                      return (
                        <div
                          key={arc.id}
                          draggable
                          onDragStart={(e) => {
                            setDraggedIndex(index);
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/html", arc.id);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                            setDragOverIndex(index);
                          }}
                          onDragLeave={() => {
                            setDragOverIndex(null);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedIndex !== null && draggedIndex !== index) {
                              reorderArcs(activeNarrative, draggedIndex, index);
                            }
                            setDraggedIndex(null);
                            setDragOverIndex(null);
                          }}
                          onDragEnd={() => {
                            setDraggedIndex(null);
                            setDragOverIndex(null);
                          }}
                          className={`flex items-start gap-3 group p-2 rounded-lg transition-all ${
                            isDragging ? "opacity-50 cursor-grabbing" : "cursor-grab"
                          } ${
                            isDragOver ? "bg-blue-500/20 border border-blue-500/50" : "hover:bg-gray-800/50"
                          }`}
                        >
                          {/* Gripper Icon */}
                          <div className="mt-1 flex-shrink-0 text-gray-500 group-hover:text-gray-400 cursor-grab active:cursor-grabbing">
                            <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
                              <circle cx="2" cy="6" r="1.5" fill="currentColor"/>
                              <circle cx="2" cy="10" r="1.5" fill="currentColor"/>
                              <circle cx="2" cy="14" r="1.5" fill="currentColor"/>
                              <circle cx="6" cy="2" r="1.5" fill="currentColor"/>
                              <circle cx="6" cy="6" r="1.5" fill="currentColor"/>
                              <circle cx="6" cy="10" r="1.5" fill="currentColor"/>
                              <circle cx="6" cy="14" r="1.5" fill="currentColor"/>
                            </svg>
                          </div>
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={!hiddenArcIds.includes(arc.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleArcVisibility(arc.id);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 flex-shrink-0 w-4 h-4 rounded border-white/20 bg-transparent text-white focus:ring-2 focus:ring-white/20 cursor-pointer"
                            style={{ accentColor: "#fff" }}
                          />
                          {/* Content */}
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{arc.internalName}</span>
                            <span className="text-xs text-gray-500 leading-relaxed mt-0.5">{arc.description}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* FOOTER - Darker background with Save and Close button */}
              <div className="px-6 py-4 bg-[#15151e] border-t border-white/10 flex justify-end items-center">
                <button 
                  onClick={handleSaveAndClose}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-[14px] transition-all ${
                    isCopied 
                      ? 'bg-green-600 text-white' 
                      : 'bg-[#2563eb] hover:bg-blue-600 text-white'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4"/> Saved & Copied!
                    </>
                  ) : (
                    'Save and Close'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
}
