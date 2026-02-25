"use client";

import { motion } from "framer-motion";
import { QuotaTracker } from "./QuotaTracker";

interface CoverPageProps {
  headerLine: string;
  headline: string;
  subHeadline: string;
  oldWorld: string;
  withIntelligence: string;
  metric1Old: string;
  metric1New: string;
  metric2Old: string;
  metric2New: string;
  onEnterPrototype: () => void;
  quotaImpact?: {
    percent: number;
    value: number;
    total: number;
  };
  pipeline?: {
    closed: number;
    inProgress: number;
    notStarted: number;
    lost: number;
    target: number;
  };
}

export function CoverPage({
  headerLine,
  headline,
  subHeadline,
  oldWorld,
  withIntelligence,
  metric1Old,
  metric1New,
  metric2Old,
  metric2New,
  onEnterPrototype,
  quotaImpact,
  pipeline,
}: CoverPageProps) {
  return (
    <div className="sp fixed z-[200] overflow-hidden" style={{ background: "var(--bg)", top: "var(--header-height, 40px)", left: 0, right: 0, width: "100vw", minWidth: "100%", height: "calc(100vh - var(--header-height, 40px))" }}>
      {/* Split layout - overlapping editorial feel */}
      <div className="relative w-full h-full bg-[#E5EEFB] flex overflow-hidden gap-0 min-w-0" style={{ width: '100%', minWidth: '100%', zIndex: 1 }}>
        {/* Left image - fill container, no black bars */}
        <div className="w-[65%] h-full relative shrink-0 [mask-image:linear-gradient(to_right,white_80%,transparent_100%)]" style={{ minWidth: '65%' }}>
          {/* Placeholder for scene image - can be customized per scene */}
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200" />
        </div>

        {/* Right content - overlapping panel */}
        <div className="flex-1 h-full bg-transparent relative z-10 -ml-32 flex items-center justify-center min-w-0" style={{ minWidth: 0, flexGrow: 1 }}>
          {/* Fixed-width, centered inner container */}
          <div className="w-full max-w-[940px] px-16 flex flex-col min-w-0" style={{ width: '100%' }}>
            {/* 1. Animated Header Block */}
            <div className="h-[180px] shrink-0 flex flex-col justify-end pb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="animate-reveal opacity-0"
                style={{ animationDelay: '100ms' }}
              >
                <div className="s-scene-tag font-mono text-[9px] tracking-[0.15em] uppercase mb-2" style={{ color: "#181818" }}>
                  {headerLine}
                </div>
                <h1 className="s-title text-[clamp(32px,3.5vw,50px)] leading-[1.05] tracking-[-0.02em]" style={{ color: "#181818", fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
                  "{headline}"
                </h1>
                {subHeadline && (
                  <p className="s-subtitle text-lg max-w-xl mt-2" style={{ color: "#181818" }}>
                    {subHeadline}
                  </p>
                )}
              </motion.div>
            </div>

            {/* 2. Quota Impact Bar (if quotaImpact provided) */}
            {quotaImpact && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-2 mb-8"
              >
                <div className="bg-white rounded-lg p-4 border" style={{ borderColor: 'rgba(0, 89, 255, 0.2)' }}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium" style={{ color: "#181818" }}>
                      Quota Impact
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span style={{ color: "#181818" }}>
                        <span className="font-bold" style={{ fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif" }}>{quotaImpact.percent}%</span>
                      </span>
                      <span style={{ color: "#181818" }}>
                        <span className="font-bold" style={{ fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif" }}>${quotaImpact.value.toLocaleString()}</span>
                      </span>
                      <span style={{ color: "#181818" }}>
                        <span className="font-bold" style={{ fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif" }}>${quotaImpact.total.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {pipeline && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-2 mb-8"
              >
                <QuotaTracker pipeline={pipeline} isFirstScene={false} />
              </motion.div>
            )}

            {/* 3. Animated Body Block */}
            <div>
              {/* Symmetrical Story Grid (Old World vs With Intelligence) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="animate-reveal opacity-0 grid grid-cols-2 gap-x-16 shrink-0 items-start"
                style={{ animationDelay: '300ms' }}
              >
                {/* LEFT COLUMN: OLD WORLD */}
                <div className="flex flex-col w-full">
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-widest flex items-center gap-2" style={{ color: "#ef4444", fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#ef4444" }}></span>Old World
                    </h4>
                    <p className="text-[15px] leading-relaxed" style={{ color: "#181818" }}>
                      {oldWorld}
                    </p>
                  </div>
                </div>

                {/* RIGHT COLUMN: WITH INTELLIGENCE */}
                <div className="flex flex-col w-full">
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-widest flex items-center gap-2" style={{ color: "#0059FF", fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#0059FF" }}></span>With Intelligence
                    </h4>
                    <p className="text-[15px] leading-relaxed" style={{ color: "#181818" }}>
                      {withIntelligence}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Symmetrical Metrics Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="animate-subtle opacity-0 grid grid-cols-2 gap-x-16 shrink-0 mt-8 border-t pt-8"
                style={{ animationDelay: '200ms', borderColor: 'rgba(0, 89, 255, 0.2)' }}
              >
                {/* LEFT COLUMN: Old World Metrics */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col">
                    <span className="text-5xl whitespace-nowrap leading-none" style={{ color: "#ef4444", fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
                      {metric1Old}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest mt-2" style={{ color: "#181818" }}>
                      {metric1Old === "4 hrs" ? "Manual setup" : metric1Old === "3 hrs" ? (metric2Old === "Zero" ? "Deal Stall Time" : "Manual replacement") : metric1Old === "5 hrs" ? "Chasing Signatures" : "Old World"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-5xl whitespace-nowrap leading-none" style={{ color: "#ef4444", fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
                      {metric2Old}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest mt-2" style={{ color: "#181818" }}>
                      {metric2Old === "Static" ? "Old Methodology" : metric2Old === "Zero" ? "System Access" : metric2Old === "Desk-bound" ? "Seller Location" : metric2Old === "2 leads" ? "Qualified by noon" : "Old World"}
                    </span>
                  </div>
                </div>

                {/* RIGHT COLUMN: With Intelligence Metrics */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col">
                    <span className="text-5xl whitespace-nowrap leading-none" style={{ color: "#0059FF", fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
                      {metric1New}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest mt-2" style={{ color: "#181818" }}>
                      {metric1New === "10 sec" ? (metric2New === "Simulated" ? "Agentic Deal Room" : "Mobile Action Time") : metric1New === "0 hrs" ? (metric2New === "14" ? "Rita's time to recover" : "Autonomous Close") : "With Intelligence"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-5xl whitespace-nowrap leading-none" style={{ color: "#0059FF", fontFamily: "'Avant Garde for Salesforce', 'ITC Avant Garde Gothic', Montserrat, sans-serif", fontWeight: 700 }}>
                      {metric2New}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest mt-2" style={{ color: "#181818" }}>
                      {metric2New === "Simulated" ? "Dynamic Canvas" : metric2New === "100%" ? "Actionability via Slack" : metric2New === "Anywhere" ? "Relationship Building" : metric2New === "14" ? "Accounts researched overnight" : "With Intelligence"}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Persistent Footer with Enter Prototype Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="animate-reveal opacity-0 h-[80px] shrink-0 flex items-center justify-between border-t mt-4"
                style={{ animationDelay: '500ms', borderColor: 'rgba(0, 89, 255, 0.2)' }}
              >
                {/* Left: Enter Prototype Button */}
                <div className="flex-shrink-0">
                  <button
                    className="btn-proto inline-flex items-center gap-[9px] rounded-xl px-5 py-[13px] font-sans text-[12.5px] font-semibold cursor-pointer tracking-[0.01em] transition-all duration-[0.18s] ease whitespace-nowrap"
                    style={{ background: "#0059FF", color: "#FFFFFF", borderRadius: "8px" }}
                    onClick={onEnterPrototype}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#0066FF";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 6px 24px rgba(0, 89, 255, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#0059FF";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    Enter Prototype <span className="btn-arr text-[15px] transition-transform duration-[0.18s]" style={{ transform: "translateX(0)" }}>→</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
