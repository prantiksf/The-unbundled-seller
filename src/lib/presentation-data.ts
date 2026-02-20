export interface SceneData {
  id: number;
  isHero?: boolean;
  enabled: boolean;
  jtbd: string;
  name: string;
  subtitle?: string;
  sceneTag?: string;
  surface?: string;
  surfaceIcon?: string;
  slackbotRole?: string;
  commission: number;
  quotaPct: number;
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
  delta?: string;
  metrics?: Array<{
    val: string;
    lbl: string;
    cls: string;
  }>;
  pipeline?: {
    closed: number;
    inProgress: number;
    notStarted: number;
    lost: number;
    target: number;
  };
  protoUrl?: string | null;
  image?: string | null;
}

export interface UnbundlingStep {
  headline: string;
  sub: string;
  state: 'bundled' | 'transitioning' | 'unbundled';
  badge?: boolean;
  dissolve?: string[];
  insight?: string;
  insightSub?: string;
  showTransition?: boolean;
  crystallize?: boolean;
  celebrate?: boolean;
  showScenesBtn?: boolean;
  isLast?: boolean;
}

export interface UnbundlingTask {
  id: string;
  icon: string;
  text: string;
}

export const SCENES: SceneData[] = [
  {
    id: 0,
    isHero: true,
    enabled: true,
    jtbd: "The Invisible CRM",
    name: "Rita's Q1",
    commission: 0,
    quotaPct: 0,
  },
  {
    id: 1,
    enabled: true,
    jtbd: "Start the quarter on your terms",
    name: "Quarter Start",
    subtitle: "No spreadsheet. No forecast call. A conversation with a slider.",
    sceneTag: "Arc 1 · January 2 · 9:00 AM",
    commission: 0,
    quotaPct: 0,
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
    metrics: [
      { val: "3.2 hrs", lbl: "LOST TO QUARTERLY PLANNING", cls: "fric-v" },
      { val: "67%", lbl: "OF AES SANDBAG THEIR COMMIT", cls: "fric-v" },
      { val: "4 min", lbl: "TO APPROVE WITH INTELLIGENCE", cls: "intel-v" },
      { val: "$600K", lbl: "RITA'S PLAN — BELIEVED", cls: "intel-v" },
    ],
    pipeline: { closed: 0, inProgress: 250000, notStarted: 350000, lost: 0, target: 500000 },
    protoUrl: null,
    image: "/New Scene_01.png",
  },
  {
    id: 2,
    enabled: true,
    jtbd: "A deal dies. The machine hunts overnight.",
    name: "Deal Recovery",
    subtitle: "The worst moment in sales — followed by the most radical recovery.",
    sceneTag: "Arc 2 · January 18 · 7:00 AM",
    commission: 0,
    quotaPct: 0,
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
    metrics: [
      { val: "3 hrs", lbl: "MANUAL REPLACEMENT PROSPECTING", cls: "fric-v" },
      { val: "2 leads", lbl: "QUALIFIED BY NOON (OLD WORLD)", cls: "fric-v" },
      { val: "0 hrs", lbl: "RITA'S TIME TO RECOVER PIPELINE", cls: "intel-v" },
      { val: "14", lbl: "ACCOUNTS AGENT RESEARCHED OVERNIGHT", cls: "intel-v" },
    ],
    pipeline: { closed: 45000, inProgress: 280000, notStarted: 275000, lost: 72000, target: 500000 },
    protoUrl: null,
    image: "/New Scene_02.png",
  },
  {
    id: 3,
    enabled: true,
    jtbd: "The deal was cooling. She called from the street.",
    name: "Sentiment Detection",
    subtitle: "The machine heard what the email couldn't show.",
    sceneTag: "Arc 3 · January 29 · 8:20 AM",
    commission: 0,
    quotaPct: 0,
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
    metrics: [
      { val: "22%", lbl: "ENGAGEMENT SCORE DROP DETECTED", cls: "fric-v" },
      { val: "4×", lbl: "'CONCERNED' USED BY PRIYA ON CALL", cls: "fric-v" },
      { val: "$180K", lbl: "ACME DEAL AT RISK", cls: "intel-v" },
      { val: "11 min", lbl: "CALL FROM STREET. DEAL SAVED.", cls: "intel-v" },
    ],
    pipeline: { closed: 135000, inProgress: 420000, notStarted: 150000, lost: 72000, target: 500000 },
    protoUrl: null,
    image: "/New Scene_03.png",
  },
  {
    id: 4,
    enabled: true,
    jtbd: "She never switched context. Four deals moved",
    name: "Team Collaboration",
    subtitle: "The best CRM moment is the one the seller never notices.",
    sceneTag: "Arc 4 · February 3 · All Day",
    commission: 0,
    quotaPct: 0,
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
    metrics: [
      { val: "6", lbl: "BACKGROUND ANXIETIES DURING MEETINGS", cls: "fric-v" },
      { val: "2-3 hrs", lbl: "OLD WORLD TEAM COORDINATION", cls: "fric-v" },
      { val: "1 sec", lbl: "GLANCE. GREEN. MIND QUIET.", cls: "intel-v" },
      { val: "8 min", lbl: "DEAL ALIGNMENT IN ONE SLACK THREAD", cls: "intel-v" },
    ],
    pipeline: { closed: 340000, inProgress: 480000, notStarted: 80000, lost: 90000, target: 500000 },
    protoUrl: null,
    image: "/New Scene_04.png",
  },
  {
    id: 5,
    enabled: true,
    jtbd: "The deal closed while she was at lunch.",
    name: "Autonomous Close",
    subtitle: "The close she didn't have to chase. The lunch that seeded the next one.",
    sceneTag: "Arc 5 · February 14 · 12:45 PM",
    commission: 0,
    quotaPct: 0,
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
    metrics: [
      { val: "47 min", lbl: "AVG CLOSE-STAGE ADMIN PER DEAL", cls: "fric-v" },
      { val: "5", lbl: "MANUAL CHASE EMAILS SENT", cls: "fric-v" },
      { val: "0 min", lbl: "RITA'S CLOSE-STAGE TIME (GREENTECH)", cls: "intel-v" },
      { val: "$60K", lbl: "GREENTECH — CLOSED AUTONOMOUSLY", cls: "intel-v" },
    ],
    pipeline: { closed: 504000, inProgress: 350000, notStarted: 0, lost: 90000, target: 500000 },
    protoUrl: null,
    image: "/New Scene_05.png",
  },
  {
    id: 6,
    enabled: true,
    jtbd: "The system told her to stop. She listened.",
    name: "Capacity Management",
    subtitle: "No CRM has ever had the courage to say: enough.",
    sceneTag: "Arc 6 · February 22 · 8:00 AM",
    commission: 0,
    quotaPct: 0,
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
    metrics: [
      { val: "38%", lbl: "CLOSE RATE: SPREAD ACROSS 22 DEALS", cls: "fric-v" },
      { val: "129%", lbl: "RESPONSE TIME DEGRADATION DETECTED", cls: "fric-v" },
      { val: "75%", lbl: "CLOSE RATE: FOCUSED ON 4 DEALS", cls: "intel-v" },
      { val: "$20K", lbl: "UPSELL — FROM UNHURRIED LUNCH", cls: "intel-v" },
    ],
    pipeline: { closed: 504000, inProgress: 800000, notStarted: 0, lost: 120000, target: 500000 },
    protoUrl: null,
    image: "/New Scene_06.png",
  },
  {
    id: 7,
    enabled: true,
    jtbd: "Three decisions. Nine minutes. Her call.",
    name: "Multi-Surface Decisions",
    subtitle: "The machine escalated. The human decided. That's the deal.",
    sceneTag: "Arc 7 · March 4 · 2:15 PM",
    commission: 0,
    quotaPct: 0,
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
    metrics: [
      { val: "3", lbl: "SIMULTANEOUS DECISIONS REQUIRING RITA", cls: "fric-v" },
      { val: "2", lbl: "DEALS DELAYED IN OLD WORLD", cls: "fric-v" },
      { val: "9 min", lbl: "TOTAL RESOLUTION TIME (COFFEE SHOP)", cls: "intel-v" },
      { val: "$180K", lbl: "ACME DISCOUNT — RITA'S CALL", cls: "intel-v" },
    ],
    pipeline: { closed: 524000, inProgress: 420000, notStarted: 0, lost: 120000, target: 500000 },
    protoUrl: null,
    image: "/New Scene_07.png",
  },
  {
    id: 8,
    enabled: true,
    jtbd: "Five surfaces. Zero CRM navigations.",
    name: "Ambient CRM",
    subtitle: "The CRM as OS. Everywhere. Invoked. Ambient. Protective.",
    sceneTag: "Arc 8 · March 7 · All Day",
    commission: 0,
    quotaPct: 0,
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
    metrics: [
      { val: "11–14×", lbl: "DAILY SALESFORCE NAVIGATION SESSIONS", cls: "fric-v" },
      { val: "51 min", lbl: "DAILY OVERHEAD (OLD WORLD)", cls: "fric-v" },
      { val: "0×", lbl: "RITA'S CRM NAVIGATIONS TODAY", cls: "intel-v" },
      { val: "2m 16s", lbl: "TOTAL QUERY TIME WITH INTELLIGENCE", cls: "intel-v" },
    ],
    pipeline: { closed: 524000, inProgress: 420000, notStarted: 0, lost: 120000, target: 500000 },
    protoUrl: null,
    image: "/New Scene_08.png",
  },
  {
    id: 9,
    enabled: true,
    jtbd: "Revenue up. Software time down. The lines cross.",
    name: "Zero-Touch Proof",
    subtitle: "The chart that changes the conversation.",
    sceneTag: "Arc 9 · February 28 · 8:00 AM",
    commission: 0,
    quotaPct: 0,
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
    metrics: [
      { val: "47.3 hrs", lbl: "INDUSTRY AVG MONTHLY SOFTWARE TIME", cls: "fric-v" },
      { val: "~5%", lbl: "INDUSTRY ZERO-TOUCH CLOSE RATE", cls: "fric-v" },
      { val: "3h 47m", lbl: "RITA'S FEBRUARY SOFTWARE TIME", cls: "intel-v" },
      { val: "83%", lbl: "RITA'S AUTOMATION RATE (5 OF 6)", cls: "intel-v" },
    ],
    pipeline: { closed: 553000, inProgress: 250000, notStarted: 0, lost: 140000, target: 500000 },
    protoUrl: null,
    image: "/New Scene_09.png",
  },
  {
    id: 10,
    enabled: true,
    jtbd: "She was $47K short. She made the calls herself.",
    name: "Final Push",
    subtitle: "Earned. Not given. Relief, not triumph.",
    sceneTag: "Arc 10 · March 28–31 · Final Push",
    commission: 0,
    quotaPct: 0,
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
    metrics: [
      { val: "$47K", lbl: "GAP ON MARCH 28 — REAL, NOT HIDDEN", cls: "fric-v" },
      { val: "11 PM", lbl: "SPREADSHEET RECONCILING (OLD WORLD)", cls: "fric-v" },
      { val: "4 calls", lbl: "RITA MAKES HERSELF — NO AUTOMATION", cls: "intel-v" },
      { val: "126%", lbl: "FINAL ATTAINMENT — $631K", cls: "intel-v" },
    ],
    pipeline: { closed: 631000, inProgress: 120000, notStarted: 0, lost: 140000, target: 500000 },
    protoUrl: null,
    image: "/New Scene_10.png",
  },
];

