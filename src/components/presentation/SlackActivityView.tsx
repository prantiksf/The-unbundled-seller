"use client";

import React, { useState } from "react";
import { Settings, ChevronDown, Square, AlignJustify, List, Bookmark, PenSquare, MoreVertical, Users, Headphones, Bell, Search } from "lucide-react";
import { MessageInput } from "@/components/shared/MessageInput";
import { ChatMessage } from "@/components/shared/ChatMessage";
import { UniversalChatSurface } from "@/components/shared/UniversalChatSurface";
import { generateInitialsAvatar } from '@/lib/avatar-utils';

// ── Activity item data ────────────────────────────────────────────────────────
interface ActivityMessage {
  sender: string;
  avatarUrl: string;
  time: string;
  text: string;
  isHighlighted?: boolean;
}

interface ActivityItem {
  id: string;
  user: string;
  avatarUrl: string;
  avatarBadge?: string | null;
  action: string;
  channel: string;
  channelId: string;
  channelLabel?: string;
  time: string;
  unread?: boolean;
  replyCount?: number;
  reactionPill?: string;
  preview: React.ReactNode;
  previewSuffix?: string;
  fullContext: ActivityMessage[];
}

const RITA_AVATAR   = "https://randomuser.me/api/portraits/med/women/90.jpg";
const SARAH_AVATAR  = "https://randomuser.me/api/portraits/med/women/44.jpg";
const PRIYA_AVATAR  = "https://randomuser.me/api/portraits/med/women/32.jpg";
const JORDAN_AVATAR = "https://randomuser.me/api/portraits/med/men/22.jpg";
const DANA_AVATAR   = "https://randomuser.me/api/portraits/med/women/28.jpg";

const MARCUS_AVATAR = "https://randomuser.me/api/portraits/med/men/35.jpg";
const REED_AVATAR   = "https://randomuser.me/api/portraits/med/men/52.jpg";
const ANIKA_AVATAR  = "https://randomuser.me/api/portraits/med/women/65.jpg";
const CARLOS_AVATAR = "https://randomuser.me/api/portraits/med/men/60.jpg";

