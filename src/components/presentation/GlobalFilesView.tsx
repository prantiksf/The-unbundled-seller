"use client";

import { useState } from "react";
import { ChevronDown, MoreVertical, Search, Star } from "lucide-react";

export function GlobalFilesView() {
  const [activeTab, setActiveTab] = useState("all");
  const [showTemplates, setShowTemplates] = useState(true);

  const TEMPLATE_CARDS = [
    { title: "Employee Onboarding", desc: "Welcome new people.", color: "bg-blue-50", accent: "border-blue-200" },
    { title: "Project tracker", desc: "Manage and monitor tasks as a team", color: "bg-orange-50", accent: "border-orange-200" },
    { title: "Monthly Newsletter", desc: "Broadcast your announcements.", color: "bg-yellow-50", accent: "border-yellow-200" },
    { title: "Feedback tracker", desc: "A streamlined approach to feedback.", color: "bg-purple-50", accent: "border-purple-200" },
  ];

  const FILE_LIST = [
    { name: "Today Feature Overview", author: "Maya Holikatti", date: "Last viewed on February 26th", read: "1 min read", starred: false },
    { name: "Sales Cloud UX Pattern Group V2MOM", author: "Chris Fox", date: "Last viewed on February 26th", read: "3 min read", starred: false },
    { name: "Welcome to #broadcast-the-daily", author: "Slackbot", date: "Last viewed on February 20th", read: "4 min read", starred: false },
    { name: "AI Coding Tools: How to Stretch Your Budget", author: "Nicolas Arkhipenko", date: "Last viewed on February 16th", read: "18 min read", starred: false },
    { name: "Exp. Org Guidelines for Prototyping", author: "Cliff Seal", date: "Last viewed on February 11th", read: "5 min read", starred: true },
    { name: "2nd Brain Program overview", author: "Shir Zalzberg", date: "Last viewed on February 11th", read: "5 min read", starred: false },
    { name: "2nd brain - Goal & Weekly Tracker", author: "Shir Zalzberg", date: "Last viewed on February 11th", read: "1 min read", starred: false },
    { name: "UI Explorations Exec Review", author: "Mike Lenz", date: "Last viewed on February 6th", read: "", starred: false },
    { name: "Frame and Resolution Guidelines", author: "Justin Carter", date: "Last viewed on February 4th", read: "1 min read", starred: false },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-[900px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[22px] font-bold text-gray-900">All files</h1>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#007a5a] text-white text-[13px] font-bold rounded-lg hover:bg-[#006a4e] transition-colors">
              + New
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:shadow-[0_0_0_1px_#1d9bd1]">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input type="text" placeholder="Search files" className="flex-1 bg-transparent outline-none text-[14px] text-gray-900 placeholder:text-gray-400" />
            </div>
          </div>

          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-1.5 text-[14px] font-bold text-gray-900 mb-3 hover:text-gray-700"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showTemplates ? "" : "-rotate-90"}`} />
            Templates
          </button>
          {showTemplates && (
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
              {TEMPLATE_CARDS.map((t) => (
                <div key={t.title} className={`min-w-[200px] max-w-[200px] ${t.color} border ${t.accent} rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow shrink-0`}>
                  <div className="h-[80px] mb-3 rounded-lg bg-white/60 border border-white/80" />
                  <p className="text-[13px] font-bold text-gray-900">{t.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t.desc}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {[
                { id: "all", label: "All" },
                { id: "created", label: "Created by you" },
                { id: "shared", label: "Shared with you" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-[13px] font-medium rounded-full border transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#1d9bd1] text-white border-[#1d9bd1]"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                5 Types <ChevronDown className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Recently viewed <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {FILE_LIST.map((file) => (
              <div key={file.name} className="flex items-center py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg cursor-pointer transition-colors group">
                <div className="w-5 h-5 rounded-full bg-purple-100 shrink-0 mr-3 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-gray-900 truncate">{file.name}</p>
                  <p className="text-[12px] text-gray-500">{file.author} · {file.date}{file.read ? ` · ${file.read}` : ""}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {file.starred ? (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <Star className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  <MoreVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