export const UB_NOISE: UnbundlingTask[] = [
  { id: 'n1', icon: '📋', text: 'Update 14 CRM fields after every call' },
  { id: 'n2', icon: '🔍', text: 'Search Salesforce for contact history' },
  { id: 'n3', icon: '📧', text: 'Log every email activity manually' },
  { id: 'n4', icon: '📊', text: 'Reconcile forecast across 3 spreadsheets' },
  { id: 'n5', icon: '🔎', text: 'Research lead: LinkedIn → CRM → Docs' },
  { id: 'n6', icon: '⏰', text: 'Chase signature — "just checking in" emails' },
  { id: 'n7', icon: '📁', text: 'Find pricing deck buried in a Slack thread' },
  { id: 'n8', icon: '🗓️', text: 'Schedule → reschedule → confirm follow-up' },
  { id: 'n9', icon: '📝', text: 'Assemble meeting brief from 4 different tools' },
  { id: 'n10', icon: '📤', text: 'Send templated email, personalize for 3 seconds' },
  { id: 'n11', icon: '📈', text: 'Update pipeline view for Monday review' },
  { id: 'n12', icon: '🔄', text: 'Switch: Slack → Gmail → Salesforce → Docs' },
  { id: 'n13', icon: '📞', text: 'Enter call notes into CRM (15 min post-call)' },
  { id: 'n14', icon: '📌', text: 'Copy-paste context across systems for teammates' },
  { id: 'n15', icon: '⚙️', text: 'Generate activity report for manager' },
  { id: 'n16', icon: '📑', text: 'Navigate dashboards for pipeline anxiety' },
  { id: 'n17', icon: '🔗', text: 'Manually link deal to account in CRM' },
  { id: 'n18', icon: '✉️', text: 'Draft yet another "I wanted to follow up" email' },
];