const ACTIVITY_ITEMS: ActivityItem[] = [
  /* ── 1. Slack system notification (read) ───────────────────────────────── */
  {
    id: "act-slack",
    user: "Slack",
    avatarUrl: "/slackbot-logo.svg",
    avatarBadge: null,
    action: "",
    channel: "#general",
    channelId: "general",
    time: "",
    preview: (
      <span>
        <span className="text-blue-600">@Jonnie Lee</span>
        {" archived the channel 🔒"}
      </span>
    ),
    previewSuffix: "",
    fullContext: [
      {
        sender: "Slack",
        avatarUrl: "/slackbot-logo.svg",
        time: "Today at 8:10 AM",
        text: "@Jonnie Lee archived the channel 🔒 #fy24-welcome-to-tandp. No new messages can be posted.",
        isHighlighted: true,
      },
    ],
  },

  /* ── 2. Stephane — post (unread, 44 replies) ───────────────────────────── */
  {
    id: "act-stephane",
    user: "Stephane Della-C…",
    avatarUrl: "https://randomuser.me/api/portraits/med/men/40.jpg",
    avatarBadge: "#",
    action: "Post in",
    channel: "#request-integrations",
    channelId: "sales",
    channelLabel: "# request-i…",
    time: "19 mins",
    unread: true,
    replyCount: 44,
    preview: "Requesting access to Today View",
    fullContext: [
      {
        sender: "Stephane Della-Costa",
        avatarUrl: "https://randomuser.me/api/portraits/med/men/40.jpg",
        time: "Today at 8:45 AM",
        text: "Requesting access to Today View — we'd love to pilot this feature with the Sales Cloud UX team. Can someone from product share access?",
        isHighlighted: true,
      },
      {
        sender: "Rita Patel",
        avatarUrl: RITA_AVATAR,
        time: "Today at 8:52 AM",
        text: "This is exactly the scenario we built the Today View for — AE daily standups. Happy to set up a pilot. DM me for next steps.",
      },
      {
        sender: "Sarah Chen",
        avatarUrl: SARAH_AVATAR,
        time: "Today at 9:00 AM",
        text: "Agreed — Stephane's team is the perfect pilot group. $270K in pipeline coverage, high deal velocity. Let's move fast on this.",
      },
    ],
  },

  /* ── 3. Shweta — reacted in DM (read) ──────────────────────────────────── */
  {
    id: "act-shweta",
    user: "Shweta Humnabadkar",
    avatarUrl: "https://randomuser.me/api/portraits/med/women/20.jpg",
    avatarBadge: "🙏",
    action: "Reacted in DM",
    channel: "Direct Message",
    channelId: "shweta-humnabadkar",
    time: "23 mins",
    reactionPill: "🙏 1",
    preview: (
      <span>
        <span className="text-gray-500">You: </span>
        <span className="text-blue-500 underline">https://salesforce.enterprise.slack.com/ar…</span>
      </span>
    ),
    fullContext: [
      {
        sender: "Rita Patel",
        avatarUrl: RITA_AVATAR,
        time: "Today at 8:30 AM",
        text: "Hey Shweta — sharing the Slack CRM pilot deck. https://salesforce.enterprise.slack.com/archives/C0123456/p1234567890",
        isHighlighted: true,
      },
      {
        sender: "Shweta Humnabadkar",
        avatarUrl: "https://randomuser.me/api/portraits/med/women/20.jpg",
        time: "Today at 8:40 AM",
        text: "🙏 Thanks! I've been waiting for this — will review before our 10am sync.",
      },
    ],
  },

  /* ── 4. Reed Strauss — post in #ai-club (unread, 3 replies) ────────────── */
  {
    id: "act-reed",
    user: "Reed Strauss",
    avatarUrl: REED_AVATAR,
    avatarBadge: "#",
    action: "Post in",
    channel: "#ai-club",
    channelId: "general",
    channelLabel: "# ai-club",
    time: "16 mins",
    unread: true,
    replyCount: 3,
    preview: "Is anyone else getting 429 errors when running Gemini CLI? I haven't used it i…",
    fullContext: [
      {
        sender: "Reed Strauss",
        avatarUrl: REED_AVATAR,
        time: "Today at 9:44 AM",
        text: "Is anyone else getting 429 errors when running Gemini CLI? I haven't used it in a couple weeks and suddenly it's rate-limiting me on basic requests. Wondering if they changed the free tier limits.",
        isHighlighted: true,
      },
      {
        sender: "Evan Isnor",
        avatarUrl: "https://randomuser.me/api/portraits/med/men/55.jpg",
        time: "Today at 9:48 AM",
        text: "Yeah I hit this too — they quietly tightened the RPM on the flash model. Switch to the pro endpoint, it's still fine.",
      },
      {
        sender: "Jordan Hayes",
        avatarUrl: JORDAN_AVATAR,
        time: "Today at 9:52 AM",
        text: "Confirmed. Also check if you're on v0.3.2 of the CLI — the older version was sending duplicate requests on retry.",
      },
    ],
  },

  /* ── 6. Evan Isnor — post in #ai-club (unread, 1 reply) ────────────────── */
  {
    id: "act-evan",
    user: "Evan Isnor",
    avatarUrl: "https://randomuser.me/api/portraits/med/men/55.jpg",
    avatarBadge: "#",
    action: "Post in",
    channel: "#ai-club",
    channelId: "general",
    channelLabel: "# ai-club",
    time: "45 mins",
    unread: true,
    replyCount: 1,
    preview: "Another post from this week from me, sharing my thoughts on how to use AI coding tools to stretch your…",
    fullContext: [
      {
        sender: "Evan Isnor",
        avatarUrl: "https://randomuser.me/api/portraits/med/men/55.jpg",
        time: "Today at 7:45 AM",
        text: "Another post from this week — sharing my thoughts on how to use AI coding tools to stretch your output as a solo builder. The key insight: treat the AI like a junior dev, not a magic wand.",
        isHighlighted: true,
      },
      {
        sender: "Rita Patel",
        avatarUrl: RITA_AVATAR,
        time: "Today at 7:55 AM",
        text: "Love this framing Evan. We've been doing exactly this for the Slack CRM prototype — one shot prompts with tight boundaries. Game-changer for demo velocity.",
      },
      {
        sender: "Jordan Hayes",
        avatarUrl: JORDAN_AVATAR,
        time: "Today at 8:00 AM",
        text: "Saving this thread. The 'junior dev' mental model makes so much more sense than trying to get it to do everything in one go.",
      },
    ],
  },

  /* ── 7. Sarah Chen — mentioned you (unread) ────────────────────────────── */
  {
    id: "act-sporty",
    user: "Sarah Chen",
    avatarUrl: SARAH_AVATAR,
    avatarBadge: "@",
    action: "Mentioned you in",
    channel: "#deal-sporty",
    channelId: "deal-sporty",
    channelLabel: "# deal-sporty",
    time: "1h ago",
    unread: true,
    preview: "how is the poc going? any blockers? I have the SE team on standby…",
    fullContext: [
      {
        sender: "Rita Patel",
        avatarUrl: RITA_AVATAR,
        time: "Yesterday at 4:00 PM",
        text: "Just wrapped the discovery call with Sporty Nation. Chris Park (VP Digital) is interested but needs to see the inventory forecasting module in a live demo.",
      },
      {
        sender: "Dana Torres",
        avatarUrl: DANA_AVATAR,
        time: "Yesterday at 4:30 PM",
        text: "I'll set up the demo environment for Friday. Make sure to highlight the real-time analytics — that was their biggest ask in the RFP.",
      },
      {
        sender: "Sarah Chen",
        avatarUrl: SARAH_AVATAR,
        time: "Today at 8:45 AM",
        text: "@Rita Patel how is the poc going? any blockers? I have the SE team on standby if you need custom demo data built out. $270K at stake — let's not leave anything on the table.",
        isHighlighted: true,
      },
    ],
  },

  /* ── 8. Anika Rao — DM (unread, 2 replies) ─────────────────────────────── */
  {
    id: "act-anika",
    user: "Anika Rao",
    avatarUrl: ANIKA_AVATAR,
    avatarBadge: "💬",
    action: "DM",
    channel: "Direct Message",
    channelId: "anika-rao",
    time: "1h ago",
    unread: true,
    replyCount: 2,
    preview: "Hey Rita — the enablement deck for Q1 kickoff is ready. Can you review slides 8-12 before EOD?",
    fullContext: [
      {
        sender: "Anika Rao",
        avatarUrl: ANIKA_AVATAR,
        time: "Today at 8:15 AM",
        text: "Hey Rita — the enablement deck for Q1 kickoff is ready. Can you review slides 8-12 before EOD? I want to make sure the Slack CRM demo flow matches what you're building.",
        isHighlighted: true,
      },
      {
        sender: "Rita Patel",
        avatarUrl: RITA_AVATAR,
        time: "Today at 8:20 AM",
        text: "On it — will flag anything that doesn't match the latest prototype. Expect notes by 3pm.",
      },
    ],
  },

  /* ── 9. Priya Shah — thread in #deal-novacorp (read) ───────────────────── */
  {
    id: "act-novacorp",
    user: "Priya Shah",
    avatarUrl: PRIYA_AVATAR,
    avatarBadge: "💬",
    action: "Thread in",
    channel: "#deal-novacorp",
    channelId: "deal-novacorp",
    channelLabel: "# deal-novacorp",
    time: "2h ago",
    preview: "msa is ready. just need their legal to review clause 7.2. Can you confirm the non-standard terms?",
    fullContext: [
      {
        sender: "Rita Patel",
        avatarUrl: RITA_AVATAR,
        time: "Yesterday at 2:00 PM",
        text: "NovaCorp wants to sign by Friday. Can we fast-track the MSA review? Marcus Lee just got their legal contact — Sandra Nguyen (General Counsel).",
      },
      {
        sender: "Priya Shah",
        avatarUrl: PRIYA_AVATAR,
        time: "Yesterday at 3:15 PM",
        text: "Focus on clause 7.2 — non-standard indemnification terms. They'll almost certainly push back on that one.",
      },
      {
        sender: "Priya Shah",
        avatarUrl: PRIYA_AVATAR,
        time: "Today at 9:15 AM",
        text: "msa is ready. just need their legal to review clause 7.2. Can you confirm the non-standard terms? I have two alternative wordings we can offer if Sandra pushes back.",
        isHighlighted: true,
      },
    ],
  },

  /* ── 10. Carlos Mendez — post in #sales-ops (unread, 7 replies) ─────── */
  {
    id: "act-carlos",
    user: "Carlos Mendez",
    avatarUrl: CARLOS_AVATAR,
    avatarBadge: "#",
    action: "Post in",
    channel: "#sales-ops",
    channelId: "sales",
    channelLabel: "# sales-ops",
    time: "2h ago",
    unread: true,
    replyCount: 7,
    preview: "Q1 forecast spreadsheet is locked. Final numbers: $2.4M committed, $1.8M best-case. Pipeline coverage at 3.1x…",
    fullContext: [
      {
        sender: "Carlos Mendez",
        avatarUrl: CARLOS_AVATAR,
        time: "Today at 7:30 AM",
        text: "Q1 forecast spreadsheet is locked. Final numbers: $2.4M committed, $1.8M best-case. Pipeline coverage at 3.1x — healthiest it's been in 3 quarters. Big thanks to the deal-room channels for the visibility.",
        isHighlighted: true,
      },
      {
        sender: "Sarah Chen",
        avatarUrl: SARAH_AVATAR,
        time: "Today at 7:35 AM",
        text: "Great numbers Carlos. The deal-room model is working — we should formalize it for all Enterprise reps next quarter.",
      },
      {
        sender: "Rita Patel",
        avatarUrl: RITA_AVATAR,
        time: "Today at 7:40 AM",
        text: "Agree. Having the CRM data piped into Slack channels gave us real-time signals we never had before. No more Friday scrambles.",
      },
    ],
  },

  /* ── 11. Jordan Hayes — reacted (read) ──────────────────────────────────── */
  {
    id: "act-runners",
    user: "Jordan Hayes",
    avatarUrl: JORDAN_AVATAR,
    avatarBadge: "🚀",
    action: "Reacted to your message in",
    channel: "#deal-runners",
    channelId: "deal-runners",
    channelLabel: "# deal-runners",
    time: "3h ago",
    reactionPill: "🚀 1",
    preview: "Jordan reacted with 🚀 to: \"cfo approved! budget objection resolved. deal back on track\"",
    fullContext: [
      {
        sender: "Rita Patel",
        avatarUrl: RITA_AVATAR,
        time: "Today at 9:20 AM",
        text: "cfo approved! budget objection resolved. deal back on track 🚀",
        isHighlighted: true,
      },
      {
        sender: "Sarah Chen",
        avatarUrl: SARAH_AVATAR,
        time: "Today at 9:22 AM",
        text: "excellent work team. $720k commit secured. this is exactly the kind of persistence we need for q1 🎉",
      },
      {
        sender: "Jordan Hayes",
        avatarUrl: JORDAN_AVATAR,
        time: "Today at 9:25 AM",
        text: "nice. that was a close one. the roi deck made all the difference — showed 3.2x roi over 3 years using their actual poc usage data.",
      },
    ],
  },

  /* ── 12. Marcus Lee — DM (read) ─────────────────────────────────────────── */
  {
    id: "act-marcus",
    user: "Marcus Lee",
    avatarUrl: MARCUS_AVATAR,
    avatarBadge: "💬",
    action: "DM",
    channel: "Direct Message",
    channelId: "marcus-lee",
    time: "4h ago",
    preview: "Hey — just got off the phone with NovaCorp's procurement. They're ready to move if we can turn the MSA around by Thursday.",
    fullContext: [
      {
        sender: "Marcus Lee",
        avatarUrl: MARCUS_AVATAR,
        time: "Today at 6:30 AM",
        text: "Hey — just got off the phone with NovaCorp's procurement. They're ready to move if we can turn the MSA around by Thursday. Sandra (their GC) is flexible on most terms, but clause 7.2 is non-negotiable for her.",
        isHighlighted: true,
      },
      {
        sender: "Rita Patel",
        avatarUrl: RITA_AVATAR,
        time: "Today at 6:45 AM",
        text: "Perfect — Priya already flagged 7.2. I'll sync with legal today and push for a Thursday turnaround. This deal is too close to let a contract clause slow us down.",
      },
    ],
  },
];

