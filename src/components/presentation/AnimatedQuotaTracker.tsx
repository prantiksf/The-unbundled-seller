"use client";

import React, { useState, useEffect, useRef, memo } from "react";

interface Pipeline {
  closed: number;
  inProgress: number;
  notStarted: number;
  lost: number;
  target: number;
}

interface AnimatedQuotaTrackerProps {
  pipeline: Pipeline;
  index?: number;
}

// Module-level memory to track if this specific instance has animated
const animationMemory = new Set<string>();

function AnimatedQuotaTracker({ pipeline, index = 0 }: AnimatedQuotaTrackerProps) {
  const { closed, inProgress, notStarted, lost, target } = pipeline;
  
  // Create a unique key for this instance
  const instanceKey = `quota-${index}-${target}`;
  
  // Animated state
  const [animatedClosed, setAnimatedClosed] = useState(0);
  const [animatedInProgress, setAnimatedInProgress] = useState(0);
  const [animatedNotStarted, setAnimatedNotStarted] = useState(0);
  const [animatedLost, setAnimatedLost] = useState(0);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [animatedValue, setAnimatedValue] = useState(0);
  
  const hasAnimated = useRef(false);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate totals
  const totalPipeline = closed + inProgress + notStarted + lost;
  const totalAttained = closed + inProgress;
  const percentAttained = target > 0 ? Math.round((totalAttained / target) * 100) : 0;
  
  // Animate the values
  useEffect(() => {
    // If already animated, set final values immediately
    if (hasAnimated.current || animationMemory.has(instanceKey)) {
      setAnimatedClosed(closed);
      setAnimatedInProgress(inProgress);
      setAnimatedNotStarted(notStarted);
      setAnimatedLost(lost);
      setAnimatedPercent(percentAttained);
      setAnimatedValue(totalAttained);
      return;
    }
    
    // Mark as animated BEFORE starting animation
    hasAnimated.current = true;
    animationMemory.add(instanceKey);
    
    const duration = 1500;
    const steps = 60;
    let step = 0;
    
    const closedIncrement = closed / steps;
    const inProgressIncrement = inProgress / steps;
    const notStartedIncrement = notStarted / steps;
    const lostIncrement = lost / steps;
    const percentIncrement = percentAttained / steps;
    const valueIncrement = totalAttained / steps;
    
    animationTimerRef.current = setInterval(() => {
      step++;
      setAnimatedClosed(Math.min(closedIncrement * step, closed));
      setAnimatedInProgress(Math.min(inProgressIncrement * step, inProgress));
      setAnimatedNotStarted(Math.min(notStartedIncrement * step, notStarted));
      setAnimatedLost(Math.min(lostIncrement * step, lost));
      setAnimatedPercent(Math.min(Math.round(percentIncrement * step), percentAttained));
      setAnimatedValue(Math.min(valueIncrement * step, totalAttained));
      
      if (step >= steps) {
        if (animationTimerRef.current) {
          clearInterval(animationTimerRef.current);
          animationTimerRef.current = null;
        }
      }
    }, duration / steps);
    
    // Cleanup on unmount
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount
  
  // Calculate percentages for bar segments
  const totalAnimated = animatedClosed + animatedInProgress + animatedNotStarted + animatedLost;
  const closedPct = totalAnimated > 0 ? (animatedClosed / totalAnimated) * 100 : 0;
  const inProgressPct = totalAnimated > 0 ? (animatedInProgress / totalAnimated) * 100 : 0;
  const notStartedPct = totalAnimated > 0 ? (animatedNotStarted / totalAnimated) * 100 : 0;
  const lostPct = totalAnimated > 0 ? (animatedLost / totalAnimated) * 100 : 0;
  
  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(val);
  };
  
  return (
    <div className="mb-6 max-w-2xl w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">QUOTA IMPACT</span>
        <div className="text-right">
          <span className="text-4xl font-black block leading-none">{animatedPercent}%</span>
          <span className="text-[13px] text-gray-500">{formatCurrency(animatedValue)} / {formatCurrency(target)}</span>
        </div>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full mb-3 flex overflow-hidden">
        {closedPct > 0 && (
          <div 
            className="h-full bg-[#2BAC76] transition-all duration-75"
            style={{ width: `${closedPct}%` }}
          />
        )}
        {inProgressPct > 0 && (
          <div 
            className="h-full border-l border-white bg-blue-500 transition-all duration-75"
            style={{ width: `${inProgressPct}%` }}
          />
        )}
        {notStartedPct > 0 && (
          <div 
            className="h-full border-l border-white bg-gray-400 transition-all duration-75"
            style={{ width: `${notStartedPct}%` }}
          />
        )}
        {lostPct > 0 && (
          <div 
            className="h-full border-l border-white bg-red-500 transition-all duration-75"
            style={{ width: `${lostPct}%` }}
          />
        )}
      </div>
      <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
        <span className="text-[#2BAC76]">● CLOSED</span>
        <span className="text-blue-500">● IN PROGRESS</span>
        <span className="text-gray-400">● NOT STARTED</span>
        <span className="text-red-500">● LOST</span>
      </div>
    </div>
  );
}

export default memo(AnimatedQuotaTracker);

// Reset function for global restart
export function resetAnimatedQuotaTrackerMemory() {
  animationMemory.clear();
}
