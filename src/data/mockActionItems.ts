export type ActionFilter = "All" | "Meetings" | "Follow-ups" | "Top Opps" | "Contracts" | "Onboarding";

export interface MockActionStats {
  signal: { label: string; color: string };
  fit: { label: string; color: string };
  email: string;
  phone: string;
}

export interface MockActionContext {
  tags: string[];
  summary: string;
  talkingPoints: string[]; // may contain inline HTML spans for highlights
  sources: string[]; // /public image paths for source icons
  localTime: { time: string; zone: string };
}

export type ActionType = "email" | "agenda" | "contract";

export interface MockActionItem {
  id: string;
  taskCategory: Exclude<ActionFilter, "All">;
  step: string;
  prospect: {
    name: string;
    role: string;
    company: string;
    email: string;
    avatarUrl?: string;
  };
  stats: MockActionStats;
  context: MockActionContext;
  action: {
    actionType: ActionType;
    draftSubject: string;
    draftBody: string;
    /** Agenda builder: pre-filled meeting title */
    meetingTitle?: string;
    /** Agenda builder: pre-filled agenda body */
    agendaContent?: string;
    /** Contract review: clause label */
    contractClause?: string;
    /** Contract review: clause excerpt */
    contractSnippet?: string;
  };
}

export const mockActionItems: MockActionItem[] = [
  {
    id: "prospect-1",
    taskCategory: "Follow-ups",
    step: "Step 1: Email",
    prospect: {
      name: "Ava Bennett",
      role: "Financial Director",
      company: "Cirrus",
      email: "ava.bennett@cirrus.com",
      avatarUrl: "https://randomuser.me/api/portraits/med/women/75.jpg",
    },
    stats: {
      signal: { label: "Hot 🔥", color: "bg-red-100 text-red-800" },
      fit: { label: "A+ 🚀", color: "bg-blue-100 text-blue-800" },
      email: "Verified ✔",
      phone: "Verified ✔",
    },
    context: {
      tags: ["Past Engagement", "Surging Intent", "Finance Team Growth"],
      summary:
        "Ava was previously involved in a Closed - Lost deal on 3 calls and 4 emails.",
      talkingPoints: [
        '<span class="text-blue-600 font-medium">Ava Bennett</span> at <span class="text-blue-600 font-medium">Cirrus</span> had <span class="text-blue-600 font-medium">1 email thread</span> with Acme — this is your warm re-engagement window.',
        'They were previously involved in discussions about addressing <span class="text-blue-600 font-medium">Cirrus\'</span> data challenges, including slow reporting, data silos, and manual financial close processes that delayed monthly reporting by up to 5 days.',
        'While Acme proposed solutions like real-time dashboards and automated data integration, the deal did not progress due to budget constraints at the time. That budget constraint has since been revisited — <span class="text-blue-600 font-medium">Cirrus</span> closed a <span class="text-blue-600 font-medium">Series B in Q4</span> and is now actively hiring a Head of FP&A.',
        '<span class="text-blue-600 font-medium">Ava</span> personally highlighted these challenges in her last interaction. She is the economic buyer and has direct authority over the finance tech stack.',
        'Signal intelligence shows <span class="text-blue-600 font-medium">Cirrus</span> researched competitor solutions <span class="text-blue-600 font-medium">3 times this month</span> — high intent, short window to re-engage before a competitor wins this.',
      ],
      sources: ["/Zoominfo.png", "/Six.png", "/Highspot.png", "/Gmail.png"],
      localTime: { time: "12:30 AM", zone: "PT" },
    },
    action: {
      actionType: "email",
      draftSubject: "Let's reconnect",
      draftBody:
        "Hi Ava,\n\nWe last spoke in January about Cirrus's financial planning needs. I saw that you're hiring financial analysts and thought it would be a good time to reconnect.\n\nWould you be open to a brief conversation next week?",
    },
  },
  {
    id: "prospect-2",
    taskCategory: "Meetings",
    step: "Discovery Call Prep",
    prospect: {
      name: "Noah Evans",
      role: "VP of Finance",
      company: "Connected Innovations",
      email: "noah.e@connected.com",
      avatarUrl: "https://randomuser.me/api/portraits/med/men/22.jpg",
    },
    stats: {
      signal: { label: "Warm 📈", color: "bg-orange-100 text-orange-800" },
      fit: { label: "A", color: "bg-blue-100 text-blue-800" },
      email: "Verified ✔",
      phone: "Unknown",
    },
    context: {
      tags: ["Job Change", "Recent Champion", "Tech Stack Match"],
      summary:
        "Noah recently joined Connected Innovations from TechStart where he was a champion of our product.",
      talkingPoints: [
        '<span class="text-blue-600 font-medium">Noah Evans</span> recently joined <span class="text-blue-600 font-medium">Connected Innovations</span> as VP of Finance after a 3-year tenure at TechStart — a classic champion-led expansion motion.',
        'He was previously a key power user of Acme at <span class="text-blue-600 font-medium">TechStart</span>, personally driving a successful rollout that resulted in a <span class="text-blue-600 font-medium">14% efficiency gain</span> for their FP&A team and eliminated manual consolidation across 3 ERPs.',
        '<span class="text-blue-600 font-medium">Connected Innovations</span> recently secured Series B funding ($42M) and posted 3 new openings for financial analysts — a clear signal of rapid headcount growth and potential operational bottlenecks in financial processes.',
        'His primary pain at <span class="text-blue-600 font-medium">Connected Innovations</span> is likely identical to what he solved at TechStart: fragmented reporting across business units and a lack of real-time visibility into cash flow.',
        'Lead with the TechStart win story. Ask: <em>"What does the reporting landscape look like today — are you hitting the same consolidation challenges?"</em>',
      ],
      sources: ["/Zoominfo.png", "/Linkedin.png", "/Gmail.png"],
      localTime: { time: "10:15 AM", zone: "ET" },
    },
    action: {
      actionType: "agenda",
      draftSubject: "Agenda for our sync",
      draftBody:
        "Hi Noah,\n\nLooking forward to catching up in an hour. I've put together a brief agenda focusing on how we might replicate the success you had at TechStart here at Connected Innovations.\n\nSee you soon!",
      meetingTitle: "Discovery Call — Connected Innovations",
      agendaContent:
        "1. Introductions & context (5 min)\n2. Current state: reporting & forecasting at Connected Innovations (10 min)\n3. TechStart success story — what worked and why (5 min)\n4. Live demo: closing the consolidation gap (10 min)\n5. Next steps & pilot proposal (5 min)",
    },
  },
  {
    id: "prospect-6",
    taskCategory: "Top Opps",
    step: "Contract Review",
    prospect: {
      name: "Diane Park",
      role: "CIO",
      company: "Acme Corp",
      email: "diane.p@acme.com",
      avatarUrl: "https://randomuser.me/api/portraits/med/women/21.jpg",
    },
    stats: {
      signal: { label: "Closing Soon ⏳", color: "bg-green-100 text-green-800" },
      fit: { label: "A+", color: "bg-blue-100 text-blue-800" },
      email: "Verified ✔",
      phone: "Verified ✔",
    },
    context: {
      tags: ["$60k ARR", "Stage 3", "Legal Review"],
      summary: "Clause 7.2 in the MSA is currently blocking procurement sign-off.",
      talkingPoints: [
        '<span class="text-blue-600 font-medium">Diane Park</span> at <span class="text-blue-600 font-medium">Acme Corp</span> has verbally confirmed intent to sign. Legal review is the only remaining gate before contract execution.',
        'Clause 7.2 — the non-compete language — is the sole outstanding blocker flagged by <span class="text-blue-600 font-medium">procurement</span>. Their legal team requested a carve-out for existing vendor relationships in the fintech space.',
        'Our standard <span class="text-blue-600 font-medium">non-compete addendum (v3.1)</span> is available and has been pre-approved by our legal team to address this exact scenario. No redlines needed.',
        'Target outcome: secure <span class="text-blue-600 font-medium">verbal sign-off by EOD today</span> so contracts can be countersigned and license provisioning initiated by <span class="text-blue-600 font-medium">Friday</span>.',
        'Diane is motivated to close before end of month — her IT budget has a quarterly carryover policy. Delaying past <span class="text-blue-600 font-medium">Friday</span> risks the deal slipping to Q2.',
      ],
      sources: ["/Salesforce.png", "/Six.png"],
      localTime: { time: "12:30 PM", zone: "PT" },
    },
    action: {
      actionType: "contract",
      draftSubject: "Following up on lunch / Clause 7.2",
      draftBody:
        "Hi Diane,\n\nGreat seeing you today. As discussed, I've attached the standard non-compete addendum to address legal's concerns on Clause 7.2. Let me know if this gives you the green light to proceed.",
      contractClause: "Clause 7.2 — Non-Compete (Action Required)",
      contractSnippet:
        '"During the term and for a period of 24 months thereafter, neither party shall directly or indirectly engage in any business activity that competes with the other party\'s core services within the defined market territory, including but not limited to financial data aggregation and analytics platforms."',
    },
  },
  {
    id: "prospect-3",
    taskCategory: "Follow-ups",
    step: "Budget Planning Follow-up",
    prospect: {
      name: "Maya Chen",
      role: "CFO",
      company: "Velocity Systems",
      email: "maya.chen@velocitysystems.com",
      avatarUrl: "https://randomuser.me/api/portraits/med/women/44.jpg",
    },
    stats: {
      signal: { label: "Warm 📈", color: "bg-orange-100 text-orange-800" },
      fit: { label: "B+", color: "bg-blue-100 text-blue-800" },
      email: "Verified ✔",
      phone: "Unknown",
    },
    context: {
      tags: ["Budget Cycle", "Intent Signal", "Q1 Planning"],
      summary:
        "Maya engaged with Q1 planning content and is evaluating budget allocation for finance tooling.",
      talkingPoints: [
        '<span class="text-blue-600 font-medium">Maya Chen</span> is actively in Q1 budget review at <span class="text-blue-600 font-medium">Velocity Systems</span>. She opened our pricing page twice in the last 7 days — strong buying intent.',
        'Reference her <span class="text-blue-600 font-medium">Q1 planning timeline</span> and the fact that her budget committee meets on the <span class="text-blue-600 font-medium">15th of each month</span>. This week is the window to influence this cycle.',
        'Position a lightweight pilot to reduce procurement friction — frame it as a <span class="text-blue-600 font-medium">90-day proof-of-value</span> with clearly defined exit criteria so legal doesn\'t need to do a full MSA review.',
        'Ask who else needs to approve before a <span class="text-blue-600 font-medium">proof-of-value</span> starts. Maya typically involves her VP of Engineering and Head of IT in vendor decisions.',
        'Velocity recently issued an RFP to 2 other vendors. Being first to propose a structured pilot dramatically increases your win probability.',
      ],
      sources: ["/Zoominfo.png", "/Six.png", "/Highspot.png"],
      localTime: { time: "11:05 AM", zone: "PT" },
    },
    action: {
      actionType: "email",
      draftSubject: "Budget planning touchpoint",
      draftBody:
        "Hi Maya,\n\nI noticed Velocity is deep in Q1 planning. If helpful, I can share a concise pilot plan with measurable outcomes so your team can evaluate quickly.\n\nWould next Tuesday work for a 20-minute review?",
    },
  },
  {
    id: "prospect-4",
    taskCategory: "Top Opps",
    step: "Expansion Strategy Sync",
    prospect: {
      name: "James Rodriguez",
      role: "Director of Operations",
      company: "ScaleUp Inc",
      email: "james.rodriguez@scaleup.com",
      avatarUrl: "https://randomuser.me/api/portraits/med/men/33.jpg",
    },
    stats: {
      signal: { label: "Hot 🔥", color: "bg-red-100 text-red-800" },
      fit: { label: "A", color: "bg-blue-100 text-blue-800" },
      email: "Verified ✔",
      phone: "Verified ✔",
    },
    context: {
      tags: ["Past Engagement", "Expansion Signal", "2 New Regions"],
      summary:
        "ScaleUp is opening two new regions and James needs an operations baseline before rollout.",
      talkingPoints: [
        '<span class="text-blue-600 font-medium">ScaleUp Inc</span> is expanding into <span class="text-blue-600 font-medium">EMEA and APAC</span> this quarter, adding ~120 headcount across both regions by June.',
        'Anchor on outcomes from last year\'s deployment with <span class="text-blue-600 font-medium">James Rodriguez</span> — specifically the 22% reduction in onboarding cycle time that his team documented in the QBR.',
        'Recommend a <span class="text-blue-600 font-medium">phased onboarding playbook by region</span> to reduce rollout risk. Start with EMEA (smaller team, easier timezone alignment) and use learnings to accelerate APAC.',
        'Confirm timeline for <span class="text-blue-600 font-medium">Q2 expansion readiness</span> — ScaleUp\'s board has a May 1 go-live target and James is accountable for operational readiness.',
        'Upsell motion: expansion into 2 regions likely pushes them from Pro → <span class="text-blue-600 font-medium">Enterprise tier</span>. Bring a pricing comparison to the call.',
      ],
      sources: ["/Salesforce.png", "/Linkedin.png", "/Zoominfo.png"],
      localTime: { time: "02:40 PM", zone: "CT" },
    },
    action: {
      actionType: "agenda",
      draftSubject: "Quick catch-up on expansion plans",
      draftBody:
        "Hi James,\n\nCongrats on the expansion momentum. I put together a phased rollout approach based on what worked in your previous deployment.\n\nCould we review it this week?",
      meetingTitle: "Expansion Strategy Sync — ScaleUp Inc",
      agendaContent:
        "1. Recap: last year's deployment wins & metrics (5 min)\n2. New regions overview: EMEA first, then APAC (10 min)\n3. Phased onboarding playbook walkthrough (10 min)\n4. Pricing: Pro → Enterprise tier comparison (5 min)\n5. Q2 go-live timeline & owner assignments (5 min)",
    },
  },
  {
    id: "prospect-5",
    taskCategory: "Meetings",
    step: "Stakeholder Alignment Prep",
    prospect: {
      name: "Sophie Kim",
      role: "VP of Strategy",
      company: "NextGen Solutions",
      email: "sophie.kim@nextgensolutions.com",
      avatarUrl: "https://randomuser.me/api/portraits/med/women/65.jpg",
    },
    stats: {
      signal: { label: "Warm 📈", color: "bg-orange-100 text-orange-800" },
      fit: { label: "A", color: "bg-blue-100 text-blue-800" },
      email: "Verified ✔",
      phone: "Unknown",
    },
    context: {
      tags: ["Content Engagement", "Decision Committee", "Exec Sponsor"],
      summary:
        "Sophie requested a strategic POV before presenting options to her executive steering group.",
      talkingPoints: [
        '<span class="text-blue-600 font-medium">Sophie Kim</span> needs a strategic brief for her <span class="text-blue-600 font-medium">executive steering group</span> meeting on Thursday. This is your chance to shape how the options are framed to leadership.',
        'Bring two comparable customer examples with <span class="text-blue-600 font-medium">measurable impact</span> — ideally in professional services or fintech where committee buy-in is a known friction point.',
        'Outline the strategic risks of delaying modernization: competitor velocity, talent retention (modern tools attract better analysts), and manual process debt compounding over time.',
        'Offer a <span class="text-blue-600 font-medium">decision memo template</span> for her committee — a single-page format that maps options to business outcomes, reducing the cognitive load on execs who don\'t have the domain depth Sophie has.',
        'Her exec sponsor is the COO. If this gets escalated, be prepared to present a 5-minute version of the business case focused purely on <span class="text-blue-600 font-medium">risk mitigation and ROI payback period</span>.',
      ],
      sources: ["/Highspot.png", "/Linkedin.png"],
      localTime: { time: "09:20 AM", zone: "ET" },
    },
    action: {
      actionType: "agenda",
      draftSubject: "Strategic planning sync",
      draftBody:
        "Hi Sophie,\n\nAhead of your steering group discussion, I drafted a one-page strategic brief with outcomes and risks so your team can make a clean decision.\n\nHappy to walk through it live.",
      meetingTitle: "Stakeholder Alignment — NextGen Solutions",
      agendaContent:
        "1. Context: current-state assessment (5 min)\n2. Benchmark: 2 customer case studies with ROI (10 min)\n3. Strategic risks of delaying modernization (5 min)\n4. Decision memo walkthrough (10 min)\n5. Escalation prep: COO presentation tips (5 min)",
    },
  },
  {
    id: "prospect-7",
    taskCategory: "Meetings",
    step: "Discovery Call Prep",
    prospect: {
      name: "Liam Carter",
      role: "Head of RevOps",
      company: "Northstar Health",
      email: "liam.carter@northstarhealth.com",
      avatarUrl: "https://randomuser.me/api/portraits/med/men/64.jpg",
    },
    stats: {
      signal: { label: "Warm 📈", color: "bg-orange-100 text-orange-800" },
      fit: { label: "B+", color: "bg-blue-100 text-blue-800" },
      email: "Verified ✔",
      phone: "Verified ✔",
    },
    context: {
      tags: ["Meeting in 2h", "Expansion", "Forecasting Pain"],
      summary:
        "Liam wants to diagnose forecasting gaps ahead of a cross-functional operating review.",
      talkingPoints: [
        '<span class="text-blue-600 font-medium">Liam Carter</span> at <span class="text-blue-600 font-medium">Northstar Health</span> runs RevOps for a 40-person sales team and owns weekly forecast roll-ups for the CRO.',
        'Ask where <span class="text-blue-600 font-medium">forecast slippage</span> is most common by stage — Stage 3 to Closed-Won is typically where accuracy drops for healthcare teams due to procurement delays.',
        'Align on KPIs he reports weekly to sales leadership: win rate by segment, ACV trends, and pipeline coverage ratio. Understanding his reporting cadence surfaces where our product creates the most immediate value.',
        'Close with a <span class="text-blue-600 font-medium">30-day proof-of-value</span> proposal — offer to pre-configure 3 of his top dashboards before he presents to the CRO, giving him a tangible win before formal approval.',
        'Northstar is in a regulated industry — ask early about <span class="text-blue-600 font-medium">data residency requirements</span> to avoid a compliance blocker derailing the POV down the line.',
      ],
      sources: ["/Zoominfo.png", "/Salesforce.png", "/Six.png"],
      localTime: { time: "01:55 PM", zone: "ET" },
    },
    action: {
      actionType: "agenda",
      draftSubject: "Prep for our 2 PM session",
      draftBody:
        "Hi Liam,\n\nLooking forward to our 2 PM session. I prepared a focused agenda on forecasting reliability, pipeline hygiene, and next-step metrics.\n\nSee you soon.",
      meetingTitle: "Discovery Call — Northstar Health",
      agendaContent:
        "1. Current forecasting process & tools (10 min)\n2. Where slippage happens: stage-by-stage diagnosis (10 min)\n3. Weekly KPI reporting cadence & gaps (5 min)\n4. 30-day POV proposal: 3 pre-built dashboards (10 min)\n5. Data residency & compliance check (5 min)",
    },
  },
  {
    id: "prospect-8",
    taskCategory: "Top Opps",
    step: "Security Review Follow-up",
    prospect: {
      name: "Priya Shah",
      role: "VP Procurement",
      company: "Greentech",
      email: "priya.shah@greentech.com",
      avatarUrl: "https://randomuser.me/api/portraits/med/women/33.jpg",
    },
    stats: {
      signal: { label: "Hot 🔥", color: "bg-red-100 text-red-800" },
      fit: { label: "A+", color: "bg-blue-100 text-blue-800" },
      email: "Verified ✔",
      phone: "Verified ✔",
    },
    context: {
      tags: ["Top Opp", "Security Review", "Near Signature"],
      summary:
        "Security review is complete; procurement packet needs final confirmation to move to signature.",
      talkingPoints: [
        '<span class="text-blue-600 font-medium">Priya Shah</span> leads procurement at <span class="text-blue-600 font-medium">Greentech</span> — deal value <span class="text-blue-600 font-medium">$180k ARR</span>, the single largest opportunity in your Q1 pipeline.',
        'Confirm all <span class="text-blue-600 font-medium">SOC 2 Type II and compliance artifacts</span> were received and reviewed. Their infosec team requested the penetration test summary — confirm this was sent last Thursday.',
        'Clarify the expected legal turnaround window from <span class="text-blue-600 font-medium">Greentech\'s</span> legal team. Previous cycles at this stage have taken 4-7 days; proactively ask if a redline turnaround SLA can be agreed.',
        'Push for a target <span class="text-blue-600 font-medium">signature date this week</span>. Use the end-of-quarter framing: "Our provisioning team is holding capacity this week — would Friday work to initiate onboarding?"',
        'Priya\'s champion internally is <span class="text-blue-600 font-medium">Jordan Hayes</span> (Dir. of IT). If Priya is unreachable, route through Jordan to unblock legal review.',
      ],
      sources: ["/Salesforce.png", "/Zoominfo.png", "/Six.png", "/Linkedin.png"],
      localTime: { time: "04:10 PM", zone: "PT" },
    },
    action: {
      actionType: "email",
      draftSubject: "Security checklist follow-up",
      draftBody:
        "Hi Priya,\n\nFollowing up to make sure your team has everything needed for final security sign-off. We can jump on a quick call today if helpful to keep this on track for signature.\n\nThanks again.",
    },
  },

  // ─── Contracts ────────────────────────────────────────────────────────────
  {
    id: "contract-1",
    taskCategory: "Contracts",
    step: "MSA Review",
    prospect: {
      name: "Rachel Kim",
      role: "General Counsel",
      company: "Orbit Labs",
      email: "rachel.kim@orbitlabs.io",
      avatarUrl: "https://randomuser.me/api/portraits/med/women/55.jpg",
    },
    stats: {
      signal: { label: "Closing Soon ⏳", color: "bg-green-100 text-green-800" },
      fit: { label: "A+", color: "bg-blue-100 text-blue-800" },
      email: "Verified ✔",
      phone: "Verified ✔",
    },
    context: {
      tags: ["MSA In Review", "Legal Blocker", "$95k ARR"],
      summary: "Legal is reviewing the Master Services Agreement — data processing addendum is the only open item.",
      talkingPoints: [
        '<span class="text-blue-600 font-medium">Rachel Kim</span> at <span class="text-blue-600 font-medium">Orbit Labs</span> is the legal owner for the MSA currently in their internal review cycle.',
        'The only open item is the <span class="text-blue-600 font-medium">Data Processing Addendum (DPA)</span> — specifically the sub-processor list and data residency clauses for EU data.',
        'Our standard <span class="text-blue-600 font-medium">GDPR-compliant DPA (v2.4)</span> has been pre-approved by 14 other enterprise customers with similar requirements. No custom redlines needed.',
        'Orbit Labs has a <span class="text-blue-600 font-medium">hard deadline of end of quarter</span> to execute contracts before their new fiscal year freeze.',
        'Champion is <span class="text-blue-600 font-medium">Tom Vasquez (VP Engineering)</span> — he is pushing Rachel internally to expedite. Reach out to Rachel directly to unblock.',
      ],
      sources: ["/Salesforce.png", "/Zoominfo.png", "/Linkedin.png"],
      localTime: { time: "11:15 AM", zone: "ET" },
    },
    action: {
      actionType: "contract",
      draftSubject: "DPA v2.4 — resolving your open items",
      draftBody:
        "Hi Rachel,\n\nThank you for your continued diligence on the MSA review. I've attached our standard DPA v2.4 which addresses the sub-processor list and EU data residency requirements your team flagged.\n\nHappy to schedule a 20-minute call today to walk through it. Tom mentioned your team has a quarter-end deadline — we're fully aligned on expediting.\n\nBest,\nRita",
      contractClause: "Data Processing Addendum — Sub-processor List",
      contractSnippet:
        '"The Data Processor shall maintain an up-to-date list of all sub-processors engaged in the processing of Personal Data, providing the Data Controller with no less than 30 days prior written notice of any intended changes to the sub-processor list, including additions or replacements."',
    },
  },
  {
    id: "contract-2",
    taskCategory: "Contracts",
    step: "Renewal Negotiation",
    prospect: {
      name: "Derek Walsh",
      role: "VP of Operations",
      company: "Cascade Systems",
      email: "derek.walsh@cascadesys.com",
      avatarUrl: "https://randomuser.me/api/portraits/med/men/47.jpg",
    },
    stats: {
      signal: { label: "Warm 📈", color: "bg-orange-100 text-orange-800" },
      fit: { label: "A", color: "bg-blue-100 text-blue-800" },
      email: "Verified ✔",
      phone: "Unknown",
    },
    context: {
      tags: ["Renewal", "Expansion Opportunity", "90 Days Out"],
      summary: "Current contract expires in 90 days — Derek has expansion budget and is evaluating a seat increase.",
      talkingPoints: [
        '<span class="text-blue-600 font-medium">Derek Walsh</span> at <span class="text-blue-600 font-medium">Cascade Systems</span> is 90 days out from contract renewal on a 25-seat agreement at $48k ARR.',
        'Usage data shows <span class="text-blue-600 font-medium">Cascade is at 94% seat utilisation</span> — they\'re practically at capacity. This is a natural upsell conversation, not a push.',
        'Derek has secured <span class="text-blue-600 font-medium">discretionary budget approval for up to 15 additional seats</span> in Q2 — the expansion motion is already pre-approved internally.',
        'Recommend framing the renewal discussion around a <span class="text-blue-600 font-medium">3-year enterprise agreement</span> with annual pricing lock — gives Derek price predictability, gives us long-term retention.',
        'Risk: if we don\'t engage proactively in the next <span class="text-blue-600 font-medium">30 days</span>, procurement will issue an RFP. Competitor was already sniffing around in Q4.',
      ],
      sources: ["/Salesforce.png", "/Six.png", "/Highspot.png"],
      localTime: { time: "02:30 PM", zone: "CT" },
    },
    action: {
      actionType: "contract",
      draftSubject: "Let's get ahead of your renewal — expansion options inside",
      draftBody:
        "Hi Derek,\n\nWith your contract coming up in 90 days and your team running at near-full capacity, I wanted to proactively share renewal options before procurement cycles kick in.\n\nI've put together a 3-year enterprise proposal with a seat expansion bundle that locks in current pricing — happy to walk through it this week.\n\nBest,\nRita",
      contractClause: "Renewal Term & Seat Expansion — Section 4.2",
      contractSnippet:
        '"Upon expiry of the Initial Term, this Agreement shall automatically renew for successive one-year periods unless either party provides written notice of non-renewal no less than sixty (60) days prior to the end of the then-current term. Seat additions during the term shall be prorated at the per-seat rate in effect at the time of addition."',
    },
  },

  // ─── Onboarding ───────────────────────────────────────────────────────────
  {
    id: "onboarding-1",
    taskCategory: "Onboarding",
    step: "Week 1 Check-in",
    prospect: {
      name: "Aisha Patel",
      role: "Director of RevOps",
      company: "Luminary Co",
      email: "aisha.patel@luminary.co",
      avatarUrl: "https://randomuser.me/api/portraits/med/women/29.jpg",
    },
    stats: {
      signal: { label: "Active 🟢", color: "bg-green-100 text-green-800" },
      fit: { label: "A", color: "bg-blue-100 text-blue-800" },
      email: "Verified ✔",
      phone: "Verified ✔",
    },
    context: {
      tags: ["New Customer", "Week 1", "Data Migration Pending"],
      summary: "Aisha's team signed 3 weeks ago. Data migration is 60% complete — Week 1 check-in call is overdue.",
      talkingPoints: [
        '<span class="text-blue-600 font-medium">Aisha Patel</span> at <span class="text-blue-600 font-medium">Luminary Co</span> signed a $72k ARR deal 3 weeks ago. This is a high-touch onboarding account.',
        'Data migration from their legacy Salesforce instance is <span class="text-blue-600 font-medium">60% complete</span>. The blocker is a field mapping issue on their custom opportunity stages — CSM flagged this on Thursday.',
        'Aisha sent a follow-up email on Friday asking for an ETA. She has a <span class="text-blue-600 font-medium">board presentation on Day 30</span> where she plans to showcase the new platform — delay is a real risk to her credibility.',
        'Action: connect Aisha with <span class="text-blue-600 font-medium">our implementation engineer (Sam Kowalski)</span> for a 30-minute field mapping call this week. This unblocks migration and restores confidence.',
        'NPS check-in is due. Initial sentiment from the team is positive — usage is strong on 4 of 6 purchased modules. Personalise the check-in to acknowledge the migration delay and commit to a resolution timeline.',
      ],
      sources: ["/Salesforce.png", "/Gmail.png", "/Zoominfo.png"],
      localTime: { time: "10:00 AM", zone: "PT" },
    },
    action: {
      actionType: "email",
      draftSubject: "Week 1 check-in + migration update",
      draftBody:
        "Hi Aisha,\n\nFirst — thank you for your patience on the migration. I heard from the team about the field mapping issue and I've connected Sam Kowalski (our implementation engineer) to your thread — he'll reach out today to get a call on the books this week.\n\nI also wanted to check in personally on how the team is settling in. From what I can see, adoption on 4 of the 6 modules is already strong — that's a great sign in Week 1.\n\nLooking forward to getting you fully live before your board presentation.\n\nBest,\nRita",
    },
  },
  {
    id: "onboarding-2",
    taskCategory: "Onboarding",
    step: "Training Session Prep",
    prospect: {
      name: "Carlos Mendes",
      role: "Head of Sales Enablement",
      company: "TerraFin",
      email: "carlos.mendes@terrafin.com",
      avatarUrl: "https://randomuser.me/api/portraits/med/men/52.jpg",
    },
    stats: {
      signal: { label: "Active 🟢", color: "bg-green-100 text-green-800" },
      fit: { label: "B+", color: "bg-blue-100 text-blue-800" },
      email: "Verified ✔",
      phone: "Verified ✔",
    },
    context: {
      tags: ["Training", "30 Users", "Admin Setup Pending"],
      summary: "Carlos is running the rollout for 30 sales reps — admin setup incomplete, training scheduled for Thursday.",
      talkingPoints: [
        '<span class="text-blue-600 font-medium">Carlos Mendes</span> at <span class="text-blue-600 font-medium">TerraFin</span> is coordinating the rollout to <span class="text-blue-600 font-medium">30 sales reps</span>. Training is scheduled for Thursday at 2 PM ET.',
        'Admin setup is <span class="text-blue-600 font-medium">not yet complete</span> — SSO configuration and role-based permissions haven\'t been finalised. If this isn\'t resolved before Thursday, the training session cannot proceed.',
        'Carlos prefers a <span class="text-blue-600 font-medium">role-specific training split</span>: AEs and SDRs in separate breakout groups. Customise the training deck to show AE-specific workflows in Part 1 and SDR prospecting features in Part 2.',
        'Share the <span class="text-blue-600 font-medium">pre-training checklist</span> today: (1) confirm SSO is live, (2) verify all 30 users are provisioned, (3) send rep-facing "what to expect" email.',
        'TerraFin\'s CRO (<span class="text-blue-600 font-medium">Maria Santos</span>) is attending the training as an observer. This is an upsell opportunity — prepare a 2-slide exec summary on advanced analytics features she can take away.',
      ],
      sources: ["/Salesforce.png", "/Highspot.png", "/Gmail.png"],
      localTime: { time: "09:45 AM", zone: "ET" },
    },
    action: {
      actionType: "agenda",
      draftSubject: "Thursday training prep — checklist + agenda inside",
      draftBody:
        "Hi Carlos,\n\nLooking forward to Thursday's session. I wanted to send over a quick checklist to make sure we're set up for success:\n\n1. SSO configuration — still showing as pending in our system. Can you confirm status?\n2. All 30 users provisioned? I can re-send bulk invites if needed.\n3. Rep-facing intro email — attached template you can forward to the team.\n\nI've also put together a role-split agenda (AEs first, SDRs second) and added a short exec summary slide for Maria's benefit.\n\nSee you Thursday!\nRita",
      meetingTitle: "TerraFin Platform Training — AE & SDR Rollout",
      agendaContent:
        "PART 1 — AE Workflow (45 min)\n1. Welcome & platform overview (5 min)\n2. Opportunity management & pipeline views (15 min)\n3. Forecasting & deal scoring walkthrough (15 min)\n4. Q&A (10 min)\n\nPART 2 — SDR Prospecting (30 min)\n1. Sequence builder & cadence setup (15 min)\n2. Intent data & signal triggers (10 min)\n3. Q&A (5 min)\n\nEXEC CLOSE (5 min)\n• Advanced analytics preview for Maria Santos (CRO)",
    },
  },
];
