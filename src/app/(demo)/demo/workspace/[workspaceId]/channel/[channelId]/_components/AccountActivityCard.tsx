"use client";

import Image from "next/image";
import { SLACK_TOKENS } from "@/design/slack-tokens";
import { memo } from "react";

const T = SLACK_TOKENS;

// Account Activity Card - Shows "Sellers' Playbook" with specific tasks
export const AccountActivityCard = memo(function AccountActivityCard() {
  const activities = [
    { person: "Rita (AE)", task: "Respond to Sarah's scalability concern (Draft ready in Gmail)", status: "pending" },
    { person: "Priya (SE)", task: "Send the integration whitepaper Daniel requested in Highspot", status: "pending" },
    { person: "Jordan (VP)", task: "Reach out to Mike for an executive alignment check-in", status: "pending" },
  ];

  return (
    <div className="mb-4">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <Image src="/slackbot-logo.svg" alt="Slackbot" width={32} height={32} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium" style={{ color: T.colors.textSecondary }}>Slackbot</div>
          <div className="mb-6 mt-1">
            <div className="mb-3">
              <div className="text-xs font-semibold uppercase mb-3" style={{ fontSize: '11px', color: '#0176D3', fontFamily: 'DM Sans, sans-serif' }}>
                SELLERS' PLAYBOOK
              </div>
              <div className="space-y-2.5 mb-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-2 text-[14px]" style={{ color: T.colors.text, fontFamily: 'DM Sans, sans-serif' }}>
                    <span className="font-semibold shrink-0 w-28" style={{ color: T.colors.textSecondary }}>{activity.person}:</span>
                    <span className="flex-1">{activity.task}</span>
                  </div>
                ))}
              </div>
              
              {/* Helpful prompt */}
              <div className="pt-3 border-t" style={{ borderColor: T.colors.border }}>
                <p className="text-[13px] mb-2" style={{ color: T.colors.text, fontFamily: 'DM Sans, sans-serif' }}>
                  Would you like me to draft the specific "Scalability" email draft for Sarah so Rita can "Human Signal" it immediately?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
