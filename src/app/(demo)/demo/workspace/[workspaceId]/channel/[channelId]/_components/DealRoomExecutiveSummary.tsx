"use client";

import Image from "next/image";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import { IconPin } from "@/components/icons";

const T = SLACK_TOKENS;

export function DealRoomExecutiveSummary() {
  return (
    <div className="mb-4">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <Image src="/slackbot-logo.svg" alt="Slackbot" width={32} height={32} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium" style={{ color: T.colors.textSecondary }}>Slackbot</span>
            <div className="flex items-center gap-1">
              <IconPin width={12} height={12} style={{ color: T.colors.textSecondary }} />
              <span className="text-xs" style={{ color: T.colors.textSecondary }}>Pinned</span>
            </div>
          </div>
          <div className="mb-6">
            <div className="mb-4">
              <div className="text-xs font-semibold uppercase mb-3" style={{ fontSize: '11px', color: '#0176D3', fontFamily: 'DM Sans, sans-serif' }}>
                EXECUTIVE SUMMARY
              </div>
              
              {/* Deal Context */}
              <div className="mb-4">
                <p className="text-[15px] font-medium mb-2" style={{ color: T.colors.text, fontFamily: 'DM Sans, sans-serif' }}>
                  Deal Context: $270K Strategic Gap
                </p>
                <p className="text-[14px] leading-relaxed" style={{ color: T.colors.textSecondary, fontFamily: 'DM Sans, sans-serif' }}>
                  Momentum is high with the Technical Lead, but the Economic Buyer (Sarah Chen) is currently a "Black Hole" in Gmail and Gong.
                </p>
              </div>

              {/* Actionable Next Steps */}
              <div className="mb-4">
                <p className="text-[13px] font-semibold mb-2 uppercase" style={{ color: T.colors.text, fontFamily: 'DM Sans, sans-serif' }}>
                  Actionable Next Steps:
                </p>
                <div className="space-y-2">
                  <p className="text-[14px]" style={{ color: T.colors.text, fontFamily: 'DM Sans, sans-serif' }}>
                    <span className="font-semibold">@Rita Patel (AE):</span> Respond to Sarah's scalability concern. Draft waiting in Gmail based on Tuesday's Gong transcript.
                  </p>
                  <p className="text-[14px]" style={{ color: T.colors.text, fontFamily: 'DM Sans, sans-serif' }}>
                    <span className="font-semibold">@Priya Shah (SE):</span> Send the integration whitepaper requested by Daniel in Highspot.
                  </p>
                  <p className="text-[14px]" style={{ color: T.colors.text, fontFamily: 'DM Sans, sans-serif' }}>
                    <span className="font-semibold">@Jordan Hayes (VP):</span> Reach out to Mike Torres for an executive alignment check-in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
