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
  step: string; // e.g., "BDR: High Touch"
  stepNumber: number; // Current step number
  totalSteps: number; // Total steps in workflow
  avatarUrl?: string; // Real photograph URL
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
    step: "BDR: High Touch",
    stepNumber: 1,
    totalSteps: 5,
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
    step: "BDR: High Touch",
    stepNumber: 2,
    totalSteps: 5,
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
    step: "BDR: High Touch",
    stepNumber: 3,
    totalSteps: 5,
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
    step: "BDR: High Touch",
    stepNumber: 4,
    totalSteps: 5,
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
    step: "BDR: High Touch",
    stepNumber: 5,
    totalSteps: 5,
  },
];
