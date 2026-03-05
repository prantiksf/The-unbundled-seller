"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import type { SalesSkill } from "@/data/onboardingData";
import { SlackbotMessagesTab } from "@/components/slackbot/SlackbotMessagesTab";
import { MessageInput } from "@/components/shared/MessageInput";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import {
  IconStar,
  IconPencil,
  IconX,
  IconPlus,
  IconMoreVertical,
} from "@/components/icons";

const T = SLACK_TOKENS;

type PanelTab = 'crm-skills' | 'messages' | 'history' | 'files' | 'add';

interface CRMSkillsPanelProps {
  skills: SalesSkill[];
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  onReloadToday: () => void;
  onClose?: () => void;
  onAdvanceScenario?: () => void;
}

let persistedActivations: Record<string, boolean> = {};

function EditIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

// App icon mapping to actual icon URLs
function getAppIconUrl(appName: string): string | null {
  const iconMap: Record<string, string> = {
    "Gmail": "https://cdn.simpleicons.org/gmail/EA4335",
    "Calendar": "https://cdn.simpleicons.org/googlecalendar/4285F4",
    "Gong": "https://cdn.simpleicons.org/gong/9334E6",
    "Slack": "https://cdn.simpleicons.org/slack/4A154B",
    "LinkedIn Sales Nav": "https://cdn.simpleicons.org/linkedin/0077B5",
    "DocuSign": "https://cdn.simpleicons.org/docusign/FFCC00",
    "Salesforce CPQ": "https://cdn.simpleicons.org/salesforce/00A1E0",
    "Salesforce": "https://cdn.simpleicons.org/salesforce/00A1E0",
    "Highspot": "https://cdn.simpleicons.org/highspot/FF6B35",
  };
  
  return iconMap[appName] || null;
}

function getAppColor(appName: string): { bg: string; text: string } {
  const colorMap: Record<string, { bg: string; text: string }> = {
    "Gmail": { bg: "#EA4335", text: "white" },
    "Calendar": { bg: "#4285F4", text: "white" },
    "Gong": { bg: "#9334E6", text: "white" },
    "Slack": { bg: "#4A154B", text: "white" },
    "LinkedIn Sales Nav": { bg: "#0077B5", text: "white" },
    "DocuSign": { bg: "#FFCC00", text: "black" },
    "Salesforce CPQ": { bg: "#00A1E0", text: "white" },
    "Salesforce": { bg: "#00A1E0", text: "white" },
    "Highspot": { bg: "#FF6B35", text: "white" },
  };
  
  return colorMap[appName] || { bg: "#868686", text: "white" };
}

