"use client";

import React, { useState } from "react";

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
  
  // Calculate pipeline metrics
  const totalPipeline = closed + inProgress + notStarted + lost;
  const winRate = totalPipeline > 0 ? Math.round((closed / (closed + lost)) * 100) : 52;
  const closeRate = totalPipeline > 0 ? Math.round((closed / totalPipeline) * 100) : 68;
  
  // Slider state - initialize from target or use default
  const [sliderValue, setSliderValue] = useState(target || 545000);
  const [advancedMode, setAdvancedMode] = useState(false);

  // Formatting helpers
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  // Calculate commission based on slider value (simplified calculation)
  const estimatedCommission = Math.round(sliderValue * 0.14); // ~14% commission rate
  const pipelineGap = Math.max(0, sliderValue - totalPipeline);

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto bg-white p-5 rounded-2xl shadow-sm border border-gray-200 font-sans">
      
      {/* 1. COMPACT AI NUDGE */}
      <div className="bg-gradient-to-r from-[#F0F4FF] to-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 mb-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-blue-100 text-sm">✨</div>
          <div>
            <h3 className="text-[13px] font-bold text-gray-900 leading-none">Optimal quota recommended: {formatCurrency(target * 1.23)}.</h3>
            <p className="text-[12px] text-gray-500 mt-1 leading-none">Deploying 3 agents boosts win rate to 56.4%.</p>
          </div>
        </div>
        <button className="flex-shrink-0 ml-3 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-[11px] font-bold text-blue-600 hover:border-blue-300 hover:text-blue-700 shadow-sm transition-all">
          Apply
        </button>
      </div>

      {/* 2. HEADER & CONTEXT */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg leading-none">📊</span>
            <h1 className="text-[18px] font-black text-gray-900 tracking-tight leading-none">Q1 Planner</h1>
          </div>
          <p className="text-[12px] text-gray-500 font-medium mt-1.5">
            Pipeline: <span className="text-gray-900 font-bold">{formatCurrency(totalPipeline)}</span> · Win Rate: <span className="text-gray-900 font-bold">{winRate}%</span> · Quota: <span className="text-gray-900 font-bold">{formatCurrency(target)}</span>
          </p>
        </div>
        <div className="flex -space-x-1.5">
          <div className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[8px] font-bold text-blue-500 shadow-sm z-10">SF</div>
          <div className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[8px] font-bold text-purple-500 shadow-sm z-20">GO</div>
          <div className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[8px] font-bold text-red-500 shadow-sm z-30">GM</div>
        </div>
      </div>

      {/* 3. SEGMENTED CONTROLS */}
      <div className="flex bg-gray-100/80 p-1 rounded-lg mb-6">
        <button className="flex-1 py-1.5 text-[12px] font-bold rounded-md text-gray-500 hover:text-gray-700 transition-all">Conservative</button>
        <button className="flex-1 py-1.5 text-[12px] font-bold rounded-md bg-white text-gray-900 shadow-sm transition-all border border-gray-200/50">Quota</button>
        <button className="flex-1 py-1.5 text-[12px] font-bold rounded-md text-gray-500 hover:text-gray-700 transition-all">Stretch</button>
      </div>

      {/* 4. PREMIUM CUSTOM SLIDER */}
      <div className="mb-6 px-1">
        <div className="flex items-end justify-between mb-3">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Confidence Slider</h4>
          <div className="text-[28px] font-black text-gray-900 tracking-tight leading-none">
            {formatCurrency(sliderValue)}
          </div>
        </div>
        
        <div className="relative w-full h-6 flex items-center">
          <input 
            type="range" 
            min="400000" 
            max="800000" 
            step="5000"
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer outline-none relative z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[4px] [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[4px] [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md"
            style={{
              background: `linear-gradient(to right, #2563EB 0%, #2563EB ${(sliderValue - 400000) / 4000}%, #E2E8F0 ${(sliderValue - 400000) / 4000}%, #E2E8F0 100%)`,
            }}
          />
        </div>
      </div>

      {/* 5. COMPACT IMPACT CARD */}
      <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200/60">
          <h3 className="text-[12px] font-bold text-gray-800 uppercase tracking-wide">Plan Impact</h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 font-bold">Advanced</span>
            <button onClick={() => setAdvancedMode(!advancedMode)} className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${advancedMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform duration-200 shadow-sm ${advancedMode ? 'left-4.5 translate-x-[14px]' : 'left-0.5'}`}></div>
            </button>
          </div>
        </div>

        <div className="space-y-2.5 mb-4">
          <div className="flex items-end justify-between">
            <span className="text-[13px] text-gray-600 font-medium">Estimated Commission</span>
            <span className="text-[22px] font-black text-[#2BAC76] leading-none">{formatCurrency(estimatedCommission)}</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[12px] text-gray-500">Pipeline gap to close</span>
            <span className="text-[12px] font-bold text-gray-900">{pipelineGap === 0 ? "$0K" : `$${(pipelineGap / 1000).toFixed(0)}K`}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-gray-500">AI workload</span>
            <span className="text-[12px] font-bold text-gray-900">High (1,009 tasks)</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-3 flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <span className="text-amber-500 text-[12px]">⚠️</span>
            <span className="text-[12px] font-bold text-amber-900">Admin Overload Risk</span>
          </div>
          <button className="px-2.5 py-1 bg-white border border-amber-200 rounded text-[10px] font-bold text-amber-700 hover:bg-amber-100 shadow-sm">
            Automate
          </button>
        </div>
      </div>

      {/* 6. COMPACT ACTIONS */}
      <div className="flex gap-2">
        <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-[13px] font-bold hover:bg-blue-700 shadow-sm flex items-center justify-center gap-1.5">
          Approve {formatCurrency(sliderValue).replace('.00', '')}
        </button>
        <button className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px] font-bold hover:bg-gray-50 shadow-sm">
          Execute in Messages
        </button>
      </div>
      
    </div>
  );
}
