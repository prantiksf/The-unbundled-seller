"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface DemoMessage {
  id: string;
  author: string;
  authorImage?: string | null;
  timestamp: string;
  body?: string | null;
  blocks?: SlackBlock[] | null;
}

export interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  fields?: Array<{ type: string; text: string }>;
  elements?: Array<{
    type: string;
    text: { type: string; text: string; emoji?: boolean };
    action_id?: string;
    style?: string;
  }>;
}

export interface DemoWorkspace {
  id: string;
  name: string;
}

export interface DemoChannel {
  id: string;
  name: string;
}

export interface DemoDM {
  id: string;
  name: string;
  isSlackbot?: boolean;
  avatarUrl?: string; // Optional avatar; falls back to UI Avatars from name
  status?: "online" | "away" | "dnd" | "call"; // Status indicator
}

export interface DemoFile {
  id: string;
  name: string;
  channelId: string;
  timestamp: string;
}

export interface DemoSavedItem {
  id: string;
  channelId: string;
  preview: string;
  timestamp: string;
}

const DEMO_WORKSPACE: DemoWorkspace = { id: "demo-1", name: "Vibeface" };
const DEMO_CHANNELS: DemoChannel[] = [
  { id: "general", name: "general" },
  { id: "sales", name: "sales" },
  { id: "q3-pipeline", name: "q3-pipeline" },
  { id: "deal-acme", name: "deal-acme" },
  { id: "deal-runners", name: "deal-runners" },
  { id: "deal-greentech", name: "deal-greentech" },
  { id: "deal-sporty", name: "deal-sporty" },
  { id: "deal-techstart", name: "deal-techstart" },
];
// Avatar helper: fallback to initials for channels; DMs use explicit avatarUrl (real photos)
export function getAvatarUrl(name: string, size = 64): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=611f69&color=fff&size=${size}`;
}

// Author name -> avatar URL for chat messages (human photos + Slackbot logo)
const MESSAGE_AVATAR_MAP: Record<string, string> = {
  "Rita Patel": "https://randomuser.me/api/portraits/med/women/75.jpg",
  Slackbot: "/slackbot-logo.svg",
  "Sarah Chen": "https://randomuser.me/api/portraits/med/women/44.jpg",
  "Priya Shah": "https://randomuser.me/api/portraits/med/women/32.jpg",
  "Jordan Hayes": "https://randomuser.me/api/portraits/med/men/22.jpg",
  "Dana Torres": "https://randomuser.me/api/portraits/med/women/28.jpg",
  "Marcus Lee": "https://randomuser.me/api/portraits/med/men/8.jpg",
  "Lisa Park": "https://randomuser.me/api/portraits/med/women/65.jpg",
  "Daniel Kim": "https://randomuser.me/api/portraits/med/men/33.jpg",
  "Mike Torres": "https://randomuser.me/api/portraits/med/men/45.jpg",
  "Jen Walsh": "https://randomuser.me/api/portraits/med/women/52.jpg",
};

export function getMessageAvatarUrl(author: string): string | null {
  return MESSAGE_AVATAR_MAP[author] ?? null;
}

// Real human photos from RandomUser.me (portraits 0-99 for men/women)
const DEMO_DMS: DemoDM[] = [
  { id: "slackbot", name: "Slackbot", isSlackbot: true },
  { id: "sarah-chen", name: "Sarah Chen", status: "online", avatarUrl: "https://randomuser.me/api/portraits/med/women/44.jpg" },
  { id: "priya-shah", name: "Priya Shah", status: "away", avatarUrl: "https://randomuser.me/api/portraits/med/women/32.jpg" },
  { id: "jordan-hayes", name: "Jordan Hayes", status: "online", avatarUrl: "https://randomuser.me/api/portraits/med/men/22.jpg" },
  { id: "dana-torres", name: "Dana Torres", status: "dnd", avatarUrl: "https://randomuser.me/api/portraits/med/women/28.jpg" },
  { id: "marcus-lee", name: "Marcus Lee", status: "call", avatarUrl: "https://randomuser.me/api/portraits/med/men/8.jpg" },
  { id: "lisa-park", name: "Lisa Park", status: "online", avatarUrl: "https://randomuser.me/api/portraits/med/women/65.jpg" },
];

const DEMO_FILES: DemoFile[] = [
  { id: "f1", name: "Q3 Pipeline Deck.pdf", channelId: "q3-pipeline", timestamp: "Yesterday" },
  { id: "f2", name: "Greentech SOW Draft.docx", channelId: "deal-greentech", timestamp: "Yesterday" },
  { id: "f3", name: "TechStart QBR Slides.pptx", channelId: "deal-techstart", timestamp: "Today" },
  { id: "f4", name: "Runners Club Value Justification.pdf", channelId: "deal-runners", timestamp: "Today" },
  { id: "f5", name: "Acme Org Chart & Champions.docx", channelId: "deal-acme", timestamp: "Today" },
];

const DEMO_SAVED: DemoSavedItem[] = [
  { id: "s1", channelId: "general", preview: "Champion departed: Acme Corp — Marcus left...", timestamp: "10:36 AM" },
  { id: "s2", channelId: "sales", preview: "Meeting prep ready for TechStart QBR at 2:00 PM", timestamp: "9:16 AM" },
  { id: "s3", channelId: "slackbot", preview: "Proactive insights for today — $410K on track", timestamp: "Today" },
];

export const DEMO_USER_NAME = "Rita";

function getLastMessagePreview(messages: DemoMessage[]): string {
  if (!messages?.length) return "";
  const last = messages[messages.length - 1];
  if (last.body) return last.body.slice(0, 40) + (last.body.length > 40 ? "..." : "");
  if (last.blocks?.[0]?.text?.text) return last.blocks[0].text.text.slice(0, 40) + "...";
  return "";
}

interface DemoDataContextValue {
  workspace: DemoWorkspace;
  channels: DemoChannel[];
  dms: DemoDM[];
  files: DemoFile[];
  savedItems: DemoSavedItem[];
  messages: Record<string, DemoMessage[]>;
  demoData: Record<string, unknown> | null;
  blockKitMessages: Record<string, unknown> | null;
  getChannelPreview: (channelId: string) => { preview: string; timestamp: string };
}

const DemoDataContext = createContext<DemoDataContextValue | null>(null);

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Record<string, DemoMessage[]>>({});
  const [demoData, setDemoData] = useState<Record<string, unknown> | null>(null);
  const [blockKitMessages, setBlockKitMessages] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/demo-data.json")
      .then((r) => r.json())
      .then(setDemoData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/block-kit-messages.json")
      .then((r) => r.json())
      .then((data) => {
        setBlockKitMessages(data);
        const channelMessages = (data?.channel_messages as Record<string, DemoMessage[]>) || {};
        setMessages(channelMessages);
      })
      .catch(console.error);
  }, []);

  const getChannelPreview = (channelId: string) => {
    const msgs = messages[channelId] || [];
    const last = msgs[msgs.length - 1];
    return {
      preview: getLastMessagePreview(msgs),
      timestamp: last?.timestamp ?? "",
    };
  };

  const value: DemoDataContextValue = {
    workspace: DEMO_WORKSPACE,
    channels: DEMO_CHANNELS,
    dms: DEMO_DMS,
    files: DEMO_FILES,
    savedItems: DEMO_SAVED,
    messages,
    demoData,
    blockKitMessages,
    getChannelPreview,
  };

  return (
    <DemoDataContext.Provider value={value}>
      {children}
    </DemoDataContext.Provider>
  );
}

export function useDemoData() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("useDemoData must be used within DemoDataProvider");
  return ctx;
}

export function useDemoMessages(channelId: string): DemoMessage[] {
  const { messages } = useDemoData();
  return messages[channelId] || [];
}
