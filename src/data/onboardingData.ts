export interface ConnectedApp {
  name: string;
  icon: string;
  status: 'connected' | 'available' | 'unavailable';
}

export interface SkillPreviewLine {
  status?: 'green' | 'amber' | 'red';
  text: string;
}

export interface SalesSkill {
  id: string;
  name: string;
  icon: string;
  jtbd: string;
  description: string;
  signal: string;
  preview: SkillPreviewLine[];
  activated: boolean;
  // NEW fields for v4:
  type: 'proactive' | 'open-ended';           // proactive = system saw a trigger; open-ended = available
  triggerReason?: string;                       // only for proactive: "Because Meridian went quiet for 11 days"
  connectedApps: string[];                      // app icons to show: ["Gmail", "Gong", "Slack"]
}

export interface PipelineSummary {
  activeOpportunities: number;
  totalPipeline: number;
  needsAttention: number;
  closingThisMonth: number;
}

export interface FirstProof {
  callsLogged: number;
  followUpsDrafted: number;
  location: string;
}

export interface OnboardingData {
  isFirstOpen: boolean;
  connectionTimestamp: string;
  connectedApps: ConnectedApp[];
  pipelineSummary: PipelineSummary;
  skills: SalesSkill[];
  firstProof: FirstProof;
}

export const ONBOARDING_DATA: OnboardingData = {
  isFirstOpen: true,
  connectionTimestamp: "2026-01-02T08:45:00",
  connectedApps: [
    { name: "Gmail", icon: "✓", status: "connected" },
    { name: "Calendar", icon: "✓", status: "connected" },
    { name: "Gong", icon: "✓", status: "connected" },
    { name: "LinkedIn Sales Nav", icon: "✓", status: "connected" },
    { name: "DocuSign", icon: "✓", status: "connected" },
    { name: "Salesforce CPQ", icon: "✓", status: "connected" },
    { name: "Highspot", icon: "✓", status: "connected" },
  ],
  pipelineSummary: {
    activeOpportunities: 23,
    totalPipeline: 580000,
    needsAttention: 4,
    closingThisMonth: 2,
  },
  skills: [
    // ── PROACTIVE: System saw a trigger ──
    {
      id: "morning-briefing",
      name: "Morning Briefing",
      icon: "📍",
      jtbd: "Know Where I Stand",
      description: "Know where every deal stands before your first call.",
      signal: "You check pipeline every morning at ~8:15. I'll have this ready by 8:00.",
      triggerReason: "Because you have 23 active deals and I noticed you check pipeline every morning",
      connectedApps: ["Salesforce", "Gmail", "Calendar"],
      type: "proactive",
      preview: [
        { status: "green", text: "Acme Health · $180K · Closing Jan" },
        { status: "amber", text: "TechStart · $95K · Champion quiet" },
        { status: "red", text: "Meridian · $60K · No activity 11d" },
      ],
      activated: false,
    },
    {
      id: "auto-log",
      name: "Auto-Log & Follow-Up",
      icon: "⚡",
      jtbd: "Move The Deal Forward",
      description: "After every call: log it, draft the follow-up, update the deal. Zero clicks.",
      signal: "Gong + Calendar connected. I can hear your calls and act on them.",
      triggerReason: "Because you had 3 calls today and none were logged yet",
      connectedApps: ["Gong", "Calendar", "Gmail"],
      type: "proactive",
      preview: [
        { text: "Today: 3 calls logged · 2 follow-ups drafted · waiting in your Gmail" },
      ],
      activated: false,
    },
    {
      id: "risk-radar",
      name: "Risk Radar",
      icon: "🔍",
      jtbd: "Know What I Don't Know",
      description: "Catch the deal going sideways before the forecast call.",
      signal: "Cross-referencing Gmail, Gong, Slack, and LinkedIn activity on all deals.",
      triggerReason: "Because Meridian went quiet for 11 days and Priya's sentiment dropped",
      connectedApps: ["Gmail", "Gong", "Slack", "LinkedIn Sales Nav"],
      type: "proactive",
      preview: [
        { text: "Right now: 4 deals need attention" },
        { text: "Meridian: 11 days no response" },
        { text: "Priya@Acme: sentiment ↓ last 2 calls" },
      ],
      activated: false,
    },
    // ── OPEN-ENDED: Available, not triggered ──
    {
      id: "ask-anywhere",
      name: "@Ask Anywhere",
      icon: "💡",
      jtbd: "Get To The Right Answer Fast",
      description: "One question, instant answer — in Gmail, Docs, Slack, or any browser tab.",
      signal: "You switch between 6 apps daily. Average context hunt: 4 min. I'll make it 8 seconds.",
      connectedApps: ["Gmail", "Slack", "Gong", "Highspot"],
      type: "open-ended",
      preview: [
        { text: '"What terms did we quote Meridian in December?"' },
        { text: "→ $85K, 15% discount, approved by Sarah Chen on 12/14" },
      ],
      activated: false,
    },
    {
      id: "team-sync",
      name: "Team Context Sync",
      icon: "🤝",
      jtbd: "Bring The Team With Me",
      description: "Your SE, legal, and CSM get the right context without you copy-pasting it.",
      signal: "You have 4 SEs across active deals. I'll keep them briefed automatically.",
      connectedApps: ["Slack", "Salesforce", "Gmail"],
      type: "open-ended",
      preview: [
        { text: "Mike (SE) assigned to 4 of your deals" },
        { text: "Legal has 2 contracts pending" },
        { text: "Estimated coordination saved: 45 min/wk" },
      ],
      activated: false,
    },
    {
      id: "close-autopilot",
      name: "Close Autopilot",
      icon: "✍️",
      jtbd: "Close Without Friction",
      description: "Verbal yes → signed contract. No chasing, no 'just checking in' emails.",
      signal: "DocuSign + CPQ connected. I can generate, route, and chase.",
      connectedApps: ["DocuSign", "Salesforce CPQ", "Gmail"],
      type: "open-ended",
      preview: [
        { text: "2 deals in final stage right now" },
        { text: "Acme: contract ready, awaiting legal" },
        { text: "Est. time saved per close: 11 days → 2" },
      ],
      activated: false,
    },
  ],
  firstProof: {
    callsLogged: 3,
    followUpsDrafted: 2,
    location: "Gmail drafts",
  },
};
