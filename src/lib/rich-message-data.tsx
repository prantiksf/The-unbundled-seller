// Rich message data for universal ChatMessage component
// This data models real Slack features: Workflows, Threads, Reactions

import React from 'react';

export interface RichMessage {
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
}

export const RICH_MESSAGES: Record<string, RichMessage[]> = {
  "community-cursor": [
    {
      id: "m1",
      name: "Pradeep Kalyan Lanke",
      avatar: "https://randomuser.me/api/portraits/med/men/33.jpg",
      time: "12:18 AM",
      text: "Its been a while I heard from perplexity. Now they are joining computer use mania [https://www.perplexity.ai/mk/hub/blog/introducing-perplexity-computer](https://www.perplexity.ai/mk/hub/blog/introducing-perplexity-computer)",
      reactions: [
        { emoji: "✅", count: 1 },
        { emoji: "🎯", count: 1 }
      ],
      replies: {
        count: 2,
        avatars: [
          "https://randomuser.me/api/portraits/med/men/22.jpg",
          "https://randomuser.me/api/portraits/med/women/44.jpg"
        ],
        lastTime: "today at 2:25 AM"
      }
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
      replies: {
        count: 7,
        avatars: [
          "https://randomuser.me/api/portraits/med/men/8.jpg",
          "https://randomuser.me/api/portraits/med/women/32.jpg"
        ],
        lastTime: "today at 11:07 AM"
      }
    }
  ],
  "ai-club": [
    {
      id: "m3",
      name: "Evan Isnor",
      avatar: "https://randomuser.me/api/portraits/med/men/22.jpg",
      time: "45 mins",
      text: "Another post from this week from me, sharing my thoughts on how to use AI effectively in our workflow...",
      reactions: [
        { emoji: "👍", count: 3 },
        { emoji: "💡", count: 2 }
      ],
      replies: {
        count: 1,
        avatars: ["https://randomuser.me/api/portraits/med/women/44.jpg"],
        lastTime: "30 mins"
      }
    }
  ],
  "slackbot": [
    {
      id: "m4",
      name: "Slackbot",
      avatar: "/slackbot-logo.svg",
      time: "30 mins",
      text: "I'll help you find your incomplete action items and threads needing follow-up from the last 7 days. Let me review your activity threads...",
      replies: {
        count: 0,
        avatars: [],
        lastTime: ""
      }
    }
  ],
  "sarah-chen": [
    {
      id: "m5",
      name: "Sarah Chen",
      avatar: "https://randomuser.me/api/portraits/med/women/44.jpg",
      time: "Yesterday",
      text: "rita — runners club deal reopened. cfo wants roi deck before they'll commit. can you get jordan on this? 👀",
      reactions: [
        { emoji: "👀", count: 2 }
      ],
      replies: {
        count: 3,
        avatars: [
          "https://randomuser.me/api/portraits/med/women/90.jpg",
          "https://randomuser.me/api/portraits/med/men/22.jpg"
        ],
        lastTime: "Today"
      }
    },
    {
      id: "m6",
      name: "Rita Patel",
      avatar: "https://randomuser.me/api/portraits/med/women/90.jpg",
      time: "Yesterday",
      text: "on it. jordan's building it now. should have it by eod",
    },
    {
      id: "m7",
      name: "Sarah Chen",
      avatar: "https://randomuser.me/api/portraits/med/women/44.jpg",
      time: "Today",
      text: "jordan sent the deck. shared with cfo. waiting on feedback",
      reactions: [
        { emoji: "✅", count: 1 }
      ]
    }
  ],
  "priya-shah": [
    {
      id: "m8",
      name: "Priya Shah",
      avatar: "https://randomuser.me/api/portraits/med/women/32.jpg",
      time: "Today",
      text: "greentech sow is back. legal flagged 3 redlines in section 4",
      reactions: [
        { emoji: "⚠️", count: 1 }
      ],
      replies: {
        count: 2,
        avatars: [
          "https://randomuser.me/api/portraits/med/women/90.jpg"
        ],
        lastTime: "Today"
      }
    },
    {
      id: "m9",
      name: "Priya Shah",
      avatar: "https://randomuser.me/api/portraits/med/women/32.jpg",
      time: "10:20 AM",
      text: "msa is ready. just need their legal to sign off. should be done by friday",
      reactions: [
        { emoji: "🎉", count: 2 },
        { emoji: "👍", count: 1 }
      ]
    }
  ],
  "jordan-hayes": [
    {
      id: "m10",
      name: "Jordan Hayes",
      avatar: "https://randomuser.me/api/portraits/med/men/22.jpg",
      time: "Yesterday",
      text: "runners club roi deck is done. sent to you and sarah",
      reactions: [
        { emoji: "🚀", count: 3 },
        { emoji: "💯", count: 1 }
      ],
      replies: {
        count: 4,
        avatars: [
          "https://randomuser.me/api/portraits/med/women/90.jpg",
          "https://randomuser.me/api/portraits/med/women/44.jpg"
        ],
        lastTime: "Today"
      }
    },
    {
      id: "m11",
      name: "Jordan Hayes",
      avatar: "https://randomuser.me/api/portraits/med/men/22.jpg",
      time: "Yesterday",
      text: "built it with their actual usage data. shows 3.2x roi over 3 years",
      reactions: [
        { emoji: "📊", count: 2 }
      ]
    }
  ],
  "deal-sporty": [
    {
      id: "m12",
      name: "Dana Torres",
      avatar: "https://randomuser.me/api/portraits/med/women/28.jpg",
      time: "2 weeks ago",
      text: "sporty nation deal is moving forward. i'll get you the exec sponsor intro",
      reactions: [
        { emoji: "👍", count: 1 }
      ]
    },
    {
      id: "m13",
      name: "Rita Patel",
      avatar: "https://randomuser.me/api/portraits/med/women/90.jpg",
      time: "Today",
      text: "14 days silent. champion gone dark. should i escalate?",
      reactions: [
        { emoji: "⚠️", count: 2 }
      ],
      replies: {
        count: 5,
        avatars: [
          "https://randomuser.me/api/portraits/med/women/28.jpg",
          "https://randomuser.me/api/portraits/med/men/35.jpg"
        ],
        lastTime: "Today"
      }
    }
  ],
  "deal-novacorp": [
    {
      id: "m14",
      name: "Salesforce Workflow",
      tag: "WORKFLOW",
      avatar: "/slackbot-logo.svg",
      time: "Today",
      workflow: {
        source: "#deal-novacorp",
        data: {
          "Deal Stage": <span className="text-blue-600">Negotiation</span>,
          "Amount": "$540,000",
          "Close Date": "March 15, 2024",
          "Next Step": "MSA review with legal team",
          "Owner": "Rita Patel"
        }
      },
      reactions: [
        { emoji: "📋", count: 1 }
      ],
      replies: {
        count: 3,
        avatars: [
          "https://randomuser.me/api/portraits/med/women/90.jpg",
          "https://randomuser.me/api/portraits/med/women/32.jpg"
        ],
        lastTime: "2 hours ago"
      }
    },
    {
      id: "m15",
      name: "Priya Shah",
      avatar: "https://randomuser.me/api/portraits/med/women/32.jpg",
      time: "1 hour ago",
      text: "MSA terms confirmed. Standard liability caps accepted. Ready for signature.",
      reactions: [
        { emoji: "✅", count: 3 },
        { emoji: "🎉", count: 2 }
      ]
    }
  ],
  "general": [
    {
      id: "m16",
      name: "Evan Isnor",
      avatar: "https://randomuser.me/api/portraits/med/men/22.jpg",
      time: "45 mins",
      text: "Another post from this week from me, sharing my thoughts on how to use AI effectively in our workflow. The key is finding the right balance between automation and human oversight.",
      reactions: [
        { emoji: "👍", count: 5 },
        { emoji: "💡", count: 3 },
        { emoji: "🔥", count: 2 }
      ],
      replies: {
        count: 8,
        avatars: [
          "https://randomuser.me/api/portraits/med/women/44.jpg",
          "https://randomuser.me/api/portraits/med/men/33.jpg",
          "https://randomuser.me/api/portraits/med/women/50.jpg"
        ],
        lastTime: "30 mins"
      }
    }
  ]
};

// Helper to get rich messages for a channel/DM
export function getRichMessages(channelId: string): RichMessage[] {
  return RICH_MESSAGES[channelId] || [];
}
