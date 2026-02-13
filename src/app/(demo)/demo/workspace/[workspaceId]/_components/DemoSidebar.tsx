"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconSearch,
  IconSquare,
  IconLayoutGrid,
  IconFilter,
  IconList,
  IconCopy,
  IconLink,
  IconMoreVertical,
  IconPlus,
} from "@/components/icons";
import { useDemoData } from "@/context/DemoDataContext";
import { cn } from "@/lib/utils";
import { SLACK_TOKENS } from "@/design/slack-tokens";

const T = SLACK_TOKENS;

type ViewFilter = "all" | "dms";

export function DemoSidebar() {
  const params = useParams();
  const channelId = params.channelId as string;
  const { workspace, channels, dms, getChannelPreview } = useDemoData();
  const [filter, setFilter] = useState<ViewFilter>("all");
  const [search, setSearch] = useState("");

  const allItems = (
    filter === "dms"
      ? dms.map((dm) => ({ ...dm, type: "dm" as const }))
      : [...channels.map((ch) => ({ ...ch, type: "channel" as const })), ...dms.map((dm) => ({ ...dm, type: "dm" as const }))]
  ).filter((item) => {
    if (!search) return true;
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <aside className="w-[260px] flex-shrink-0 flex flex-col border-r" style={{ backgroundColor: T.colors.activitySidebar, borderColor: T.colors.border }}>
      <div className="px-3 py-3 border-b flex items-center gap-2" style={{ borderColor: T.colors.border }}>
        <span className="font-semibold" style={{ fontSize: T.typography.body, color: T.colors.text }}>Activity</span>
        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded" style={{ backgroundColor: T.colors.betaBadgeBg, color: T.colors.betaBadgeText }}>Beta</span>
      </div>

      <div className="flex items-center gap-1 px-2 py-2 border-b" style={{ borderColor: T.colors.border }}>
        <button
          type="button"
          className={cn(
            "px-3 py-1.5 font-medium rounded",
            filter === "all" ? "" : "hover:bg-[#f8f8f8]"
          )}
          style={filter === "all" ? { backgroundColor: T.colors.backgroundAlt, color: T.colors.text, fontSize: T.typography.small } : { color: T.colors.textSecondary, fontSize: T.typography.small }}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          type="button"
          className={cn(
            "px-3 py-1.5 font-medium rounded",
            filter === "dms" ? "" : "hover:bg-[#f8f8f8]"
          )}
          style={filter === "dms" ? { backgroundColor: T.colors.backgroundAlt, color: T.colors.text, fontSize: T.typography.small } : { color: T.colors.textSecondary, fontSize: T.typography.small }}
          onClick={() => setFilter("dms")}
        >
          DMs
        </button>
        <button
          type="button"
          className="p-1.5 rounded hover:bg-[#f8f8f8]"
          style={{ color: T.colors.textSecondary }}
          title="Add"
        >
          <IconPlus width={T.iconSizes.channelHeader} height={T.iconSizes.channelHeader} stroke="currentColor" />
        </button>
      </div>

      <div className="flex items-center gap-1 px-2 py-1.5 border-b" style={{ borderColor: T.colors.border }}>
        <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Checkbox">
          <IconSquare width={14} height={14} stroke="currentColor" strokeWidth={2} />
        </button>
        <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Grid">
          <IconLayoutGrid width={14} height={14} stroke="currentColor" />
        </button>
        <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="Filter">
          <IconFilter width={14} height={14} stroke="currentColor" />
        </button>
        <button type="button" className="p-1.5 rounded hover:bg-[#f8f8f8]" style={{ color: T.colors.textSecondary }} title="List">
          <IconList width={14} height={14} stroke="currentColor" />
        </button>
        <div className="flex-1 flex items-center gap-1.5 px-2 py-1 rounded" style={{ backgroundColor: T.colors.backgroundAlt }}>
          <IconSearch width={14} height={14} className="shrink-0" style={{ color: T.colors.textSecondary }} stroke="currentColor" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 bg-transparent focus:outline-none"
            style={{ color: T.colors.text, fontSize: T.typography.small }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 py-1">
        {allItems.map((item) => {
          const isActive = channelId === item.id;
          const { preview, timestamp } = getChannelPreview(item.id);
          return (
            <Link
              key={item.id}
              href={`/demo/workspace/${workspace.id}/channel/${item.id}`}
              className={cn(
                "flex items-start gap-2 px-2.5 py-1.5 mx-1 rounded group",
                isActive ? "" : "hover:bg-[#f8f8f8]"
              )}
              style={isActive ? { backgroundColor: T.colors.backgroundAlt, boxShadow: `inset 0 0 0 1px ${T.colors.border}` } : {}}
            >
              <div className="size-8 flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5" style={{ backgroundColor: T.colors.avatarBg, borderRadius: `${T.radius.avatar}px` }}>
                {item.type === "channel" ? item.name.charAt(0).toUpperCase() : item.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="truncate font-medium" style={{ fontSize: T.typography.body, color: T.colors.text }}>
                    {item.type === "channel" ? `#${item.name}` : item.name}
                  </span>
                </div>
                {preview && (
                  <p className="truncate mt-0.5" style={{ fontSize: T.typography.small, color: T.colors.textSecondary }}>{preview}</p>
                )}
              </div>
              <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" className="p-1 rounded hover:bg-white/80" title="Copy">
                  <IconCopy width={12} height={12} style={{ color: T.colors.textSecondary }} stroke="currentColor" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-white/80" title="Link">
                  <IconLink width={12} height={12} style={{ color: T.colors.textSecondary }} stroke="currentColor" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-white/80" title="More">
                  <IconMoreVertical width={12} height={12} style={{ color: T.colors.textSecondary }} stroke="currentColor" />
                </button>
              </div>
              {timestamp && (
                <span className="shrink-0 mt-0.5" style={{ fontSize: T.typography.smaller, color: T.colors.textSecondary }}>{timestamp}</span>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
