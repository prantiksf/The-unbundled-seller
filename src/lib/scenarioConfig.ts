// Scenario Configuration Interface
export interface ScenarioConfig {
  id: string; // Unique identifier (e.g., 'desktop-setup')
  internalName: string; // Display name for toggle menu (e.g., "Scene 1: Desktop Setup")
  isVisible: boolean; // Default visibility state
  device: 'desktop' | 'mobile' | 'watch'; // Device type for icon display
  description: string; // One-sentence description for hover cards and drawer
  coverPageData: {
    headerLine: string;
    headline: string;
    subHeadline?: string;
    metrics?: Array<{
      val: string;
      lbl: string;
      cls: string;
    }>;
    bgImage?: string | null;
    bundled?: {
      time: string;
      timePct: number;
      text: string;
    };
    unbundled?: {
      time: string;
      timePct: number;
      text: string;
    };
    pipeline?: {
      closed: number;
      inProgress: number;
      notStarted: number;
      lost: number;
      target: number;
    };
    quotaImpact?: {
      percent: number;
      value: number;
      total: number;
    };
  };
  prototypeComponent: string; // Component identifier (e.g., "Scene1", "DesktopSlackShell")
  prototypeVersions?: Array<{
    versionId: string;
    label: string;
    componentKey: string;
  }>;
  defaultVersionId?: string;
  sceneId: number; // Original scene ID from SCENES array
}

