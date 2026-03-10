import { GENERIC_GLOBAL_DMS, ExtendedDemoDM, ChatHistoryMessage } from '../components/presentation/GlobalDMsView';
import type { NavView } from '@/app/(demo)/demo/workspace/[workspaceId]/_context/demo-layout-context';
import type { DemoChannel } from '@/context/DemoDataContext';
import { getAvatarUrl } from '@/context/DemoDataContext';
import { ONBOARDING_DATA, type OnboardingData } from '@/data/onboardingData';

/**
 * Sidebar app configuration
 */
export interface SidebarApp {
  id: string;
  name: string;
  icon: string;
}

/**
 * Presentation overrides for intro screens (optional)
 */
export interface PresentationOverrides {
  /** Hide the quota slider on intro screens */
  hideQuotaSlider?: boolean;
  /** Layout style: 'classic' (Old World/New World), 'breakthrough' (Friction/Breakthrough), or 'compact-metric' (Hero Metric only) */
  layoutStyle?: 'classic' | 'breakthrough' | 'compact-metric';
  /** Custom Old World title (replaces "Old World") */
  oldWorldTitle?: string;
  /** Custom Old World text (replaces scene.bundled.text) */
  oldWorldText?: string;
  /** Custom New World title (replaces "With Intelligence") */
  newWorldTitle?: string;
  /** Custom New World text (replaces scene.unbundled.text) */
  newWorldText?: string;
  /** Friction text for breakthrough layout */
  frictionText?: string;
  /** Breakthrough text for breakthrough layout */
  breakthroughText?: string;
  /** 2x2 metrics grid for detailed view */
  metricsGrid?: {
    topLeft: { value: string; label: string; color: 'red' | 'blue' | 'gray' };
    bottomLeft: { value: string; label: string; color: 'red' | 'blue' | 'gray' };
    topRight: { value: string; label: string; color: 'red' | 'blue' | 'gray' };
    bottomRight: { value: string; label: string; color: 'red' | 'blue' | 'gray' };
  };
  /** Hero metric for compact exec-ready layout */
  heroMetric?: {
    old: string;
    new: string;
    label: string;
  };
}

/**
 * Arc-specific UI and data payload configuration.
 * This drives the actual UI state, DM lists, bot scripts, and navigation for each arc.
 */
export interface ArcPayloadConfig {
  /** Default navigation view when the arc loads (e.g., 'today', 'dms', 'home') */
  defaultNavId: NavView;
  /** The specific DM list to show in the sidebar. Empty array means use internal/default DMs. */
  sidebarDms: ExtendedDemoDM[];
  /** Optional channels to show in the sidebar. If provided, overrides default channels. */
  sidebarChannels?: DemoChannel[];
  /** Optional apps to show in the sidebar. */
  sidebarApps?: SidebarApp[];
  /** Optional bot script ID to load for this arc */
  botScriptId?: string;
  /** Optional list of allowed left-nav tabs for this arc */
  allowedTabs?: NavView[];
  /** Optional onboarding data for first-open experience (N2A1 only) */
  onboarding?: OnboardingData;
  /** Optional presentation overrides for intro screens (N2 only) */
  presentationOverrides?: PresentationOverrides;
  /** Optional last reviewed date for deprecated arcs (format: "dd/mm/yyyy") */
  lastReviewedDate?: string;
}

/**
 * Hyper-detailed Vanguard Corp Deal Swarm payload
 * A $2.4M ACV enterprise deal at end of quarter with cross-functional collaboration
 */
export const VANGUARD_DEAL_PAYLOAD: ArcPayloadConfig = {
  defaultNavId: 'today',
  botScriptId: 'vanguard_deal_swarm_copilot',
  
  // Dense sidebar channels with unread badges
  sidebarChannels: [
    { id: 'c1', name: 'deal-vanguard-swarm', unread: true },
    { id: 'c2', name: 'sales-na-enterprise', unread: false },
    { id: 'c3', name: 'se-requests-q4', unread: false },
    { id: 'c4', name: 'competitive-intel', unread: true },
    { id: 'c5', name: 'wins-and-celebrations', unread: false }
  ],

  // Sidebar apps
  sidebarApps: [
    { id: 'a1', name: 'Salesforce Cloud', icon: '/Salesforce.png' },
    { id: 'a2', name: 'Tableau Pulse', icon: '/Salesforce.png' }, // Using Salesforce icon as fallback
    { id: 'a3', name: 'Gong', icon: '/gong.png' },
    { id: 'a4', name: 'Crossbeam', icon: '/Salesforce.png' } // Using Salesforce icon as fallback
  ],

  // For global shell inheritance, leave DMs empty so wrapper falls back to GENERIC_GLOBAL_DMS.
  // Arc 1 remains quarantined separately.
  sidebarDms: []
};

