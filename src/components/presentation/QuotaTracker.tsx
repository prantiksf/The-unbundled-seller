"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatedCounter } from "./AnimatedCounter";

// Memory vault for progress bar segments (persists across remounts)
const barMemoryVault: Record<string, number> = {};

// Function to reset memory vault (call when starting scenarios)
export function resetQuotaTrackerMemory() {
  barMemoryVault['closed'] = 0;
  barMemoryVault['lost'] = 0;
  barMemoryVault['inProgress'] = 0;
  barMemoryVault['notStarted'] = 0;
}

interface Pipeline {
  closed: number;
  inProgress: number;
  notStarted: number;
  lost: number;
  target: number;
}

interface QuotaTrackerProps {
  pipeline: Pipeline;
  isFirstScene?: boolean;
}

export function QuotaTracker({ pipeline, isFirstScene = false }: QuotaTrackerProps) {
  const { closed, inProgress, notStarted, lost, target } = pipeline;
  
  // Animation state - if first scene, start from 0, otherwise use vault or current values
  const [animatedClosed, setAnimatedClosed] = useState(() => {
    if (isFirstScene) return 0;
    const vaultValue = barMemoryVault['closed'];
    return vaultValue !== undefined ? vaultValue : 0;
  });
  const [animatedLost, setAnimatedLost] = useState(() => {
    if (isFirstScene) return 0;
    const vaultValue = barMemoryVault['lost'];
    return vaultValue !== undefined ? vaultValue : 0;
  });
  const [animatedInProgress, setAnimatedInProgress] = useState(() => {
    if (isFirstScene) return 0;
    const vaultValue = barMemoryVault['inProgress'];
    return vaultValue !== undefined ? vaultValue : 0;
  });
  const [animatedNotStarted, setAnimatedNotStarted] = useState(() => {
    if (isFirstScene) return 0;
    const vaultValue = barMemoryVault['notStarted'];
    return vaultValue !== undefined ? vaultValue : 100; // Default to 100% if no data
  });
  
  // Refs to track current animated values (updated on every state change)
  const currentClosedRef = useRef(animatedClosed);
  const currentLostRef = useRef(animatedLost);
  const currentInProgressRef = useRef(animatedInProgress);
  const currentNotStartedRef = useRef(animatedNotStarted);
  
  // Update refs whenever animated state changes
  useEffect(() => {
    currentClosedRef.current = animatedClosed;
    currentLostRef.current = animatedLost;
    currentInProgressRef.current = animatedInProgress;
    currentNotStartedRef.current = animatedNotStarted;
  }, [animatedClosed, animatedLost, animatedInProgress, animatedNotStarted]);
  
  // Fixed visual maximum scale ($1,000,000) to prevent overflow
  const VISUAL_MAX = 1000000;
  
  // Calculate raw percentages relative to VISUAL_MAX
  const closedPctRaw = (closed / VISUAL_MAX) * 100;
  const lostPctRaw = (lost / VISUAL_MAX) * 100;
  const inProgressPctRaw = (inProgress / VISUAL_MAX) * 100;
  const notStartedPctRaw = (notStarted / VISUAL_MAX) * 100;
  
  // Calculate total to normalize to 100%
  const totalPct = closedPctRaw + lostPctRaw + inProgressPctRaw + notStartedPctRaw;
  
  // Normalize percentages so they always add up to 100% (bar is always full)
  const closedPct = totalPct > 0 ? (closedPctRaw / totalPct) * 100 : 0;
  const lostPct = totalPct > 0 ? (lostPctRaw / totalPct) * 100 : 0;
  const inProgressPct = totalPct > 0 ? (inProgressPctRaw / totalPct) * 100 : 0;
  const notStartedPct = totalPct > 0 ? (notStartedPctRaw / totalPct) * 100 : 100; // Default to 100% if no data
  
  // Calculate quota percentage
  const percentAchieved = Math.round((closed / target) * 100);
  
  // Track if this is the first render
  const isFirstMount = useRef(true);
  
  useEffect(() => {
    const duration = 1200; // ms
    const startTime = Date.now();
    
    // If first scene, start from 0 for all segments
    let startClosed = isFirstScene ? 0 : currentClosedRef.current;
    let startLost = isFirstScene ? 0 : currentLostRef.current;
    let startInProgress = isFirstScene ? 0 : currentInProgressRef.current;
    let startNotStarted = isFirstScene ? 0 : currentNotStartedRef.current;
    
    // Update refs to match start values
    if (isFirstScene) {
      currentClosedRef.current = 0;
      currentLostRef.current = 0;
      currentInProgressRef.current = 0;
      currentNotStartedRef.current = 0;
    }
    
    const endClosed = closedPct;
    const endLost = lostPct;
    const endInProgress = inProgressPct;
    const endNotStarted = notStartedPct;
    
    // Skip animation if values haven't changed significantly
    if (Math.abs(startClosed - endClosed) < 0.01 && 
        Math.abs(startLost - endLost) < 0.01 && 
        Math.abs(startInProgress - endInProgress) < 0.01 && 
        Math.abs(startNotStarted - endNotStarted) < 0.01) {
      // Still set the final values even if skipping animation
      if (isFirstScene) {
        setAnimatedClosed(endClosed);
        setAnimatedLost(endLost);
        setAnimatedInProgress(endInProgress);
        setAnimatedNotStarted(endNotStarted);
      }
      return;
    }
    
    const animateAll = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use ease-out for smooth natural animation
      const easing = 1 - Math.pow(1 - progress, 3);
      
      // Animate segments smoothly
      const currentClosed = Math.max(0, Math.min(100, startClosed + (endClosed - startClosed) * easing));
      const currentLost = Math.max(0, Math.min(100, startLost + (endLost - startLost) * easing));
      const currentInProgress = Math.max(0, Math.min(100, startInProgress + (endInProgress - startInProgress) * easing));
      const currentNotStarted = Math.max(0, Math.min(100, startNotStarted + (endNotStarted - startNotStarted) * easing));
      
      setAnimatedClosed(currentClosed);
      setAnimatedLost(currentLost);
      setAnimatedInProgress(currentInProgress);
      setAnimatedNotStarted(currentNotStarted);
      
      if (progress < 1) {
        requestAnimationFrame(animateAll);
      } else {
        // Ensure final values are exact
        setAnimatedClosed(endClosed);
        setAnimatedLost(endLost);
        setAnimatedInProgress(endInProgress);
        setAnimatedNotStarted(endNotStarted);
        
        // Update memory vault for persistence
        barMemoryVault['closed'] = endClosed;
        barMemoryVault['lost'] = endLost;
        barMemoryVault['inProgress'] = endInProgress;
        barMemoryVault['notStarted'] = endNotStarted;
      }
    };
    
    // Start animation
    requestAnimationFrame(animateAll);
    
    return () => {
      // Cleanup handled by React
    };
  }, [closedPct, lostPct, inProgressPct, notStartedPct, isFirstScene]);

  return (
    <div className="flex items-start gap-8 w-full pt-4 pb-6">
      {/* Left: Stacked Bar */}
      <div className="flex-1 flex flex-col gap-2 -mt-[4px]">
        {/* Quota Impact Label */}
        <div className="text-[10px] uppercase tracking-widest font-bold mb-2 mt-[2px]" style={{ color: "#181818" }}>
          Quota Impact
        </div>
        {/* Bar Container with Target Line */}
        <div className="relative w-full h-[6px]">
          {/* Fixed Capsule Background - Always full width */}
          <div className="absolute inset-0 bg-slate-200/20 rounded-full"></div>
          
          {/* The Quota Target Line (50% of 1M = 500k) */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-slate-400 z-10"></div>
          
          {/* Segments Container - Always fills 100% of the bar */}
          <div className="relative w-full h-full rounded-full overflow-hidden">
            {/* Calculate positions - bar always fills 100% */}
            {(() => {
              const totalUsed = animatedClosed + animatedLost + animatedInProgress + animatedNotStarted;
              const remainingPct = Math.max(0, 100 - totalUsed);
              const startPos = animatedClosed;
              const lostPos = animatedClosed + animatedLost;
              const inProgressPos = animatedClosed + animatedLost + animatedInProgress;
              const notStartedPos = animatedClosed + animatedLost + animatedInProgress + animatedNotStarted;
              
              return (
                <>
                  {/* 1. Closed Segment - Always render, even if 0 width */}
                  <div
                    className="absolute left-0 top-0 h-full bg-emerald-500 z-20"
                    style={{ 
                      width: `${Math.max(0, animatedClosed)}%`,
                      opacity: animatedClosed > 0 ? 1 : 0,
                      transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
                      borderRadius: animatedClosed >= 100 ? '9999px' : '9999px 0 0 9999px',
                      boxShadow: closed >= target ? '0 0 12px rgba(16,185,129,0.8)' : 'none'
                    }}
                  />
                  
                  {/* 2. Lost Segment - Always render */}
                  <div
                    className="absolute left-0 top-0 h-full bg-red-500/80 z-10"
                    style={{ 
                      left: `${startPos}%`,
                      width: `${Math.max(0, animatedLost)}%`,
                      opacity: animatedLost > 0 ? 1 : 0,
                      transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1), left 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease'
                    }}
                  />
                  
                  {/* 3. In Progress Segment - Always render */}
                  <div
                    className="absolute left-0 top-0 h-full bg-blue-500/80 z-10"
                    style={{ 
                      left: `${lostPos}%`,
                      width: `${Math.max(0, animatedInProgress)}%`,
                      opacity: animatedInProgress > 0 ? 1 : 0,
                      transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1), left 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease'
                    }}
                  />
                  
                  {/* 4. Not Started Segment - Always render */}
                  <div
                    className="absolute left-0 top-0 h-full bg-slate-400/60 z-10"
                    style={{ 
                      left: `${inProgressPos}%`,
                      width: `${Math.max(0, animatedNotStarted)}%`,
                      opacity: animatedNotStarted > 0 ? 1 : 0,
                      transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1), left 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
                      borderRadius: (notStartedPos >= 100 && startPos === 0) ? '9999px' : '0 9999px 9999px 0'
                    }}
                  />
                  
                  {/* 5. Remaining space filled with Not Started (ensures bar is always 100%) */}
                  {remainingPct > 0 && (
                    <div
                      className="absolute left-0 top-0 h-full bg-slate-400/60 z-5"
                      style={{ 
                        left: `${notStartedPos}%`,
                        width: `${remainingPct}%`,
                        transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1), left 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                        borderRadius: (notStartedPos === 0 && remainingPct >= 100) ? '9999px' : '0 9999px 9999px 0'
                      }}
                    />
                  )}
                </>
              );
            })()}
          </div>
        </div>
        
        {/* Labels */}
        <div className="flex items-center gap-4 text-[10px] tracking-widest uppercase font-bold">
          <span className="flex items-center gap-1.5" style={{ color: '#10b981' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            CLOSED
          </span>
          <span className="flex items-center gap-1.5" style={{ color: '#3b82f6' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            IN PROGRESS
          </span>
          <span className="flex items-center gap-1.5" style={{ color: '#64748b' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            NOT STARTED
          </span>
          <span className="flex items-center gap-1.5" style={{ color: '#ef4444' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            LOST
          </span>
        </div>
      </div>

      {/* Right: Stats */}
      <div className="text-right ml-8 min-w-[120px] flex-shrink-0">
        <div className="text-4xl font-bold tracking-tight" style={{ color: "#181818", fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
          <AnimatedCounter id="percent" value={percentAchieved} suffix="%" resetOnMount={isFirstScene} />
        </div>
        <div className="text-sm font-medium mt-1" style={{ color: "#64748b" }}>
          <AnimatedCounter id="revenue" value={closed} prefix="$" stiffness={150} damping={35} resetOnMount={isFirstScene} /> / $500,000
        </div>
      </div>
    </div>
  );
}
