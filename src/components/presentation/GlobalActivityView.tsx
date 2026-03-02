"use client";

import { useEffect, useMemo, useRef } from "react";
import { useDemoData, useDemoMessages } from "@/context/DemoDataContext";
import { useActiveChat } from "@/components/presentation/SlackAppShell";
import { DemoChannelHeader } from "@/app/(demo)/demo/workspace/[workspaceId]/channel/[channelId]/_components/DemoChannelHeader";
import { DemoMessageList } from "@/app/(demo)/demo/workspace/[workspaceId]/channel/[channelId]/_components/DemoMessageList";
import { DemoMessageInput } from "@/app/(demo)/demo/workspace/[workspaceId]/channel/[channelId]/_components/DemoMessageInput";

export function GlobalActivityView() {
  const { channels, dms, markChannelAsRead } = useDemoData();
  const { activeChatId, setActiveChatId } = useActiveChat();

  const channelAndDmItems = useMemo(
    () => [...channels.map((ch) => ({ ...ch, type: "channel" as const })), ...dms.map((dm) => ({ ...dm, type: "dm" as const }))],
    [channels, dms]
  );

  const selectedChannelId = activeChatId || channelAndDmItems[0]?.id || "";
  const messages = useDemoMessages(selectedChannelId);
  const isDM = dms.some((d) => d.id === selectedChannelId);
  const placeholder = isDM ? "Reply..." : `Message #${selectedChannelId}`;
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeChatId && channelAndDmItems[0]?.id) {
      setActiveChatId(channelAndDmItems[0].id);
    }
  }, [activeChatId, channelAndDmItems, setActiveChatId]);

  useEffect(() => {
    if (selectedChannelId) markChannelAsRead(selectedChannelId);
  }, [selectedChannelId, markChannelAsRead]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [selectedChannelId, messages.length]);

  if (!selectedChannelId) {
    return (
      <div className="flex flex-col h-full min-h-0 bg-white items-center justify-center">
        <p className="text-[#616061] text-sm">No activity items available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      <div className="shrink-0">
        <DemoChannelHeader channelId={selectedChannelId} />
      </div>
      <div ref={scrollerRef} className="flex-1 overflow-y-auto min-h-0">
        <DemoMessageList messages={messages} channelId={selectedChannelId} />
      </div>
      <div className="shrink-0 px-3 py-2">
        <DemoMessageInput channelId={selectedChannelId} placeholder={placeholder} />
      </div>
    </div>
  );
}
