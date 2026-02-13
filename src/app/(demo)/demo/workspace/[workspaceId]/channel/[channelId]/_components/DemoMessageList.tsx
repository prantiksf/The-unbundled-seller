"use client";

import type { DemoMessage } from "@/context/DemoDataContext";
import { BlockKitRenderer } from "@/components/block-kit/BlockKitRenderer";
import { SLACK_TOKENS } from "@/design/slack-tokens";

const T = SLACK_TOKENS;

interface DemoMessageListProps {
  messages: DemoMessage[];
}

export function DemoMessageList({ messages }: DemoMessageListProps) {
  const reversed = [...messages].reverse();

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
      <div className="space-y-3 flex flex-col">
        {reversed.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div
              className="shrink-0 flex items-center justify-center text-white text-sm font-semibold"
              style={{ 
                width: `${T.iconSizes.messageAvatar}px`,
                height: `${T.iconSizes.messageAvatar}px`,
                backgroundColor: T.colors.avatarBg,
                borderRadius: `${T.radius.avatar}px`
              }}
            >
              {msg.author.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="font-bold text-[15px]" style={{ color: T.colors.text }}>
                  {msg.author}
                </span>
                <span className="text-[12px]" style={{ color: T.colors.textSecondary }}>{msg.timestamp}</span>
              </div>
              {msg.blocks ? (
                <div
                  className="mt-1 px-4 py-3"
                  style={{
                    border: `1px solid ${T.colors.border}`,
                    borderRadius: `${T.radius.large}px`,
                    backgroundColor: T.colors.background
                  }}
                >
                  <BlockKitRenderer blocks={msg.blocks} />
                </div>
              ) : (
                <p className="text-[15px] leading-[1.46668] whitespace-pre-wrap" style={{ color: T.colors.text }}>
                  {msg.body}
                </p>
              )}
            </div>
          </div>
        ))}
        {reversed.length > 0 && (
          <div className="flex items-center gap-4 py-3">
            <div className="h-px flex-1" style={{ backgroundColor: T.colors.border }} />
            <span className="text-[13px] font-medium" style={{ color: T.colors.textSecondary }}>Today</span>
            <div className="h-px flex-1" style={{ backgroundColor: T.colors.border }} />
          </div>
        )}
      </div>
    </div>
  );
}