/**
 * Metadata for a single Arc within a Narrative.
 */
export interface ArcMetadata {
  id: string; // e.g., 'n1-a1', 'n2-a3'
  value: string; // e.g., '1', '3' (arc number as string)
  title: string; // e.g., 'Arc 1: Quota Planning'
  description: string; // e.g., 'Reviewing attainment.'
  payload: ArcPayloadConfig; // The UI/data configuration for this arc
}

/**
 * Metadata for a Narrative containing multiple Arcs.
 */
export interface NarrativeMetadata {
  id: string; // e.g., 'n1', 'n2'
  value: string; // e.g., '1', '2' (narrative number as string)
  title: string; // e.g., '01 : Quarter Closing Story'
  description: string; // e.g., 'End-to-end flow of an AE closing out Q4.'
  arcs: ArcMetadata[];
}

/**
 * Central metadata registry for all Narratives and Arcs.
 * This is the single source of truth for arc-specific UI configuration.
 */
export const DEMO_METADATA: NarrativeMetadata[] = [
  {
    id: 'n1',
    value: '1',
    title: '01 : Quarter Closing Story',
    description: 'End-to-end flow of an AE closing out Q4.',
    arcs: [
      {
        id: 'n1-a1',
        value: '1',
        title: 'Quota Planning',
        description: 'Reviewing attainment.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [], // Handled internally by SlackConceptArc1 for now to prevent breaking it
          botScriptId: 'seller_edge_q1_prep',
        },
      },
      {
        id: 'n1-a2',
        value: '2',
        title: 'Loss Recovery',
        description: 'Recovering from a lost deal.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [],
          botScriptId: 'loss_recovery',
        },
      },
      {
        id: 'n1-a3',
        value: '3',
        title: 'Sentiment Detection',
        description: 'Detecting and responding to deal sentiment.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [],
          botScriptId: 'sentiment_detection',
        },
      },
      {
        id: 'n1-a4',
        value: '4',
        title: 'Team Collaboration',
        description: 'Working naturally with intelligence.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [],
          botScriptId: 'team_collaboration',
        },
      },
      {
        id: 'n1-a5',
        value: '5',
        title: 'Autonomous Close',
        description: 'The silent close.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [],
          botScriptId: 'autonomous_close',
        },
      },
      {
        id: 'n1-a6',
        value: '6',
        title: 'Capacity Management',
        description: 'Managing seller capacity.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [],
          botScriptId: 'capacity_management',
        },
      },
      {
        id: 'n1-a7',
        value: '7',
        title: 'Multi-Surface Decisions',
        description: 'Three decisions. Nine minutes.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [],
          botScriptId: 'multi_surface_decisions',
        },
      },
      {
        id: 'n1-a8',
        value: '8',
        title: 'Ambient CRM',
        description: 'Five surfaces. Zero CRM navigations.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [],
          botScriptId: 'ambient_crm',
        },
      },
      {
        id: 'n1-a9',
        value: '9',
        title: 'Zero-Touch Proof',
        description: 'Revenue up. Software time down.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [],
          botScriptId: 'zero_touch_proof',
        },
      },
      {
        id: 'n1-a10',
        value: '10',
        title: 'Final Push',
        description: 'She was $47K short. She made the calls herself.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [],
          botScriptId: 'final_push',
        },
      },
    ],
  },
  {
    id: 'n2',
    value: '2',
    title: '02 : AE JTBDs in Slack',
    description: 'High-velocity daily Jobs-To-Be-Done.',
    arcs: [
      {
        id: 'n2-a1',
        value: '1',
        title: 'Zero-Day Value',
        description: 'No wizards. No setup. Instant execution.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [],
          onboarding: ONBOARDING_DATA,
          presentationOverrides: {
            hideQuotaSlider: true,
            layoutStyle: 'breakthrough',
            oldWorldTitle: "🔴 THE FRICTION",
            oldWorldText: "Enterprise software demands a 'setup tax.' A new tool means blank dashboards and hours of configuration. It demands your time before giving any value back.",
            newWorldTitle: "🔵 THE BREAKTHROUGH",
            newWorldText: "We eliminated the blank slate. The system securely reads your pipeline and toolstack in the background. Onboarding is a native discovery of tailored skills already working for you.",
            frictionText: "ENTERPRISE FRICTION: A new tool means blank dashboards and hours of configuration. It demands your time before giving any value back.",
            breakthroughText: "AMBIENT DISCOVERY: The system securely reads the pipeline and toolstack in the background. Onboarding isn't a blocking wizard—it's a native discovery of tailored skills already working for you.",
            metricsGrid: {
              topLeft: { value: "4 days", label: "LOST TO TOOL SETUP", color: "red" },
              bottomLeft: { value: "72%", label: "OF NEW TOOLS ABANDONED", color: "red" },
              topRight: { value: "0 sec", label: "TIME TO FIRST VALUE", color: "blue" },
              bottomRight: { value: "6", label: "PROACTIVE SKILLS READY", color: "blue" }
            },
            heroMetric: {
              old: "4 Days",
              new: "0 Seconds",
              label: "TIME TO FIRST VALUE"
            }
          },
        },
      },
      {
        id: 'n2-a2',
        value: '2',
        title: 'Proactive Modeling',
        description: 'No spreadsheets. No guesswork. Instant commission visibility.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [],
          presentationOverrides: {
            oldWorldTitle: "🔴 OLD WORLD",
            oldWorldText: "End-of-quarter means stressful spreadsheet math, waiting on Finance reports, and guessing next quarter's targets. Sellers waste days reconciling disconnected systems instead of building pipeline.",
            newWorldTitle: "🔵 WITH INTELLIGENCE",
            newWorldText: "The custom Quota Tracker skill triggers automatically. Agentforce securely synthesizes Workday, Salesforce, and Spiff data, sending a proactive DM with verified Q4 attainment and a predictive Q1 model.",
            metricsGrid: {
              topLeft: { value: "2 days", label: "WAITING ON COMP REPORTS", color: "red" },
              bottomLeft: { value: "68%", label: "REPS LACK QUOTA VISIBILITY", color: "red" },
              topRight: { value: "Instant", label: "ATTAINMENT SYNTHESIS", color: "blue" },
              bottomRight: { value: "98%", label: "PREDICTIVE ACCURACY", color: "blue" }
            }
          }
        },
      },
      {
        id: 'n2-a3',
        value: '3',
        title: 'High-Velocity Execution',
        description: 'No context switching. No writer\'s block. Just pure pipeline generation.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [],
          lastReviewedDate: '02/03/2026',
          presentationOverrides: {
            hideQuotaSlider: true,
            layoutStyle: 'breakthrough',
            oldWorldTitle: "🔴 THE FRICTION",
            oldWorldText: "Reps live in five tabs at once. To execute a cadence, they pull a Salesforce list, cross-reference LinkedIn for intent signals, hunt through past CRM notes for context, and stare at a blank draft in Gmail. It's 15 minutes of swivel-chair administration and data hunting just to send one quality, personalized outbound message.",
            newWorldTitle: "🔵 THE BREAKTHROUGH",
            newWorldText: "Slack opens. The 'Today' view presents a curated \"Priority Prospects\" queue. The rep clicks a single button: Start Work Mode. The Slackbot panel takes over, sequentially serving up deep account context alongside hyper-personalized, Agentforce-drafted emails. The rep reviews, tweaks, and clicks \"Send & Next.\" They clear their top 10 leads in 5 minutes without ever leaving Slack.",
            heroMetric: {
              old: "15 Mins",
              new: "30 Seconds",
              label: "TIME PER PERSONALIZED OUTREACH"
            }
          }
        },
      },
      {
        id: 'n2-a4',
        value: '4',
        title: 'High-Velocity Execution',
        description: 'No context switching. No writer\'s block. Just pure pipeline generation.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [],
          presentationOverrides: {
            hideQuotaSlider: true,
            layoutStyle: 'breakthrough',
            oldWorldTitle: "🔴 THE FRICTION",
            oldWorldText: "Reps live in five tabs at once. To execute a cadence, they pull a Salesforce list, cross-reference LinkedIn for intent signals, hunt through past CRM notes for context, and stare at a blank draft in Gmail. It's 15 minutes of swivel-chair administration and data hunting just to send one quality, personalized outbound message.",
            newWorldTitle: "🔵 THE BREAKTHROUGH",
            newWorldText: "Slack opens. The 'Today' view presents a curated \"Priority Prospects\" queue. The rep clicks a single button: Start Work Mode. The Slackbot panel takes over, sequentially serving up deep account context alongside hyper-personalized, Agentforce-drafted emails. The rep reviews, tweaks, and clicks \"Send & Next.\" They clear their top 10 leads in 5 minutes without ever leaving Slack.",
            heroMetric: {
              old: "15 Mins",
              new: "30 Seconds",
              label: "TIME PER PERSONALIZED OUTREACH"
            }
          }
        },
      },
      {
        id: 'n2-a5',
        value: '5',
        title: 'Generic Shell',
        description: 'Generic shell for N2A5.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [],
          botScriptId: undefined,
        },
      },
      {
        id: 'n2-a6',
        value: '6',
        title: 'Generic Shell',
        description: 'Generic shell for N2A6.',
        payload: {
          defaultNavId: 'today',
          sidebarDms: [],
          botScriptId: undefined,
        },
      },
    ],
  },
];