export const UB_ESSENTIAL: UnbundlingTask[] = [
  { id: 'e1', icon: '🤝', text: 'Build genuine trust with buyers' },
  { id: 'e2', icon: '👂', text: 'Listen for the thing behind the thing' },
  { id: 'e3', icon: '🧠', text: 'Think strategically about each deal' },
  { id: 'e4', icon: '💡', text: 'Craft arguments that move decisions' },
  { id: 'e5', icon: '☕', text: 'Be fully present — coffee, lunch, a walk' },
  { id: 'e6', icon: '🔮', text: 'Read the room. Know when to push.' },
  { id: 'e7', icon: '💬', text: 'Have conversations that build real memory' },
  { id: 'e8', icon: '🌱', text: 'Mentor. Connect. Grow relationships.' },
  { id: 'e9', icon: '🏆', text: 'Close deals by being deeply human' },
];

export const UB_STEPS: UnbundlingStep[] = [
  {
    headline: "The <em>Bundled</em> Seller's Day",
    sub: '70% of this was never really your job',
    state: 'bundled',
    badge: true,
  },
  {
    headline: 'AI takes: <em>data entry & logging</em>',
    sub: 'None of this required a human',
    state: 'bundled',
    dissolve: ['n1', 'n2', 'n3', 'n6', 'n13'],
    insight: '"Updating CRM was never the job. It was the tax on the job."',
    insightSub: '2.5 hours per day — returned',
  },
  {
    headline: 'AI takes: <em>research & context assembly</em>',
    sub: 'Finding information — automated',
    state: 'bundled',
    dissolve: ['n5', 'n7', 'n9', 'n14', 'n16'],
    insight: '"Searching Salesforce was a symptom. Intelligence is the cure."',
    insightSub: '49 minutes per day — returned',
  },
  {
    headline: 'AI takes: <em>follow-ups, scheduling, admin</em>',
    sub: 'The logistics of selling — gone',
    state: 'bundled',
    dissolve: ['n8', 'n10', 'n11', 'n12', 'n15', 'n17', 'n18'],
    insight: '"Just checking in" was never a relationship. AI sends it. You build one.',
    insightSub: '12.5 hours per week — returned',
  },
  {
    headline: 'The <em>unbundling</em> is complete.',
    sub: '70% of the day — reclaimed',
    state: 'transitioning',
    dissolve: ['n4'],
    showTransition: true,
  },
  {
    headline: 'The <em class="green">Unbundled</em> Seller',
    sub: 'What was always the real job',
    state: 'unbundled',
    crystallize: true,
    insight: '"The seller\'s gift was never navigating software. It was being human."',
    insightSub: 'This is the only job that remains — and the only one that matters',
  },
  {
    headline: "Rita's Q1 — fully unbundled",
    sub: '$631K · 0 Salesforce logins · 126% quota',
    state: 'unbundled',
    celebrate: true,
    insight: '"The machine handled the machine work. The human did the human work."',
    insightSub: 'Both were better for it.',
    showScenesBtn: true,
    isLast: true,
  },
];
