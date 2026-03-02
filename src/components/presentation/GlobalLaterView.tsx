"use client";

import { useMemo } from "react";
import { useDemoData } from "@/context/DemoDataContext";

export function GlobalLaterView() {
  const { savedItems } = useDemoData();
  const visibleItems = useMemo(
    () => savedItems.filter((item) => item.channelId !== "slackbot"),
    [savedItems]
  );

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      <div className="px-6 py-4 border-b border-[#e8e8e8] shrink-0">
        <h1 className="text-[20px] font-bold text-[#1d1c1d]">Later</h1>
        <p className="text-[13px] text-[#616061] mt-1">{visibleItems.length} in progress</p>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-[860px] mx-auto px-6 py-5">
          <div className="space-y-2">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="border border-[#ececf1] rounded-xl p-4 hover:bg-[#f8f8fb] transition-colors cursor-pointer"
              >
                <p className="text-[11px] text-[#7a7a80] mb-1">#{item.channelId}</p>
                <p className="text-[14px] text-[#1d1c1d] leading-relaxed">{item.preview}</p>
                <p className="text-[11px] text-[#9a9aa2] mt-2">{item.timestamp}</p>
              </div>
            ))}
          </div>
          {visibleItems.length === 0 && (
            <div className="py-14 text-center text-[14px] text-[#616061]">
              No saved items yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