/**
 * Maps scene IDs to narrative and arc values.
 * 
 * Scene ID mapping:
 * - Narrative 1: Scene IDs 1-13 map to arcs 1-10
 * - Narrative 2: Scene IDs 201-206 map to arcs 1-6
 * 
 * @param sceneId The scene ID from the presentation data
 * @returns Object with narrative and arc values, or null if not found
 */
export function getNarrativeArcFromSceneId(sceneId: number): { narrative: string; arc: string } | null {
  // Scene ID 0 is the hero scene - default to Narrative 1, Arc 1
  if (sceneId === 0) {
    return {
      narrative: '1',
      arc: '1',
    };
  }
  
  // Narrative 2: Scene IDs 201-206 map to arcs 1-6
  if (sceneId >= 201 && sceneId <= 206) {
    return {
      narrative: '2',
      arc: String(sceneId - 200), // 201 -> 1, 202 -> 2, etc.
    };
  }
  
  // Narrative 1: Scene IDs 1-13 map to arcs 1-10
  // Using the same mapping as SCENE_TO_ARC in SceneLayout.tsx
  const SCENE_TO_ARC: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11, // Mobile Pulse maps to Arc 11
    12: 12, // Watch Win maps to Arc 12
    13: 10, // Final scene maps to Arc 10
  };
  
  const arcNumber = SCENE_TO_ARC[sceneId];
  if (arcNumber !== undefined) {
    return {
      narrative: '1',
      arc: String(arcNumber),
    };
  }
  
  return null;
}

