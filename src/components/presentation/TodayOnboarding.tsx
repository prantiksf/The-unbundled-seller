"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlackTodayView } from "./SlackTodayView";
import type { OnboardingData } from "@/data/onboardingData";

type OnboardingState = 'arrival' | 'skills' | 'complete' | 'off';

interface TodayOnboardingProps {
  state: OnboardingState;
  onStateChange: (newState: OnboardingState) => void;
  data: OnboardingData;
}

// Status dot colors
const STATUS_COLORS = {
  green: '#2BAC76',
  amber: '#F2C744',
  red: '#E01E5A',
};

export function TodayOnboarding({ state, onStateChange, data }: TodayOnboardingProps) {
  const [activatedSkills, setActivatedSkills] = useState<Set<string>>(new Set());
  const [dismissedSkills, setDismissedSkills] = useState<Set<string>>(new Set());
  const [showProof, setShowProof] = useState(false);
  const [showCompleteBanner, setShowCompleteBanner] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Debug: Log when component renders
  useEffect(() => {
    console.log('[TodayOnboarding] Component rendered with state:', state, {
      hasData: !!data,
      isFirstOpen: data?.isFirstOpen,
      skillsCount: data?.skills?.length,
    });
  }, [state, data]);

  // Debug: Log when component renders
  useEffect(() => {
    console.log('[TodayOnboarding] Component rendered with state:', state, {
      skillsCount: data.skills?.length,
      isFirstOpen: data.isFirstOpen,
    });
  }, [state, data]);

  // Fade in proof line after 600ms
  useEffect(() => {
    if (state === 'arrival') {
      const timer = setTimeout(() => setShowProof(true), 600);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Auto-hide complete banner after 5 seconds or on scroll
  useEffect(() => {
    if (state === 'complete' && showCompleteBanner) {
      const timer = setTimeout(() => {
        setShowCompleteBanner(false);
        onStateChange('off');
      }, 5000);

      const handleScroll = () => {
        setShowCompleteBanner(false);
        onStateChange('off');
      };

      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener('scroll', handleScroll, { once: true });
      }

      return () => {
        clearTimeout(timer);
        if (container) {
          container.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [state, showCompleteBanner, onStateChange]);

  const handleActivateSkill = (skillId: string) => {
    setActivatedSkills(prev => new Set(prev).add(skillId));
  };

  const handleDismissSkill = (skillId: string) => {
    setDismissedSkills(prev => new Set(prev).add(skillId));
  };

  const handleActivateAll = () => {
    const allSkillIds = data.skills.map(s => s.id);
    // Stagger activation animations
    allSkillIds.forEach((skillId, index) => {
      setTimeout(() => {
        handleActivateSkill(skillId);
      }, index * 80);
    });
    // After animations complete, transition to complete state
    setTimeout(() => {
      onStateChange('complete');
    }, allSkillIds.length * 80 + 600);
  };

  const visibleSkills = data.skills.filter(s => !dismissedSkills.has(s.id));
  const dismissedSkillsList = data.skills.filter(s => dismissedSkills.has(s.id));
  const allActivated = data.skills.every(s => activatedSkills.has(s.id) || dismissedSkills.has(s.id));

  if (state === 'arrival') {
    return (
      <div className="h-full w-full min-h-0 flex items-center justify-center bg-white overflow-auto" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl w-full mx-auto px-8 py-12"
        >
          <div className="bg-white rounded-2xl border border-[#DDDDDD] shadow-lg p-8 relative">
            {/* Greeting */}
            <h1 className="text-[20px] font-semibold text-[#1D1C1D] mb-2">
              Good morning, Rita.
            </h1>
            
            {/* Context line */}
            <p className="text-[15px] text-[#616061] mb-6">
              I've read your pipeline. Here's what I see:
            </p>

            {/* Stat block */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#F8F8F8] rounded-xl p-4 border border-[#DDDDDD]">
                <div className="text-3xl font-bold text-[#1D1C1D] mb-1">
                  {data.pipelineSummary.activeOpportunities}
                </div>
                <div className="text-[13px] text-[#616061]">active opportunities</div>
              </div>
              <div className="bg-[#F8F8F8] rounded-xl p-4 border border-[#DDDDDD]">
                <div className="text-3xl font-bold text-[#1D1C1D] mb-1">
                  ${(data.pipelineSummary.totalPipeline / 1000).toFixed(0)}K
                </div>
                <div className="text-[13px] text-[#616061]">total pipeline</div>
              </div>
              <div className="bg-[#F8F8F8] rounded-xl p-4 border border-[#DDDDDD]">
                <div className="text-3xl font-bold text-[#1D1C1D] mb-1">
                  {data.pipelineSummary.needsAttention}
                </div>
                <div className="text-[13px] text-[#616061]">need attention</div>
              </div>
              <div className="bg-[#F8F8F8] rounded-xl p-4 border border-[#DDDDDD]">
                <div className="text-3xl font-bold text-[#1D1C1D] mb-1">
                  {data.pipelineSummary.closingThisMonth}
                </div>
                <div className="text-[13px] text-[#616061]">closing this month</div>
              </div>
            </div>

            {/* Connected tools */}
            <div className="mb-6">
              <div className="text-[13px] text-[#616061] mb-2">Your connected tools:</div>
              <div className="flex flex-wrap gap-2 text-[13px] text-[#868686]">
                {data.connectedApps.map((app, index) => (
                  <span key={app.name}>
                    <span className="text-green-600">{app.icon}</span> {app.name}
                    {index < data.connectedApps.length - 1 && <span className="mx-1">·</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Lead-in */}
            <p className="text-[15px] text-[#1D1C1D] mb-6">
              Based on your role, pipeline, and tools — I've prepared 6 Sales Skills I can run for you.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center mb-4">
              <button
                onClick={() => onStateChange('skills')}
                className="px-6 py-3 bg-[#007A5A] text-white font-semibold rounded-lg hover:bg-[#006B4E] transition-colors text-[14px]"
              >
                Show me what you can do →
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-[#DDDDDD] mb-4" />

            {/* Proof Footer - fades in after 600ms */}
            <AnimatePresence>
              {showProof && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <p className="text-[13px] text-[#868686] italic">
                    ⚡ Already working: I logged {data.firstProof.callsLogged} calls from today and drafted {data.firstProof.followUpsDrafted} follow-ups waiting in your {data.firstProof.location}.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  if (state === 'skills') {
    const allActivated = data.skills.every(s => activatedSkills.has(s.id) || dismissedSkills.has(s.id));
    
    return (
      <div className="h-full min-h-0 overflow-y-auto bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <div className="max-w-3xl mx-auto px-8 py-8">
          <div className="mb-6">
            <div className="text-[12px] font-semibold text-[#868686] uppercase tracking-wider mb-1">
              YOUR SALES SKILLS
            </div>
            <p className="text-[13px] text-[#616061]">
              6 skills ready · based on your role and tools
            </p>
          </div>

          {/* Skills List */}
          <div className="space-y-3 mb-6">
            {visibleSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: dismissedSkills.has(skill.id) ? 0.5 : 1, y: 0 }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${
                  dismissedSkills.has(skill.id)
                    ? 'opacity-50 border-[#DDDDDD]'
                    : activatedSkills.has(skill.id)
                    ? 'border-[#2BAC76] bg-green-50'
                    : 'border-[#DDDDDD] hover:border-gray-300 hover:shadow-md'
                }`}
                style={{
                  order: dismissedSkills.has(skill.id) ? 999 : 0,
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-2xl flex-shrink-0">{skill.icon}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-semibold text-[#1D1C1D] mb-1">
                          {skill.name}
                        </h3>
                        <p className="text-[14px] text-[#616061] mb-3">
                          {skill.description}
                        </p>
                      </div>

                      {/* Action Button */}
                      {activatedSkills.has(skill.id) ? (
                        <motion.div
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 0.3 }}
                          className="px-4 py-2 bg-[#2BAC76] text-white font-semibold rounded-lg text-[13px] flex items-center gap-2 flex-shrink-0"
                        >
                          <span>✓</span>
                          <span>Active</span>
                        </motion.div>
                      ) : (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleActivateSkill(skill.id)}
                            className="px-4 py-2 bg-[#007A5A] text-white font-semibold rounded-lg hover:bg-[#006B4E] transition-colors text-[13px]"
                          >
                            Activate
                          </button>
                          <button
                            onClick={() => handleDismissSkill(skill.id)}
                            className="px-4 py-2 text-[#1264A3] font-semibold text-[13px] hover:underline"
                          >
                            Not yet
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Preview Lines */}
                    <div className="bg-[#F0F0F0] rounded-lg p-3 mb-2">
                      <div className="space-y-1.5">
                        {skill.preview.map((line, lineIndex) => (
                          <div
                            key={lineIndex}
                            className="flex items-start gap-2 text-[13px]"
                            style={{
                              fontFamily: '"SF Mono", "Monaco", "Menlo", monospace',
                            }}
                          >
                            {line.status && (
                              <div
                                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                                style={{ backgroundColor: STATUS_COLORS[line.status] }}
                              />
                            )}
                            <span className="text-[#1D1C1D]">{line.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Signal */}
                    <p className="text-[13px] text-[#868686] italic">
                      Signal: {skill.signal}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Dismissed skills at bottom */}
            {dismissedSkillsList.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-[#DDDDDD] rounded-xl p-5 shadow-sm opacity-50"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl flex-shrink-0">{skill.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-bold text-[#1D1C1D] mb-1">
                      {skill.name}
                    </h3>
                    <p className="text-[13px] text-[#868686]">Not activated</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Activate All Button */}
          {!allActivated && (
            <div className="flex flex-col items-center pt-4 border-t border-[#DDDDDD]">
              <button
                onClick={handleActivateAll}
                className="w-full px-6 py-3 bg-[#007A5A] text-white font-semibold rounded-lg hover:bg-[#006B4E] transition-colors text-[14px] mb-3"
              >
                Activate All 6 Skills
              </button>
              <p className="text-[13px] text-[#868686] text-center">
                You control the trust boundary. Every action requires your approval until you tell me otherwise.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (state === 'complete') {
    return (
      <div ref={scrollContainerRef} className="h-full flex flex-col overflow-hidden bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        {showCompleteBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#E8F5E9] border-b border-green-200 px-6 py-3 shrink-0"
          >
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-[14px] font-semibold text-[#1D1C1D]">
                  ✓ 6 skills active · Supervised mode
                </p>
                <p className="text-[13px] text-[#616061] mt-0.5">
                  I'll show you everything before I act.
                </p>
              </div>
              <button
                onClick={() => onStateChange('skills')}
                className="text-[#1264A3] font-semibold text-[13px] hover:underline"
              >
                Manage skills →
              </button>
            </div>
          </motion.div>
        )}
        {/* Normal Today dashboard content renders below */}
        <div className="flex-1 overflow-hidden min-h-0">
          <SlackTodayView onNavigateToActivity={() => {}} />
        </div>
      </div>
    );
  }

  return null;
}