function AppIcon({ app, index }: { app: string; index: number }) {
  const iconUrl = getAppIconUrl(app);
  const colors = getAppColor(app);
  const initials = app.substring(0, 2).toUpperCase();
  const [hasError, setHasError] = useState(false);
  
  return (
    <div
      className="w-6 h-6 rounded-full bg-white border-2 border-white flex items-center justify-center shadow-sm relative overflow-hidden flex-shrink-0"
      title={app}
      style={{ zIndex: 10 - index }}
    >
      {iconUrl && !hasError ? (
        <img
          src={iconUrl}
          alt={app}
          className="w-full h-full object-contain"
          style={{ display: 'block', padding: '2px' }}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-full rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.bg }}
        >
          <span className="text-[8px] font-bold leading-none" style={{ color: colors.text }}>
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}

function AppIconStack({ apps }: { apps: string[] }) {
  return (
    <div className="flex -space-x-1.5">
      {apps.slice(0, 3).map((app, i) => (
        <AppIcon key={i} app={app} index={i} />
      ))}
    </div>
  );
}

export function CRMSkillsPanel({ skills, activeTab, onTabChange, onReloadToday, onClose, onAdvanceScenario }: CRMSkillsPanelProps) {
  // Clone props to local state for editing/adding
  const [localSkills, setLocalSkills] = useState<SalesSkill[]>(skills);
  const [subTab, setSubTab] = useState<'recommended' | 'all'>('recommended');
  const [activations, setActivations] = useState<Record<string, boolean>>(() => ({ ...persistedActivations }));
  const [expandedId, setExpandedId] = useState<string | null>(skills.find((s) => s.type === 'proactive')?.id || null);
  
  // Messages tab state
  const [messagesHistory, setMessagesHistory] = useState<any[]>([]);
  const messagesTabSendRef = useRef<((message: string) => void) | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; jtbd: string; description: string; preview: string }>({
    name: '',
    jtbd: '',
    description: '',
    preview: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const displaySkills = localSkills.filter((s) => (subTab === 'recommended' ? s.type === 'proactive' : true));

  const handleToggleSkill = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivations((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      persistedActivations = next;
      return next;
    });
  };

  const toggleAccordion = (id: string) => {
    if (editingId) return; // Prevent collapse while editing
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const startEditing = (skill: SalesSkill, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(skill.id);
    setEditForm({
      name: skill.name,
      jtbd: skill.jtbd,
      description: skill.description,
      preview: skill.preview.map((p) => p.text).join('\n')
    });
    setExpandedId(skill.id);
  };

  const saveEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalSkills((prev) => prev.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          name: editForm.name,
          jtbd: editForm.jtbd,
          description: editForm.description,
          preview: editForm.preview.split('\n').filter((t) => t.trim() !== '').map((text) => ({ text, status: 'green' as const }))
        };
      }
      return s;
    }));
    setEditingId(null);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleCreateNew = () => {
    const newId = `custom-quota-tracker`; // Specific ID for our magic demo
    const newSkill: SalesSkill = {
      id: newId,
      name: "",
      icon: "📊",
      jtbd: "",
      description: "",
      preview: [],
      signal: "Created manually",
      type: 'open-ended',
      connectedApps: ["Salesforce", "Workday", "Spiff"],
      activated: false
    };
    setLocalSkills([...localSkills, newSkill]);
    setSubTab('all'); // Force switch to 'all' so they can see the new skill
    setExpandedId(newId);
    setEditingId(newId);
    setEditForm({ name: '', jtbd: '', description: '', preview: '' });
  };

  const handleMagicFill = () => {
    if (editingId !== 'custom-quota-tracker' || editForm.description !== '') return;
    
    // Auto-fill the inputs
    setEditForm(prev => ({
      ...prev,
      name: "Quota & Commission Tracker",
      jtbd: "Know My Earnings",
      description: "When my quarter ends send me a DM for past quarter performance and also help me model my upcoming quota and commission. Scan and connect to all the related and connected apps."
    }));

    // Trigger AI Shimmer for the result
    setIsGenerating(true);
    setTimeout(() => {
      setEditForm(prev => ({
        ...prev,
        preview: "Analyzing Workday & Salesforce data...\nQ4 Attainment: 112% ($145k / $130k)\nEstimated Q1 Commission Payout: $24,500\nConnected: Workday, Salesforce, Spiff"
      }));
      setIsGenerating(true); // Keep the shimmer alive for a split second longer
      setTimeout(() => setIsGenerating(false), 300);
    }, 1800);
  };

  // Native Slackbot Tabs
  const SLACK_TABS: { id: PanelTab; label: string }[] = [
    { id: 'crm-skills', label: 'CRM Skills' },
    { id: 'messages', label: 'Messages' },
    { id: 'history', label: 'History' },
    { id: 'files', label: 'Files' },
    { id: 'add', label: '+' }
  ];

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{
        backgroundColor: T.colors.background,
        borderLeft: `1px solid ${T.colors.border}`,
        fontFamily: T.typography.fontFamily,
      }}
    >
      {/* HEADER: Slackbot panel header */}
      <div className="border-b shrink-0" style={{ borderColor: T.colors.border }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Favorite">
              <IconStar width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
            </button>
            <Image src="/slackbot-logo.svg" alt="Slackbot" width={20} height={20} />
            <span className="font-semibold" style={{ fontSize: T.typography.body, color: T.colors.text }}>Slackbot</span>
          </div>
          <div className="flex items-center gap-0.5">
            <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Edit">
              <IconPencil width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
            </button>
            <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="More">
              <IconMoreVertical width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
            </button>
            <button type="button" onClick={onClose} className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Close">
              <IconX width={T.iconSizes.slackbotHeader} height={T.iconSizes.slackbotHeader} stroke="currentColor" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TABS (Native Slack Styling) */}
      <div className="flex items-center justify-between border-b shrink-0 px-2" style={{ borderColor: T.colors.border }}>
        <div className="flex">
          {SLACK_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-2.5 font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id ? "border-b-2" : "hover:text-[#1d1c1d]"
              }`}
              style={activeTab === tab.id ? { color: T.colors.link, borderBottomColor: T.colors.link, fontSize: T.typography.small } : { color: T.colors.textSecondary, fontSize: T.typography.small }}
            >
              <span>{tab.label}</span>
              {tab.id === 'crm-skills' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabChange('messages');
                  }}
                  className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                  title="Close CRM Skills tab"
                >
                  <IconX width={12} height={12} stroke="currentColor" />
                </button>
              )}
            </button>
          ))}
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors" title="Close panel">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Content area - matches SlackbotPanel structure exactly */}
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
        {activeTab === 'messages' && (
          <SlackbotMessagesTab 
            history={messagesHistory}
            onUpdateHistory={setMessagesHistory}
            onSendMessage={(sendFn) => { messagesTabSendRef.current = sendFn; }}
          />
        )}
        {(activeTab === 'history' || activeTab === 'files') && (
          <div className="p-4" style={{ fontSize: T.typography.small, color: T.colors.textSecondary }}>Coming soon.</div>
        )}
        {activeTab === 'crm-skills' && (
          <div className="flex flex-col flex-1 overflow-hidden">
          {/* SUB-TABS */}
          <div className="px-5 pt-5 pb-3 flex-shrink-0">
            <div className="flex bg-gray-200/60 p-1 rounded-lg">
              <button
                onClick={() => {
                  setSubTab('recommended');
                  setExpandedId(localSkills.find((s) => s.type === 'proactive')?.id || null);
                  setEditingId(null);
                }}
                className={`flex-1 py-1.5 text-[12px] font-bold rounded-md transition-all ${
                  subTab === 'recommended' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Recommended
              </button>
              <button
                onClick={() => {
                  setSubTab('all');
                  setExpandedId(null);
                  setEditingId(null);
                }}
                className={`flex-1 py-1.5 text-[12px] font-bold rounded-md transition-all ${
                  subTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Skills
              </button>
            </div>
          </div>

          {/* ACCORDION LIST */}
          <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-3">
            {displaySkills.map((skill) => {
              const isActive = !!activations[skill.id];
              const isExpanded = expandedId === skill.id;
              const isEditing = editingId === skill.id;

              return (
                <div
                  key={skill.id}
                  className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                    isActive && !isEditing ? 'border-green-200 bg-green-50/10' : 'border-gray-200 bg-white hover:border-gray-300'
                  } ${isExpanded ? 'shadow-sm' : ''}`}
                >
                  {/* ACCORDION HEADER */}
                  <button
                    onClick={() => toggleAccordion(skill.id)}
                    className="w-full flex items-center p-3 gap-3 text-left focus:outline-none group/header"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
                      {skill.icon}
                    </div>
                    <div className="flex-1 truncate">
                      {isEditing ? (
                        <input
                          value={editForm.name}
                          onChange={(e) => {
                            e.stopPropagation();
                            setEditForm({ ...editForm, name: e.target.value });
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full font-bold text-[14px] text-gray-900 border border-blue-300 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      ) : (
                        <span className="font-bold text-[14px] text-gray-900">{skill.name}</span>
                      )}
                    </div>

                    {!isEditing && isActive && (
                      <span className="px-2 py-0.5 bg-[#E8F5E9] text-[#007A5A] text-[10px] font-bold rounded-full uppercase tracking-wider border border-[#bbf2d1]">
                        Active
                      </span>
                    )}

                    {!isEditing && (
                      <div className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                      </div>
                    )}
                  </button>

                  {/* ACCORDION BODY */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                      {/* JOB */}
                      <div className="mb-4 mt-2 group/job">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Job</h4>
                          {!isEditing && (
                            <button
                              onClick={(e) => startEditing(skill, e)}
                              className="opacity-0 group-hover/job:opacity-100 text-gray-400 hover:text-blue-600 transition-all"
                            >
                              <EditIcon />
                            </button>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              placeholder="Job Category (e.g. Know Where I Stand)"
                              value={editForm.jtbd}
                              onChange={(e) => {
                                e.stopPropagation();
                                setEditForm({ ...editForm, jtbd: e.target.value });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full text-[12px] font-bold text-gray-700 border border-gray-200 rounded px-2 py-1 focus:border-blue-300 focus:outline-none"
                            />
                            <textarea
                              value={editForm.description}
                              onClick={handleMagicFill}
                              onChange={(e) => {
                                e.stopPropagation();
                                setEditForm({ ...editForm, description: e.target.value });
                              }}
                              placeholder="Describe what this skill should do... (Click to auto-fill)"
                              className="w-full text-[13px] text-gray-700 border border-blue-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-100 min-h-[60px] resize-none"
                            />
                          </div>
                        ) : (
                          <p className="text-[13px] text-gray-700 leading-snug">{skill.jtbd}: {skill.description}</p>
                        )}
                      </div>

                      {/* RESULT */}
                      <div className="mb-4 group/result">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Result</h4>
                          {!isEditing && (
                            <button
                              onClick={(e) => startEditing(skill, e)}
                              className="opacity-0 group-hover/result:opacity-100 text-gray-400 hover:text-blue-600 transition-all"
                            >
                              <EditIcon />
                            </button>
                          )}
                        </div>

                        {isEditing ? (
                          isGenerating ? (
                            <div className="bg-[#F8FAFC] border border-blue-200 rounded-xl p-3 space-y-2 animate-pulse">
                              <div className="flex items-center gap-2 text-[12px] text-blue-600 font-bold mb-2">
                                ✨ AI is generating skill logic...
                              </div>
                              <div className="h-2 bg-gray-200 rounded w-full"></div>
                              <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                              <div className="h-2 bg-gray-200 rounded w-4/6"></div>
                            </div>
                          ) : (
                            <textarea
                              value={editForm.preview}
                              onChange={(e) => {
                                e.stopPropagation();
                                setEditForm({ ...editForm, preview: e.target.value });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              placeholder="Expected result will appear here..."
                              className="w-full text-[12px] font-mono text-gray-700 bg-[#F8FAFC] border border-blue-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-100 min-h-[80px]"
                            />
                          )
                        ) : (
                          <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-3 space-y-1.5">
                            {skill.preview.map((line, i) => (
                              <div key={i} className="flex items-center gap-2 text-[12px] font-mono text-gray-700">
                                {line.status === 'green' && <div className="w-1.5 h-1.5 flex-shrink-0 rounded-full bg-[#2BAC76]" />}
                                {line.status === 'amber' && <div className="w-1.5 h-1.5 flex-shrink-0 rounded-full bg-[#F2C744]" />}
                                {line.status === 'red' && <div className="w-1.5 h-1.5 flex-shrink-0 rounded-full bg-[#E01E5A]" />}
                                {!line.status && <div className="w-1 h-1 flex-shrink-0 rounded-full bg-gray-300" />}
                                <span className="truncate">{line.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* WHY / APPS (Hidden while editing for cleaner UI) */}
                      {!isEditing && (
                        <div className="mb-4 flex items-end justify-between">
                          <div className="flex-1">
                            {skill.type === 'proactive' && skill.triggerReason && (
                              <p className="text-[11px] text-gray-500 leading-snug mb-2">
                                <span className="font-semibold text-blue-600">Why:</span> {skill.triggerReason.replace('Because ', '')}
                              </p>
                            )}
                          </div>
                          {skill.connectedApps && skill.connectedApps.length > 0 && (
                            <AppIconStack apps={skill.connectedApps} />
                          )}
                        </div>
                      )}

                      {/* ACTIONS */}
                      {isEditing ? (
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={cancelEdit}
                            className="flex-1 py-2 rounded-xl text-[13px] font-bold bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => {
                              saveEdit(skill.id, e);
                              if (skill.id === 'custom-quota-tracker' && onAdvanceScenario) {
                                onAdvanceScenario(); // TRIGGER NEXT SCENE!
                              }
                            }}
                            className="flex-1 py-2 rounded-xl text-[13px] font-bold bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 transition-all shadow-sm"
                          >
                            Save Skill
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleToggleSkill(skill.id, e)}
                          className={`w-full py-2.5 rounded-xl text-[13px] font-bold transition-all border ${
                            isActive
                              ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-red-600'
                              : 'bg-transparent text-gray-800 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {isActive ? 'Deactivate Skill' : 'Activate Skill'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* BOTTOM CTAS */}
            <div className="pt-2 pb-6 flex gap-3">
              <button
                onClick={handleCreateNew}
                className="flex-1 py-3 bg-white border border-gray-200 border-dashed rounded-xl text-[12px] font-bold text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="text-lg leading-none">+</span> Create
              </button>
              <button
                onClick={onReloadToday}
                className="flex-1 py-3 bg-[#4A154B] border border-transparent rounded-xl text-[12px] font-bold text-white hover:bg-[#611f69] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Reload Today
              </button>
            </div>
          </div>
          </div>
        )}
      </div>

      {/* Universal input style: use shared MessageInput directly - hidden for CRM Skills tab */}
      {activeTab !== 'crm-skills' && (
        <div className="shrink-0 border-t border-gray-200">
          <MessageInput
            placeholder="Message Slackbot..."
            onSendMessage={(message) => {
              if (activeTab === 'messages' && messagesTabSendRef.current) {
                messagesTabSendRef.current(message);
              } else {
                // Handle other tabs if needed
                console.log("Chat message:", message);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