/**
 * Gets metadata for a specific scene by its ID.
 * 
 * @param sceneId The scene ID from the presentation data
 * @returns Object with narrative and arc metadata, or null if not found
 */
export function getMetadataForScene(sceneId: number): { narrative: NarrativeMetadata | null; arc: ArcMetadata | null } {
  const narrativeArc = getNarrativeArcFromSceneId(sceneId);
  if (!narrativeArc) {
    return { narrative: null, arc: null };
  }
  
  const narrative = DEMO_METADATA.find(n => n.value === narrativeArc.narrative);
  const arc = narrative?.arcs.find(a => a.value === narrativeArc.arc);
  
  return {
    narrative: narrative || null,
    arc: arc || null,
  };
}

/**
 * Gets metadata for a specific narrative and arc by their values.
 * 
 * @param narrativeVal The narrative value (e.g., '1', '2')
 * @param arcVal The arc value (e.g., '1', '3')
 * @returns Object with narrative and arc metadata, or null if not found
 */
export function getMetadataForNarrativeArc(narrativeVal: string, arcVal: string): { narrative: NarrativeMetadata | null; arc: ArcMetadata | null } {
  const narrative = DEMO_METADATA.find(n => n.value === narrativeVal);
  const arc = narrative?.arcs.find(a => a.value === arcVal);
  
  return {
    narrative: narrative || null,
    arc: arc || null,
  };
}
