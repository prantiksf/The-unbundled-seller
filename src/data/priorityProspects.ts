// Mock prospect data for Priority Prospects feature (N2A3)

export interface PriorityProspect {
  id: string;
  name: string;
  title: string;
  company: string;
  signals: string[];
  email: string;
  context: string; // Previous engagement context
  draftEmail: string; // Pre-filled email draft
  draftSubject?: string;
  step: string; // e.g., "BDR: High Touch"
  stepNumber: number; // Current step number
  totalSteps: number; // Total steps in workflow
  avatarUrl?: string; // Real photograph URL
  /** Determines which action UI to render in the Slackbot panel */
  actionType?: "email" | "agenda" | "contract";
  /** Agenda builder: pre-filled meeting title */
  meetingTitle?: string;
  /** Agenda builder: pre-filled agenda body */
  agendaContent?: string;
  /** Contract review: clause label */
  contractClause?: string;
  /** Contract review: clause excerpt */
  contractSnippet?: string;
}

export const PRIORITY_PROSPECTS: PriorityProspect[] = [
  {
    id: "prospect-1",
    name: "Ava Bennett",
    title: "Financial Director",
    company: "Cirrus",
    signals: ["Past Engagement", "Surging Intent"],
    email: "ava.bennett@cirrus.com",
    avatarUrl: "https://randomuser.me/api/portraits/med/women/75.jpg",
    context: "Ava was previously involved in a Closed - Lost deal on 3 calls and 4 emails.",
    draftEmail: `Hi Ava,

We last spoke in January about Cirrus's financial planning needs. I saw that you're hiring financial analysts and thought it would be a good time to reconnect.

I've been following Cirrus's growth trajectory, and I believe our platform could help streamline your financial operations as you scale. Would you be open to a brief conversation next week?

Best,
Rita`,
    draftSubject: "Let's reconnect",
    step: "BDR: High Touch",
    stepNumber: 1,
    totalSteps: 8,
  },
  {
    id: "prospect-2",
    name: "Noah Evans",
    title: "VP of Finance",
    company: "Connected Innovations",
    signals: ["Job Change"],
    email: "noah.evans@connectedinnovations.com",
    avatarUrl: "https://randomuser.me/api/portraits/med/men/22.jpg",
    context: "Noah recently joined Connected Innovations from TechStart where he was a champion.",
    draftEmail: `Hi Noah,

Congratulations on your new role at Connected Innovations! I noticed you've moved from TechStart, where we had some great conversations about financial automation.

I'd love to reconnect and see how we might help Connected Innovations achieve similar efficiency gains. Are you available for a quick call this week?

Best,
Rita`,
    draftSubject: "Agenda for our sync",
    step: "BDR: High Touch",
    stepNumber: 2,
    totalSteps: 8,
  },
  {
    id: "prospect-3",
    name: "Maya Chen",
    title: "CFO",
    company: "Velocity Systems",
    signals: ["Budget Cycle", "Intent Signal"],
    email: "maya.chen@velocitysystems.com",
    avatarUrl: "https://randomuser.me/api/portraits/med/women/44.jpg",
    context: "Velocity Systems is in Q1 budget planning. Maya engaged with our content last month.",
    draftEmail: `Hi Maya,

I noticed Velocity Systems is entering Q1 budget planning season. Given your engagement with our recent content on financial automation, I thought this might be a good time to discuss how we could support your planning process.

Would you be interested in a brief demo tailored to your current needs?

Best,
Rita`,
    draftSubject: "Budget planning touchpoint",
    step: "BDR: High Touch",
    stepNumber: 3,
    totalSteps: 8,
  },
  {
    id: "prospect-4",
    name: "James Rodriguez",
    title: "Director of Operations",
    company: "ScaleUp Inc",
    signals: ["Past Engagement", "Expansion Signal"],
    email: "james.rodriguez@scaleup.com",
    avatarUrl: "https://randomuser.me/api/portraits/med/men/33.jpg",
    context: "James was part of a deal that closed last year. Company is expanding operations.",
    draftEmail: `Hi James,

Great to see ScaleUp Inc expanding! I remember our successful collaboration last year, and I thought you might be interested in how our platform has evolved to support scaling operations.

Would you be open to a quick catch-up call to discuss what's new?

Best,
Rita`,
    draftSubject: "Quick catch-up on expansion plans",
    step: "BDR: High Touch",
    stepNumber: 4,
    totalSteps: 8,
  },
  {
    id: "prospect-5",
    name: "Sophie Kim",
    title: "VP of Strategy",
    company: "NextGen Solutions",
    signals: ["Intent Signal", "Content Engagement"],
    email: "sophie.kim@nextgensolutions.com",
    avatarUrl: "https://randomuser.me/api/portraits/med/women/65.jpg",
    context: "Sophie has been actively engaging with our thought leadership content.",
    draftEmail: `Hi Sophie,

I noticed you've been engaging with our content on strategic financial planning. Given NextGen Solutions' focus on innovation, I thought you might find value in a conversation about how we're helping similar companies streamline their operations.

Would you be available for a brief call next week?

Best,
Rita`,
    draftSubject: "Strategic planning sync",
    step: "BDR: High Touch",
    stepNumber: 5,
    totalSteps: 8,
  },
  {
    id: "prospect-6",
    name: "Diane Park",
    title: "CIO",
    company: "Acme Corp",
    signals: ["$60k ARR", "Stage 3"],
    email: "diane.p@acme.com",
    avatarUrl: "https://randomuser.me/api/portraits/med/women/21.jpg",
    context: "Clause 7.2 in the MSA is blocking procurement and needs legal alignment this week.",
    draftEmail: `Hi Diane,

Great seeing you earlier. As discussed, I attached the standard non-compete addendum to address legal's concerns around clause 7.2.

If this works on your end, we can move directly to provisioning this week.

Best,
Rita`,
    draftSubject: "Following up on Clause 7.2",
    step: "Contract Review",
    stepNumber: 6,
    totalSteps: 8,
  },
  {
    id: "prospect-7",
    name: "Liam Carter",
    title: "Head of RevOps",
    company: "Northstar Health",
    signals: ["Meeting in 2h", "Expansion"],
    email: "liam.carter@northstarhealth.com",
    avatarUrl: "https://randomuser.me/api/portraits/med/men/64.jpg",
    context: "Prep required for a 2 PM discovery on process bottlenecks and forecasting reliability.",
    draftEmail: `Hi Liam,

Looking forward to our 2 PM discovery session. I prepared a concise agenda around your RevOps workflow and forecasting pain points so we can make the best use of time.

See you soon.

Best,
Rita`,
    draftSubject: "Prep for our 2 PM session",
    step: "Discovery Call Prep",
    stepNumber: 7,
    totalSteps: 8,
  },
  {
    id: "prospect-8",
    name: "Priya Shah",
    title: "VP Procurement",
    company: "Greentech",
    signals: ["Top Opp", "Security Review"],
    email: "priya.shah@greentech.com",
    avatarUrl: "https://randomuser.me/api/portraits/med/women/33.jpg",
    context: "Security and procurement checklist is pending final sign-off for a high-value opportunity.",
    draftEmail: `Hi Priya,

Thanks again for partnering with us through the security review. I shared the requested SOC documentation and compliance notes for your final checklist.

Happy to jump on a quick call if it helps move this to sign-off.

Best,
Rita`,
    draftSubject: "Security checklist follow-up",
    step: "Top Opp Follow-up",
    stepNumber: 8,
    totalSteps: 8,
  },
];
