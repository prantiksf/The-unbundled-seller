"use client";

import Image from "next/image";
import { IconStar, IconPencil, IconSearch, IconLightbulb } from "@/components/icons";
import { DEMO_USER_NAME } from "@/context/DemoDataContext";

export function SlackbotProactiveTab() {
  return (
    <div className="w-full">
      {/* Welcome Section */}
      <div className="flex flex-col items-center text-center py-6 px-4">
        <div className="w-16 h-16 mb-3">
          <Image src="/slackbot-logo.svg" alt="Slackbot" width={64} height={64} />
        </div>
        <h2 className="text-lg font-bold text-[#1d1c1d] mb-2">
          Good morning, {DEMO_USER_NAME}!
        </h2>
        <p className="text-sm text-[#616061] mb-6">
          Here's where you stand.
        </p>

        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-2 w-full mb-6">
          {/* Quota Card */}
          <div className="bg-[#f8f8f8] rounded-lg p-3">
            <div className="text-2xl font-bold text-[#1d1c1d]">$1M</div>
            <div className="text-xs font-semibold text-[#1d1c1d] mt-1">Quota</div>
            <div className="text-xs text-[#616061] mt-1">48 days to closing Q3</div>
          </div>

          {/* On Track Card */}
          <div className="bg-[#e0f5f0] rounded-lg p-3">
            <div className="text-2xl font-bold text-[#1d1c1d]">$198M</div>
            <div className="text-xs font-semibold text-[#1d1c1d] mt-1">On track to close</div>
            <div className="text-xs text-[#616061] mt-1">3 Active Deals</div>
          </div>

          {/* Gap Card */}
          <div className="bg-[#fce8ee] rounded-lg p-3">
            <div className="text-2xl font-bold text-[#1d1c1d]">$802K</div>
            <div className="text-xs font-semibold text-[#1d1c1d] mt-1">Gap</div>
            <div className="text-xs text-[#616061] mt-1">Needs Attention</div>
          </div>
        </div>

        {/* Commission Text */}
        <div className="text-center mb-4 w-full">
          <p className="text-sm font-bold text-[#1d1c1d]">
            Estimated commission at current pace: $14K | At Quota: $70K
          </p>
          <p className="text-xs text-[#616061] mt-2">
            You're at 20% of quota pace with 7 weeks left. You need to activate new pipeline or
            accelerate existing deals. 2 deals need you today.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-[#e8e8e8] text-sm font-medium hover:bg-[#f8f8f8] bg-white">
            <IconStar width={16} height={16} style={{ color: "#616061" }} stroke="currentColor" />
            <span>Discover</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-[#e8e8e8] text-sm font-medium hover:bg-[#f8f8f8] bg-white">
            <IconPencil width={16} height={16} style={{ color: "#616061" }} stroke="currentColor" />
            <span>Create</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-[#e8e8e8] text-sm font-medium hover:bg-[#f8f8f8] bg-white">
            <IconSearch width={16} height={16} style={{ color: "#616061" }} stroke="currentColor" />
            <span>Find</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-[#e8e8e8] text-sm font-medium hover:bg-[#f8f8f8] bg-white">
            <IconLightbulb width={16} height={16} style={{ color: "#616061" }} stroke="currentColor" />
            <span>Brainstorm</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#e8e8e8] mx-4" />

      {/* Focus Block Section */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-[#e8d4f5] text-[#6b2e9d] text-xs font-semibold px-2 py-1 rounded">
            Focus block
          </span>
          <span className="text-xs text-[#616061]">20 actions toward your $1.0M</span>
        </div>

        {/* Timeline */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-[#1d1c1d] mb-2">Meet Quota by</div>
          <div className="flex items-center gap-2 text-xs text-[#616061]">
            <div className="h-1 w-24 bg-[#7c3eb1] rounded-full" />
            <span className="font-semibold">48 days</span>
            <span>$1,559,954 pipeline</span>
            <span>|</span>
            <span>5 meetings/week</span>
            <span>|</span>
            <span>$17,435/day pace</span>
            <span>|</span>
            <span className="font-semibold">$70,000 at quota</span>
          </div>
        </div>

        {/* Deal Cards */}
        <div className="space-y-3">
          {/* Champion Silent */}
          <div className="border border-[#e8e8e8] rounded-lg p-3 bg-white">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ff4d4d] flex items-center justify-center text-white shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#1d1c1d] mb-1">
                  Champion silent (14 days)
                </div>
                <div className="text-xs text-[#616061] mb-1">
                  Acme Corp — $720k • Stage: Negotiation
                </div>
                <div className="text-xs text-[#616061] mb-3">
                  Signal: Proposal viewed 14x, no reply
                </div>
                <button className="text-xs font-medium text-[#1264a3] hover:underline border border-[#1264a3] rounded px-3 py-1.5">
                  ✨ Find alternate stakeholder
                </button>
              </div>
            </div>
          </div>

          {/* Budget Objection */}
          <div className="border border-[#e8e8e8] rounded-lg p-3 bg-white">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ff4d4d] flex items-center justify-center text-white shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#1d1c1d] mb-1">
                  Budget objection raised
                </div>
                <div className="text-xs text-[#616061] mb-1">
                  Meridian Health — $420k • Stage: Discovery
                </div>
                <div className="text-xs text-[#616061] mb-3">
                  Signal: CFO joined last call, asked about ROI
                </div>
                <button className="text-xs font-medium text-[#1264a3] hover:underline border border-[#1264a3] rounded px-3 py-1.5">
                  ✨ Send ROI calculator
                </button>
              </div>
            </div>
          </div>

          {/* Competitor Mentioned */}
          <div className="border border-[#e8e8e8] rounded-lg p-3 bg-white">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ff4d4d] flex items-center justify-center text-white shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#1d1c1d] mb-1">
                  Competitor mentioned
                </div>
                <div className="text-xs text-[#616061] mb-1">
                  Pinnacle Logistics — $380k • Stage: Evaluation
                </div>
                <div className="text-xs text-[#616061] mb-3">
                  Signal: "Also talking to ServiceNow" in email
                </div>
                <button className="text-xs font-medium text-[#1264a3] hover:underline border border-[#1264a3] rounded px-3 py-1.5">
                  ✨ Draft battle card response
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