// ── Avatar helper (used in right panel) ──────────────────────────────────────
function Avatar({ src, name, size = 8 }: { src: string; name: string; size?: number }) {
  const [avatarError, setAvatarError] = React.useState(false);
  const [avatarSrc, setAvatarSrc] = React.useState(src);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    if (!avatarError) {
      setAvatarError(true);
      setAvatarSrc(generateInitialsAvatar(name, size * 4));
    }
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarSrc}
      alt={name}
      className={`w-${size} h-${size} rounded-md object-cover flex-shrink-0`}
      onError={handleError}
    />
  );
}

// ── Rich message data for right-hand pane ──────────────────────────────────────
const RICH_MESSAGES: Record<string, Array<{
  id: string;
  name: string;
  avatar: string;
  time: string;
  tag?: string;
  text?: string;
  workflow?: {
    source: string;
    data: Record<string, React.ReactNode>;
  };
  reactions?: Array<{ emoji: string; count: number }>;
  replies?: {
    count: number;
    avatars: string[];
    lastTime: string;
  };
}>> = {
  "act-stephane": [
    {
      id: "m1",
      name: "Pradeep Kalyan Lanke",
      avatar: "https://randomuser.me/api/portraits/med/men/45.jpg",
      time: "12:18 AM",
      text: 'Its been a while I heard from perplexity. Now they are joining computer use mania [https://www.perplexity.ai/mk/hub/blog/introducing-perplexity-computer](https://www.perplexity.ai/mk/hub/blog/introducing-perplexity-computer)',
      reactions: [{ emoji: "✅", count: 1 }, { emoji: "🎯", count: 1 }],
      replies: { count: 2, avatars: ["https://randomuser.me/api/portraits/med/men/22.jpg", "https://randomuser.me/api/portraits/med/women/44.jpg"], lastTime: "today at 2:25 AM" }
    },
    {
      id: "m2",
      name: "SFW Support Request",
      tag: "WORKFLOW",
      avatar: "/slackbot-logo.svg",
      time: "10:00 AM",
      workflow: {
        source: "#help-salesforce-workspaces",
        data: {
          "Submitted by": <span className="text-blue-600">@Chetan Jayadevaiah</span>,
          "Product": "Cursor",
          "Category": "Connectivity",
          "Problem Summary": "Unable to connect to Cursor , after I installed cursor help tools and new cursor update"
        }
      },
      replies: { count: 7, avatars: ["https://randomuser.me/api/portraits/med/men/35.jpg", "https://randomuser.me/api/portraits/med/women/65.jpg"], lastTime: "today at 11:07 AM" }
    }
  ],
  "act-shweta": [
    {
      id: "m3",
      name: "Shweta Humnabadkar",
      avatar: "https://randomuser.me/api/portraits/med/women/50.jpg",
      time: "Yesterday",
      text: "Hey Rita! Can you review the Q1 pipeline report? I've added the latest deal updates.",
      reactions: [{ emoji: "🙏", count: 1 }],
      replies: { count: 3, avatars: ["https://randomuser.me/api/portraits/med/women/90.jpg"], lastTime: "yesterday at 4:30 PM" }
    }
  ]
};

