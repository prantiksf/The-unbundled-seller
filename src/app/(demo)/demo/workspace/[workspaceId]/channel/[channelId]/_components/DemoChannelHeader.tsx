"use client";

import { useState } from "react";
import { useDemoData } from "@/context/DemoDataContext";
import { useSlackbot } from "../../../_context/demo-layout-context";
import {
  IconUsers,
  IconHeadphones,
  IconPin,
  IconSearch,
  IconMore,
  IconX,
  IconChevronDown,
} from "@/components/icons";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SLACK_TOKENS } from "@/design/slack-tokens";

const T = SLACK_TOKENS;

interface DemoChannelHeaderProps {
  channelId: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function DemoChannelHeader({ channelId, activeTab: controlledActiveTab, onTabChange }: DemoChannelHeaderProps) {
  const [internalActiveTab, setInternalActiveTab] = useState("messages");
  const { channels, dms } = useDemoData();
  const { isOpen, toggle } = useSlackbot();
  const channel = channels.find((c) => c.id === channelId) ?? dms.find((d) => d.id === channelId);
  const name = channel?.name ?? channelId;
  const isChannel = !!channels.find((c) => c.id === channelId);
  const displayName = isChannel ? `#${name}` : name;
  
  // Use controlled tab if provided, otherwise use internal state
  const activeTab = controlledActiveTab ?? internalActiveTab;
  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  // Only show Canvas tab for deal-acme-q1-strategic
  const isDealRoom = channelId === "deal-acme-q1-strategic";
  const tabs = isDealRoom
    ? [
        { id: "messages", label: "Messages" },
        { id: "canvas", label: "Canvas" },
        { id: "files", label: "Files" },
        { id: "bookmarks", label: "Bookmarks" },
      ]
    : [
        { id: "messages", label: "Messages" },
        { id: "pins", label: "Pins" },
        { id: "files", label: "Files" },
        { id: "more", label: "More" },
      ];

  return (
    <header
      className="flex flex-col shrink-0 border-b bg-white"
      style={{ borderColor: T.colors.border }}
    >
      <div className="flex items-center justify-between px-4 h-[49px]">
        <span className="text-[18px] font-semibold" style={{ color: T.colors.text }}>{displayName}</span>
        <div className="flex items-center gap-1">
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="People">
            <IconUsers width={T.iconSizes.channelHeader} height={T.iconSizes.channelHeader} stroke="currentColor" />
          </button>
          <span style={{ fontSize: T.typography.small, color: T.colors.textSecondary }}>8</span>
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Call">
            <IconHeadphones width={T.iconSizes.channelHeader} height={T.iconSizes.channelHeader} stroke="currentColor" />
          </button>
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Pin">
            <IconPin width={T.iconSizes.channelHeader} height={T.iconSizes.channelHeader} stroke="currentColor" />
          </button>
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Search">
            <IconSearch width={T.iconSizes.channelHeader} height={T.iconSizes.channelHeader} stroke="currentColor" />
          </button>
          <button 
            type="button" 
            className={cn("p-2 rounded hover:bg-[#f8f8f8]", isOpen && "bg-[#f8f8f8]")} 
            style={{ color: T.colors.textSecondary }} 
            title="Toggle Slackbot"
            onClick={toggle}
          >
            <Image src="/slackbot-logo.svg" alt="Slackbot" width={18} height={18} />
          </button>
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="More">
            <IconMore width={T.iconSizes.channelHeader} height={T.iconSizes.channelHeader} stroke="currentColor" />
          </button>
          <button type="button" className="p-2 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Close">
            <IconX width={T.iconSizes.channelHeader} height={T.iconSizes.channelHeader} stroke="currentColor" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-1 px-4 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "px-3 py-1 text-[13px] font-medium rounded",
              activeTab === tab.id ? "" : "hover:bg-[#f8f8f8]"
            )}
            style={activeTab === tab.id ? { color: T.colors.text, backgroundColor: T.colors.backgroundAlt } : { color: T.colors.textSecondary }}
          >
            {tab.label}
          </button>
        ))}
        <button type="button" className="p-1 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="More tabs">
          <IconChevronDown width={14} height={14} stroke="currentColor" />
        </button>
      </div>
    </header>
  );
}
