"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { FirstProof } from "@/data/onboardingData";

interface OnboardingNudgeCardProps {
  onExplore: () => void;
  firstProof: FirstProof;
}

export function OnboardingNudgeCard({ onExplore, firstProof }: OnboardingNudgeCardProps) {
  const [showProof, setShowProof] = useState(false);

  // Fade in proof line after 600ms
  useEffect(() => {
    const timer = setTimeout(() => setShowProof(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="relative overflow-hidden border border-blue-100 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex items-center justify-between group"
      style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 20%, #F1F5F9 40%, #F8F4F9 60%, #F1F5F9 80%, #FFFFFF 100%)',
        backgroundSize: '400% 400%',
        animation: 'subtleGradientFill 15s ease-in-out infinite',
      }}
    >
      
      <div className="relative z-10 flex gap-4 items-start flex-1 pr-6">
        <div className="mt-1 w-8 h-8 flex-shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center border border-blue-50 overflow-hidden">
          <Image
            src="/Salesforce.png"
            alt="Salesforce"
            width={20}
            height={20}
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="font-bold text-[15px] text-gray-900 flex items-center gap-2">
            Salesforce CRM is connected
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">New</span>
          </h3>
          <p className="text-[13px] text-gray-600 mt-1">
            Your pipeline and 7 connected tools are ready. Explore CRM Skills to unlock the next-gen selling experience.
          </p>
          
          <div className="mt-3 flex items-center gap-1.5 text-[12px] text-gray-500 font-medium opacity-0 animate-[fadeIn_0.5s_ease-out_0.6s_forwards]">
            <span className="text-amber-500">⚡</span> Already working: logged {firstProof.callsLogged} calls, drafted {firstProof.followUpsDrafted} follow-ups
          </div>
        </div>
      </div>

      <button 
        onClick={onExplore}
        className="relative z-10 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-blue-600 shadow-sm hover:bg-gray-50 transition-colors flex-shrink-0"
      >
        Explore Skills →
      </button>
    </div>
  );
}
