"use client";

import { MessageInput } from "@/components/shared/MessageInput";

interface DemoMessageInputProps {
  channelId: string;
  placeholder?: string;
}

export function DemoMessageInput({ channelId, placeholder }: DemoMessageInputProps) {
  const ph = placeholder ?? `Message #${channelId}`;

  return <MessageInput placeholder={ph} />;
}