// Initial Scenarios Configuration - Ported from SCENES array
export const INITIAL_SCENARIOS: ScenarioConfig[] = [
  {
    id: "quarter-start",
    internalName: "Quarter Start",
    isVisible: true,
    device: "desktop",
    description: "Model the $500K gap and deploy Agentforce to build the MEDDICC Deal Room.",
    coverPageData: {
      headerLine: "Arc 1 · January 2 · 9:00 AM",
      headline: "Start the quarter on your terms",
      subHeadline: "No spreadsheet. No forecast call. A conversation with a slider.",
      metrics: [
        { val: "3.2 hrs", lbl: "LOST TO QUARTERLY PLANNING", cls: "fric-v" },
        { val: "67%", lbl: "OF AES SANDBAG THEIR COMMIT", cls: "fric-v" },
        { val: "4 min", lbl: "TO APPROVE WITH INTELLIGENCE", cls: "intel-v" },
        { val: "$600K", lbl: "RITA'S PLAN — BELIEVED", cls: "intel-v" },
      ],
      bgImage: "/New Scene_01.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Rita logs into Salesforce, opens a forecast spreadsheet, tabs between Clari, her manager's template, and last quarter's actuals. 3.2 hours of political alignment before she submits a number she doesn't fully believe in.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "Slack opens. @slackbot has modelled three scenarios overnight. Rita drags a slider. The machine's workload grows. Her hours stay flat. She approves $600K in 4 minutes and believes it for the first time.",
      },
      pipeline: { closed: 0, inProgress: 250000, notStarted: 350000, lost: 0, target: 500000 },
    },
    prototypeComponent: "Scene1",
    prototypeVersions: [
      { versionId: "v1", label: "V1 (Baseline)", componentKey: "SlackMyDay_V1" },
      { versionId: "v2", label: "V2 (XLT Feedback)", componentKey: "SlackMyDay_V2" },
    ],
    defaultVersionId: "v1",
    sceneId: 1,
  },
  {
    id: "mobile-pulse",
    internalName: "The Mobile Pulse",
    isVisible: true,
    device: "mobile",
    description: "Approve the final 15% discount on the go via the Slack mobile widget.",
    coverPageData: {
      headerLine: "ARC 1 · SCENE 2",
      headline: "The deal doesn't wait for your desk.",
      subHeadline: "Velocity continues en route with 1-tap mobile execution.",
      metrics: [
        { val: "3 hrs", lbl: "Action Time", cls: "fric-v" },
        { val: "Zero", lbl: "System Access", cls: "fric-v" },
        { val: "10 sec", lbl: "Action Time", cls: "intel-v" },
        { val: "100%", lbl: "System Access", cls: "intel-v" },
      ],
      bgImage: "/New Scene_02.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Rita is stuck in transit between client meetings. A champion desperately needs final pricing approval, but Rita can't access her CPQ tools from her phone. The deal stalls.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "Agentforce intercepts the finance approval and surfaces it directly to Rita's Slack mobile widget. She reviews the AI-generated context and approves the 15% discount with a single tap.",
      },
      pipeline: { closed: 0, inProgress: 250000, notStarted: 350000, lost: 0, target: 500000 },
    },
    prototypeComponent: "MobilePulsePlaceholder",
    sceneId: 11,
  },
  {
    id: "watch-win",
    internalName: "The Watch Win",
    isVisible: true,
    device: "watch",
    description: "The contract completes autonomously with a wrist notification on the golf course.",
    coverPageData: {
      headerLine: "ARC 1 · SCENE 3",
      headline: "Closing a $500K deal from the 14th hole.",
      subHeadline: "When the machine handles the mechanics, sellers focus on human connection.",
      metrics: [
        { val: "5 hrs", lbl: "Chasing Signatures", cls: "fric-v" },
        { val: "Desk-bound", lbl: "Seller Location", cls: "fric-v" },
        { val: "0 hrs", lbl: "Chasing Signatures", cls: "intel-v" },
        { val: "Anywhere", lbl: "Seller Location", cls: "intel-v" },
      ],
      bgImage: "/New Scene_03.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Closing a strategic deal requires Rita to be glued to her inbox, anxiously chasing procurement and legal teams for final signatures, sacrificing critical face-time with other clients.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "While Rita builds rapport with a new prospect on the golf course, Agentforce autonomously completes the final contract handshakes. The $500K victory simply vibrates on her wrist.",
      },
      pipeline: { closed: 0, inProgress: 250000, notStarted: 350000, lost: 0, target: 500000 },
    },
    prototypeComponent: "Scene2",
    prototypeVersions: [
      { versionId: "v1", label: "V1 (Baseline)", componentKey: "WatchWin_V1" },
      { versionId: "v2", label: "V2 (XLT Feedback)", componentKey: "WatchWin_V2" },
    ],
    defaultVersionId: "v2",
    sceneId: 12,
  },
  {
    id: "deal-recovery",
    internalName: "Deal Recovery",
    isVisible: true,
    device: "desktop",
    description: "The prospecting agent works overnight to replace lost deals while Rita sleeps.",
    coverPageData: {
      headerLine: "Arc 2 · January 18 · 7:00 AM",
      headline: "A deal dies. The machine hunts overnight.",
      subHeadline: "The worst moment in sales — followed by the most radical recovery.",
      metrics: [
        { val: "3 hrs", lbl: "MANUAL REPLACEMENT PROSPECTING", cls: "fric-v" },
        { val: "2 leads", lbl: "QUALIFIED BY NOON (OLD WORLD)", cls: "fric-v" },
        { val: "0 hrs", lbl: "RITA'S TIME TO RECOVER PIPELINE", cls: "intel-v" },
        { val: "14", lbl: "ACCOUNTS AGENT RESEARCHED OVERNIGHT", cls: "intel-v" },
      ],
      bgImage: "/New Scene_04.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Rita gets a loss email. She spends the next 3 hours manually researching replacement accounts in Salesforce, LinkedIn, and ZoomInfo — opens 14 tabs, qualifies 2 leads by noon, exhausted and behind.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "Rita gets the loss notification at 7 AM. By the time she opens her laptop at 9 AM, the prospecting agent has already worked overnight — researched 14 accounts, sent 6 sequences, booked 2 discovery calls, and left 3 warm responses for her review.",
      },
      pipeline: { closed: 45000, inProgress: 280000, notStarted: 275000, lost: 72000, target: 500000 },
    },
    prototypeComponent: "DesktopSlackShell",
    sceneId: 2,
  },
  {
    id: "sentiment-detection",
    internalName: "Sentiment Detection",
    isVisible: true,
    device: "watch",
    description: "Real-time sentiment alerts on her watch trigger a critical save call from the street.",
    coverPageData: {
      headerLine: "Arc 3 · January 29 · 8:20 AM",
      headline: "The deal was cooling. She called from the street.",
      subHeadline: "The machine heard what the email couldn't show.",
      metrics: [
        { val: "22%", lbl: "ENGAGEMENT SCORE DROP DETECTED", cls: "fric-v" },
        { val: "4×", lbl: "'CONCERNED' USED BY PRIYA ON CALL", cls: "fric-v" },
        { val: "$180K", lbl: "ACME DEAL AT RISK", cls: "intel-v" },
        { val: "11 min", lbl: "CALL FROM STREET. DEAL SAVED.", cls: "intel-v" },
      ],
      bgImage: "/New Scene_05.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Rita has no visibility into buyer sentiment between touchpoints. She finds out Priya is disengaged when Priya stops responding to emails — by then the deal is cold and a competitor is in the room.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "During a recorded call, @slackbot detects sentiment shift in real time. Priya used 'concerned' 4 times. Engagement dropped 22%. Rita's watch taps on her commute. She calls from the street. The deal is saved before it turns cold.",
      },
      pipeline: { closed: 135000, inProgress: 420000, notStarted: 150000, lost: 72000, target: 500000 },
    },
    prototypeComponent: "Scene2",
    sceneId: 3,
  },
  {
    id: "team-collaboration",
    internalName: "Team Collaboration",
    isVisible: true,
    device: "watch",
    description: "A green watch signal quiets her mind, then the team aligns four deals in one Slack thread.",
    coverPageData: {
      headerLine: "Arc 4 · February 3 · All Day",
      headline: "She never switched context. Four deals moved",
      subHeadline: "The best CRM moment is the one the seller never notices.",
      metrics: [
        { val: "6", lbl: "BACKGROUND ANXIETIES DURING MEETINGS", cls: "fric-v" },
        { val: "2-3 hrs", lbl: "OLD WORLD TEAM COORDINATION", cls: "fric-v" },
        { val: "1 sec", lbl: "GLANCE. GREEN. MIND QUIET.", cls: "intel-v" },
        { val: "8 min", lbl: "DEAL ALIGNMENT IN ONE SLACK THREAD", cls: "intel-v" },
      ],
      bgImage: "/New Scene_06.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Rita's mind runs 6 background threads during every meeting — what's happening in the pipeline, what she's missing, what's unlogged. Her team coordinates across 5 apps and a scheduling meeting to get one appendix written.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "The watch is green and silent. Rita hears the $40K signal because her mind is quiet. Then her team collaborates on Acme in 8 minutes flat — across Slack, Docs, Gmail — without a meeting, without leaving the thread.",
      },
      pipeline: { closed: 340000, inProgress: 480000, notStarted: 80000, lost: 90000, target: 500000 },
    },
    prototypeComponent: "Scene2",
    sceneId: 4,
  },
  {
    id: "autonomous-close",
    internalName: "Autonomous Close",
    isVisible: true,
    device: "watch",
    description: "A silent haptic notification confirms the deal closed while she was fully present at lunch.",
    coverPageData: {
      headerLine: "Arc 5 · February 14 · 12:45 PM",
      headline: "The deal closed while she was at lunch.",
      subHeadline: "The close she didn't have to chase. The lunch that seeded the next one.",
      metrics: [
        { val: "47 min", lbl: "AVG CLOSE-STAGE ADMIN PER DEAL", cls: "fric-v" },
        { val: "5", lbl: "MANUAL CHASE EMAILS SENT", cls: "fric-v" },
        { val: "0 min", lbl: "RITA'S CLOSE-STAGE TIME (GREENTECH)", cls: "intel-v" },
        { val: "$60K", lbl: "GREENTECH — CLOSED AUTONOMOUSLY", cls: "intel-v" },
      ],
      bgImage: "/New Scene_07.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Rita sends 5 'just checking in' emails, makes 3 follow-up calls, and checks Salesforce 8 times in the final 2 days before a deal closes. She is half-present in every meeting during this window.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "The contract was sent at the optimal time by the system. It tracked the signing in real time. Rita's phone lit up silently at 12:45 PM. One haptic on her watch. She didn't even unlock her phone. She was fully present with Diane.",
      },
      pipeline: { closed: 504000, inProgress: 350000, notStarted: 0, lost: 90000, target: 500000 },
    },
    prototypeComponent: "DesktopSlackShell",
    prototypeVersions: [
      { versionId: "v1", label: "V1 (Baseline)", componentKey: "AutoClose_V1" },
      { versionId: "v2", label: "V2 (XLT Feedback)", componentKey: "AutoClose_V2" },
    ],
    defaultVersionId: "v1",
    sceneId: 5,
  },
  {
    id: "capacity-management",
    internalName: "Capacity Management",
    isVisible: true,
    device: "desktop",
    description: "The system flags degradation and recommends stopping prospecting to focus on four deals.",
    coverPageData: {
      headerLine: "Arc 6 · February 22 · 8:00 AM",
      headline: "The system told her to stop. She listened.",
      subHeadline: "No CRM has ever had the courage to say: enough.",
      metrics: [
        { val: "38%", lbl: "CLOSE RATE: SPREAD ACROSS 22 DEALS", cls: "fric-v" },
        { val: "129%", lbl: "RESPONSE TIME DEGRADATION DETECTED", cls: "fric-v" },
        { val: "75%", lbl: "CLOSE RATE: FOCUSED ON 4 DEALS", cls: "intel-v" },
        { val: "$20K", lbl: "UPSELL — FROM UNHURRIED LUNCH", cls: "intel-v" },
      ],
      bgImage: "/New Scene_08.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Rita's pipeline grows to $3.4M. Every tool celebrates it. The leaderboard ranks her #2. Her manager says 'keep going.' Nobody sees her response time degrading, her personalization dropping, her close rate quietly falling.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "@slackbot flags the degradation before Rita sees the consequences. Response time up 129%. Personalization down 31%. The system recommends she stop prospecting and focus on 4 deals. She does. She closes 3 of 4 at 75%.",
      },
      pipeline: { closed: 504000, inProgress: 800000, notStarted: 0, lost: 120000, target: 500000 },
    },
    prototypeComponent: "DesktopSlackShell",
    sceneId: 6,
  },
  {
    id: "multi-surface-decisions",
    internalName: "Multi-Surface Decisions",
    isVisible: true,
    device: "mobile",
    description: "Three simultaneous decisions resolved in nine minutes across iPhone and MacBook from a coffee shop.",
    coverPageData: {
      headerLine: "Arc 7 · March 4 · 2:15 PM",
      headline: "Three decisions. Nine minutes. Her call.",
      subHeadline: "The machine escalated. The human decided. That's the deal.",
      metrics: [
        { val: "3", lbl: "SIMULTANEOUS DECISIONS REQUIRING RITA", cls: "fric-v" },
        { val: "2", lbl: "DEALS DELAYED IN OLD WORLD", cls: "fric-v" },
        { val: "9 min", lbl: "TOTAL RESOLUTION TIME (COFFEE SHOP)", cls: "intel-v" },
        { val: "$180K", lbl: "ACME DISCOUNT — RITA'S CALL", cls: "intel-v" },
      ],
      bgImage: "/New Scene_09.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Three deal decisions arrive across three channels — email, Slack, a CRM notification — while Rita is in a meeting. By the time she processes them after the meeting, 2 of the 3 decisions are time-sensitive and one opportunity has already moved forward without her.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "Three decisions arrive simultaneously. Rita's watch flags all three in priority order. She's in a coffee shop. She opens her iPhone, handles two, escalates one to her MacBook for the complex legal clause. Nine minutes. All three resolved.",
      },
      pipeline: { closed: 524000, inProgress: 420000, notStarted: 0, lost: 120000, target: 500000 },
    },
    prototypeComponent: "Scene2",
    sceneId: 7,
  },
  {
    id: "ambient-crm",
    internalName: "Ambient CRM",
    isVisible: true,
    device: "desktop",
    description: "Five interaction surfaces return 49 minutes per day as the CRM becomes ambient and reflexive.",
    coverPageData: {
      headerLine: "Arc 8 · March 7 · All Day",
      headline: "Five surfaces. Zero CRM navigations.",
      subHeadline: "The CRM as OS. Everywhere. Invoked. Ambient. Protective.",
      metrics: [
        { val: "11–14×", lbl: "DAILY SALESFORCE NAVIGATION SESSIONS", cls: "fric-v" },
        { val: "51 min", lbl: "DAILY OVERHEAD (OLD WORLD)", cls: "fric-v" },
        { val: "0×", lbl: "RITA'S CRM NAVIGATIONS TODAY", cls: "intel-v" },
        { val: "2m 16s", lbl: "TOTAL QUERY TIME WITH INTELLIGENCE", cls: "intel-v" },
      ],
      bgImage: "/New Scene_10.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Rita navigates to Salesforce 11–14 times per day for quick facts. Each detour: 4 min 20 sec average. Total: 47–51 min of pure navigation overhead. Each switch breaks a cognitive state she has to rebuild.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "Five interaction patterns across the desktop — native layer, floating bar, PDF panel, Chrome sidebar, document triage panel — return 49 minutes per day to Rita. The CRM stopped being a destination. It became a reflex.",
      },
      pipeline: { closed: 524000, inProgress: 420000, notStarted: 0, lost: 120000, target: 500000 },
    },
    prototypeComponent: "DesktopSlackShell",
    sceneId: 8,
  },
  {
    id: "zero-touch-proof",
    internalName: "Zero-Touch Proof",
    isVisible: true,
    device: "desktop",
    description: "Revenue up, software time down: the chart that proves automation without sacrifice.",
    coverPageData: {
      headerLine: "Arc 9 · February 28 · 8:00 AM",
      headline: "Revenue up. Software time down. The lines cross.",
      subHeadline: "The chart that changes the conversation.",
      metrics: [
        { val: "47.3 hrs", lbl: "INDUSTRY AVG MONTHLY SOFTWARE TIME", cls: "fric-v" },
        { val: "~5%", lbl: "INDUSTRY ZERO-TOUCH CLOSE RATE", cls: "fric-v" },
        { val: "3h 47m", lbl: "RITA'S FEBRUARY SOFTWARE TIME", cls: "intel-v" },
        { val: "83%", lbl: "RITA'S AUTOMATION RATE (5 OF 6)", cls: "intel-v" },
      ],
      bgImage: "/New Scene_11.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "February last year: Rita worked until 9 PM most nights. 47+ hours in software. Logging activities, chasing signatures, reconciling forecasts. She hit quota but missed her accelerator by $31K. She earned $4,200 less than she should have — Mia's summer camp.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "February this year: $28,400 commission. 3 hours 47 minutes of software time. Home by 5:30 every day. Bedtime with Mia every night. Two date nights. She also mentored a junior rep — because she had the bandwidth.",
      },
      pipeline: { closed: 553000, inProgress: 250000, notStarted: 0, lost: 140000, target: 500000 },
    },
    prototypeComponent: "DesktopSlackShell",
    sceneId: 9,
  },
  {
    id: "final-push",
    internalName: "Final Push",
    isVisible: true,
    device: "mobile",
    description: "The system shows the $47K gap clearly, enabling four strategic calls that close the quarter.",
    coverPageData: {
      headerLine: "Arc 10 · March 28–31 · Final Push",
      headline: "She was $47K short. She made the calls herself.",
      subHeadline: "Earned. Not given. Relief, not triumph.",
      metrics: [
        { val: "$47K", lbl: "GAP ON MARCH 28 — REAL, NOT HIDDEN", cls: "fric-v" },
        { val: "11 PM", lbl: "SPREADSHEET RECONCILING (OLD WORLD)", cls: "fric-v" },
        { val: "4 calls", lbl: "RITA MAKES HERSELF — NO AUTOMATION", cls: "intel-v" },
        { val: "126%", lbl: "FINAL ATTAINMENT — $631K", cls: "intel-v" },
      ],
      bgImage: "/New Scene_12.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "March 28 last year: frantic CRM scramble. Rita was spreadsheet-reconciling at 11 PM, making desperate follow-up calls, manually scrubbing the pipeline with her manager. The quarter felt like survival.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "March 28 this year: Rita is $47K short with 3 days left. No magic — the system shows the gap clearly. She opens ChatGPT on her iPad, talks through the path to $600K, makes 4 calls herself. Two deals close on March 30. One notification on March 31.",
      },
      pipeline: { closed: 631000, inProgress: 120000, notStarted: 0, lost: 140000, target: 500000 },
    },
    prototypeComponent: "DesktopSlackShell",
    sceneId: 10,
  },
  {
    id: "slack-jtbd-1",
    internalName: "Zero-Day Value",
    isVisible: true,
    device: "desktop",
    description: "Model the $500K gap and deploy Agentforce to build the MEDDICC Deal Room.",
    coverPageData: {
      headerLine: "Arc 1 · January 2 · 9:00 AM",
      headline: "Start the quarter on your terms",
      subHeadline: "No spreadsheet. No forecast call. A conversation with a slider.",
      metrics: [
        { val: "3.2 hrs", lbl: "LOST TO QUARTERLY PLANNING", cls: "fric-v" },
        { val: "67%", lbl: "OF AES SANDBAG THEIR COMMIT", cls: "fric-v" },
        { val: "4 min", lbl: "TO APPROVE WITH INTELLIGENCE", cls: "intel-v" },
        { val: "$600K", lbl: "RITA'S PLAN — BELIEVED", cls: "intel-v" },
      ],
      bgImage: "/New Scene_01.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Rita logs into Salesforce, opens a forecast spreadsheet, tabs between Clari, her manager's template, and last quarter's actuals. 3.2 hours of political alignment before she submits a number she doesn't fully believe in.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "Slack opens. @slackbot has modelled three scenarios overnight. Rita drags a slider. The machine's workload grows. Her hours stay flat. She approves $600K in 4 minutes and believes it for the first time.",
      },
      pipeline: { closed: 0, inProgress: 250000, notStarted: 350000, lost: 0, target: 500000 },
    },
    prototypeComponent: "Scene1",
    sceneId: 201,
  },
  {
    id: "slack-jtbd-2",
    internalName: "Proactive Modeling",
    isVisible: true,
    device: "desktop",
    description: "Model the $500K gap and deploy Agentforce to build the MEDDICC Deal Room.",
    coverPageData: {
      headerLine: "Arc 1 · January 2 · 9:00 AM",
      headline: "Start the quarter on your terms",
      subHeadline: "No spreadsheet. No forecast call. A conversation with a slider.",
      metrics: [
        { val: "3.2 hrs", lbl: "LOST TO QUARTERLY PLANNING", cls: "fric-v" },
        { val: "67%", lbl: "OF AES SANDBAG THEIR COMMIT", cls: "fric-v" },
        { val: "4 min", lbl: "TO APPROVE WITH INTELLIGENCE", cls: "intel-v" },
        { val: "$600K", lbl: "RITA'S PLAN — BELIEVED", cls: "intel-v" },
      ],
      bgImage: "/New Scene_01.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Rita logs into Salesforce, opens a forecast spreadsheet, tabs between Clari, her manager's template, and last quarter's actuals. 3.2 hours of political alignment before she submits a number she doesn't fully believe in.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "Slack opens. @slackbot has modelled three scenarios overnight. Rita drags a slider. The machine's workload grows. Her hours stay flat. She approves $600K in 4 minutes and believes it for the first time.",
      },
      pipeline: { closed: 0, inProgress: 250000, notStarted: 350000, lost: 0, target: 500000 },
    },
    prototypeComponent: "Scene1",
    sceneId: 202,
  },
  {
    id: "slack-jtbd-3",
    internalName: "High-Velocity Execution",
    isVisible: true,
    device: "desktop",
    description: "Model the $500K gap and deploy Agentforce to build the MEDDICC Deal Room.",
    coverPageData: {
      headerLine: "Arc 1 · January 2 · 9:00 AM",
      headline: "Start the quarter on your terms",
      subHeadline: "No spreadsheet. No forecast call. A conversation with a slider.",
      metrics: [
        { val: "3.2 hrs", lbl: "LOST TO QUARTERLY PLANNING", cls: "fric-v" },
        { val: "67%", lbl: "OF AES SANDBAG THEIR COMMIT", cls: "fric-v" },
        { val: "4 min", lbl: "TO APPROVE WITH INTELLIGENCE", cls: "intel-v" },
        { val: "$600K", lbl: "RITA'S PLAN — BELIEVED", cls: "intel-v" },
      ],
      bgImage: "/New Scene_01.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Rita logs into Salesforce, opens a forecast spreadsheet, tabs between Clari, her manager's template, and last quarter's actuals. 3.2 hours of political alignment before she submits a number she doesn't fully believe in.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "Slack opens. @slackbot has modelled three scenarios overnight. Rita drags a slider. The machine's workload grows. Her hours stay flat. She approves $600K in 4 minutes and believes it for the first time.",
      },
      pipeline: { closed: 0, inProgress: 250000, notStarted: 350000, lost: 0, target: 500000 },
    },
    prototypeComponent: "Scene1",
    sceneId: 203,
  },
  {
    id: "slack-jtbd-4",
    internalName: "High-Velocity Execution",
    isVisible: true,
    device: "desktop",
    description: "Model the $500K gap and deploy Agentforce to build the MEDDICC Deal Room.",
    coverPageData: {
      headerLine: "Arc 1 · January 2 · 9:00 AM",
      headline: "Start the quarter on your terms",
      subHeadline: "No spreadsheet. No forecast call. A conversation with a slider.",
      metrics: [
        { val: "3.2 hrs", lbl: "LOST TO QUARTERLY PLANNING", cls: "fric-v" },
        { val: "67%", lbl: "OF AES SANDBAG THEIR COMMIT", cls: "fric-v" },
        { val: "4 min", lbl: "TO APPROVE WITH INTELLIGENCE", cls: "intel-v" },
        { val: "$600K", lbl: "RITA'S PLAN — BELIEVED", cls: "intel-v" },
      ],
      bgImage: "/New Scene_01.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Rita logs into Salesforce, opens a forecast spreadsheet, tabs between Clari, her manager's template, and last quarter's actuals. 3.2 hours of political alignment before she submits a number she doesn't fully believe in.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "Slack opens. @slackbot has modelled three scenarios overnight. Rita drags a slider. The machine's workload grows. Her hours stay flat. She approves $600K in 4 minutes and believes it for the first time.",
      },
      pipeline: { closed: 0, inProgress: 250000, notStarted: 350000, lost: 0, target: 500000 },
    },
    prototypeComponent: "Scene1",
    sceneId: 204,
  },
  {
    id: "slack-jtbd-5",
    internalName: "Generic Shell",
    isVisible: true,
    device: "desktop",
    description: "Model the $500K gap and deploy Agentforce to build the MEDDICC Deal Room.",
    coverPageData: {
      headerLine: "Arc 1 · January 2 · 9:00 AM",
      headline: "Start the quarter on your terms",
      subHeadline: "No spreadsheet. No forecast call. A conversation with a slider.",
      metrics: [
        { val: "3.2 hrs", lbl: "LOST TO QUARTERLY PLANNING", cls: "fric-v" },
        { val: "67%", lbl: "OF AES SANDBAG THEIR COMMIT", cls: "fric-v" },
        { val: "4 min", lbl: "TO APPROVE WITH INTELLIGENCE", cls: "intel-v" },
        { val: "$600K", lbl: "RITA'S PLAN — BELIEVED", cls: "intel-v" },
      ],
      bgImage: "/New Scene_01.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Rita logs into Salesforce, opens a forecast spreadsheet, tabs between Clari, her manager's template, and last quarter's actuals. 3.2 hours of political alignment before she submits a number she doesn't fully believe in.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "Slack opens. @slackbot has modelled three scenarios overnight. Rita drags a slider. The machine's workload grows. Her hours stay flat. She approves $600K in 4 minutes and believes it for the first time.",
      },
      pipeline: { closed: 0, inProgress: 250000, notStarted: 350000, lost: 0, target: 500000 },
    },
    prototypeComponent: "Scene1",
    sceneId: 205,
  },
  {
    id: "slack-jtbd-6",
    internalName: "Generic Shell",
    isVisible: true,
    device: "desktop",
    description: "Model the $500K gap and deploy Agentforce to build the MEDDICC Deal Room.",
    coverPageData: {
      headerLine: "Arc 1 · January 2 · 9:00 AM",
      headline: "Start the quarter on your terms",
      subHeadline: "No spreadsheet. No forecast call. A conversation with a slider.",
      metrics: [
        { val: "3.2 hrs", lbl: "LOST TO QUARTERLY PLANNING", cls: "fric-v" },
        { val: "67%", lbl: "OF AES SANDBAG THEIR COMMIT", cls: "fric-v" },
        { val: "4 min", lbl: "TO APPROVE WITH INTELLIGENCE", cls: "intel-v" },
        { val: "$600K", lbl: "RITA'S PLAN — BELIEVED", cls: "intel-v" },
      ],
      bgImage: "/New Scene_01.png",
      bundled: {
        time: "",
        timePct: 0,
        text: "Rita logs into Salesforce, opens a forecast spreadsheet, tabs between Clari, her manager's template, and last quarter's actuals. 3.2 hours of political alignment before she submits a number she doesn't fully believe in.",
      },
      unbundled: {
        time: "",
        timePct: 0,
        text: "Slack opens. @slackbot has modelled three scenarios overnight. Rita drags a slider. The machine's workload grows. Her hours stay flat. She approves $600K in 4 minutes and believes it for the first time.",
      },
      pipeline: { closed: 0, inProgress: 250000, notStarted: 350000, lost: 0, target: 500000 },
    },
    prototypeComponent: "Scene1",
    sceneId: 206,
  },
];