// ── Main component ────────────────────────────────────────────────────────────
export function SlackActivityView() {
  const instanceIdRef = React.useRef(`activity-${Math.random().toString(36).slice(2, 8)}`);
  const [activeId, setActiveId] = useState(ACTIVITY_ITEMS[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const [messages, setMessages] = useState<Array<{
    id: string;
    name: string;
    avatar: string;
    time: string;
    tag?: string;
    text?: string;
    workflow?: {
      source: string;
      data: Record<string, React.ReactNode>;
    };
    reactions?: Array<{ emoji: string; count: number }>;
    replies?: {
      count: number;
      avatars: string[];
      lastTime: string;
    };
  }>>(() => {
    const activeItem = ACTIVITY_ITEMS.find((a) => a.id === activeId);
    return RICH_MESSAGES[activeId] || (activeItem ? activeItem.fullContext.map((msg, i) => ({
      id: `msg-${i}`,
      name: msg.sender,
      avatar: msg.avatarUrl,
      time: msg.time,
      text: msg.text
    })) : []);
  });
  
  const activeItem = ACTIVITY_ITEMS.find((a) => a.id === activeId)!;

  React.useEffect(() => {
  }, []);

  // Update messages when activeId changes
  React.useEffect(() => {
    const richMessages = RICH_MESSAGES[activeId];
    if (richMessages) {
      setMessages(richMessages);
    } else {
      const item = ACTIVITY_ITEMS.find((a) => a.id === activeId);
      if (item) {
        setMessages(item.fullContext.map((msg, i) => ({
          id: `msg-${i}`,
          name: msg.sender,
          avatar: msg.avatarUrl,
          time: msg.time,
          text: msg.text
        })));
      }
    }
  }, [activeId]);

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      name: "Rita Patel",
      avatar: RITA_AVATAR,
      time: "Just now",
      text: text,
      reactions: [],
      replies: { count: 0, avatars: [], lastTime: "" }
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex h-full overflow-hidden bg-white" style={{ borderRadius: 24 }}>

      {/* ── Left feed — Activity Beta card style ─────────────────────────────── */}
      <div className="w-[340px] border-r border-gray-200 flex flex-col bg-white flex-shrink-0">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-[20px] text-gray-900">Activity</h1>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Beta</span>
          </div>
          <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-700 transition-colors" />
        </div>

        {/* Tabs */}
        <div className="flex px-4 border-b border-gray-200 gap-5 text-[14px] font-bold">
          <button className="text-[#611f69] border-b-2 border-[#611f69] pb-2 flex items-center gap-1.5">
            All{" "}
            <span className="bg-[#611f69] text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">
              {ACTIVITY_ITEMS.length}
            </span>
          </button>
          <button className="text-gray-500 pb-2 hover:text-gray-800 font-medium">DMs</button>
          <button className="text-gray-500 pb-2 hover:text-gray-800 font-medium text-[18px] leading-none pb-3">+</button>
        </div>

        {/* Filter toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-white">
          <div className="flex gap-2">
            <button className="flex items-center border border-gray-300 rounded px-1.5 py-1 hover:bg-gray-50 transition-colors">
              <Square className="w-4 h-4 text-gray-400" />
              <ChevronDown className="w-3 h-3 ml-0.5 text-gray-500" />
            </button>
            <button className="flex items-center border border-gray-300 rounded px-2 py-1 hover:bg-gray-50 transition-colors">
              <AlignJustify className="w-3 h-3 mr-1 text-gray-500" />
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>
          </div>
          <div className="flex gap-0.5 border border-gray-300 rounded p-0.5">
            <button className="bg-gray-200 rounded p-1">
              <List className="w-4 h-4 text-gray-700" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <AlignJustify className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Scrollable card list */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-3">
          {ACTIVITY_ITEMS.map((item, idx) => {
            const isActive = activeId === item.id;
            const isHovered = hoveredId === item.id;
            const isUnread = Boolean(item.unread) && !readIds.has(item.id);
            const showActions = isActive || isHovered;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveId(item.id);
                  if (item.unread) {
                    setReadIds((prev) => {
                      if (prev.has(item.id)) return prev;
                      const next = new Set(prev);
                      next.add(item.id);
                      return next;
                    });
                  }
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`w-full text-left relative bg-white rounded-xl border-2 group transition-all mb-3 overflow-hidden outline-none focus:outline-none focus:border-[#611f69] ${
                  isActive
                    ? "border-[#611f69] shadow-sm"
                    : "border-gray-200 hover:border-gray-300 shadow-sm"
                }`}
              >
                {!isActive && isUnread && (
                  <div className="absolute left-0 top-[8px] bottom-[8px] w-[2px] bg-[#611f69]" />
                )}
                <div className="p-3 pl-2 w-full">
                  <div className="flex items-start gap-3">
                    {/* Avatar with overlapping badge */}
                    <div className="relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.avatarUrl}
                        alt={item.user}
                        className="w-10 h-10 rounded-lg border border-gray-100 object-cover"
                        onLoad={(e) => {
                          const target = e.target as HTMLImageElement;
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.startsWith('data:')) {
                            target.src = generateInitialsAvatar(item.user, 40);
                          }
                        }}
                      />
                      {item.avatarBadge && (
                        <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-white border border-gray-200 rounded flex items-center justify-center text-[10px] text-gray-500 font-bold shadow-sm">
                          {item.avatarBadge}
                        </div>
                      )}
                    </div>

                    {/* Header/meta block */}
                    <div className="flex-1 min-w-0 relative">
                      {showActions && (
                        <div className="absolute top-0 right-0 flex items-center gap-2 bg-white pl-2">
                          <Bookmark className="w-4 h-4 text-gray-500 hover:text-gray-800" />
                          <PenSquare className="w-4 h-4 text-gray-500 hover:text-gray-800" />
                          <MoreVertical className="w-4 h-4 text-gray-500 hover:text-gray-800" />
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-1 pr-1">
                        <span className="text-[14px] truncate pr-2 font-normal text-gray-800">
                          {item.user}
                        </span>
                        {!showActions && (
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {item.replyCount !== undefined && (
                              <span className="bg-[#8b3a75] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                💬 {item.replyCount}
                              </span>
                            )}
                            {item.time && <span className="text-[12px] text-gray-500">{item.time}</span>}
                          </div>
                        )}
                      </div>

                      {item.action && (
                        <div className="text-[13px] text-gray-600 mb-1 flex items-center gap-1 truncate">
                          {item.action}
                          {(item.channelLabel ?? item.channel) && (
                          <span className="bg-gray-100 text-gray-700 font-normal px-1.5 py-0.5 rounded text-[11px] border border-gray-200">
                              {item.channelLabel ?? item.channel}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview now spans full row below avatar/header */}
                  <div className="mt-2 text-[14px] line-clamp-2 leading-snug text-gray-700 font-normal">
                    {item.preview}
                    {item.previewSuffix}
                  </div>

                  {item.reactionPill && (
                    <div className="mt-2 inline-flex items-center bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {item.reactionPill}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right detail pane ────────────────────────────────────────────────── */}
      <UniversalChatSurface
        title={
          <>
            <span className="text-gray-400 font-normal">#</span>
            {activeItem.channel.replace("#", "")}
          </>
        }
        icon={<span className="text-xl">#</span>}
        memberCount={8455}
        placeholder={`Message ${activeItem.channel}`}
        onSendMessage={handleSendMessage}
      >
        {/* Unread Separator */}
        {activeItem.unread && (
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">New</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>
        )}

        {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </UniversalChatSurface>
    </div>
  );
}
