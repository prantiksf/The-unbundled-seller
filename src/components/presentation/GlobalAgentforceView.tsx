"use client";

import { ChevronDown, Search } from "lucide-react";

const AGENT_CARDS = [
  { name: "Agentforce Support Agent", org: "Salesforce EPIC360", desc: "Help users answer all the questions related to Agentforce", color: "bg-blue-600", prompts: ["What is Agentforce and how does it work?", "Can you help me understand the features ..."] },
  { name: "Badgeforce Agent", org: "SFDC Corporate Security", desc: "I'm your AI Badgeforce Agent! I'm here to help with your access control questions.", color: "bg-cyan-600", prompts: [] },
  { name: "Central Performance Productio...", org: "Salesforce EPIC360", desc: "Central Performance Production AEA is managed by Central Performance Production Team.", color: "bg-teal-600", prompts: [] },
  { name: "CKO Agent", org: "Salesforce", desc: "FY27 Company Kickoff has wrapped, but you can still share feedback through the surveys.", color: "bg-indigo-600", prompts: [] },
  { name: "Data Agent", org: "OrgEmp", desc: "Hello! I help users discover and answer questions about data artifacts created and maintained by the Data and Analytics team.", color: "bg-purple-600", prompts: ["What prompts does Data Agent support?", "What are the usage statistics for the ACT ..."] },
  { name: "Data Modeling Agent", org: "Salesforce EPIC360", desc: "Helps you discover entities across Salesforce data models (Core or Data Cloud objects).", color: "bg-violet-600", prompts: [] },
  { name: "Employee Agent", org: "OrgEmp", desc: "Employee Agent is an AI Agent that helps you find information and perform routine tasks.", color: "bg-sky-500", prompts: [] },
  { name: "EPIC Analytics Agent", org: "Salesforce EPIC360", desc: "Help people see and understand data with conversational analytics.", color: "bg-blue-500", prompts: [] },
  { name: "EPIC OrgFarm Agent", org: "Salesforce EPIC360", desc: "Everything you need about and around #OrgFarm", color: "bg-slate-600", prompts: [] },
];

export function GlobalAgentforceView() {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <h1 className="text-[20px] font-bold text-gray-900">All agents</h1>
        <button className="px-3 py-1.5 text-[13px] border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          Give feedback
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-[900px] mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-[24px] font-bold text-gray-900 mb-2">
              Assemble your <span className="text-purple-600">Agentforce</span> team
            </h2>
            <p className="text-[14px] text-gray-500 max-w-[500px] mx-auto leading-relaxed">
              You're already one impressive human. Together with AI agents, you'll be a force to be
              reckoned with. Browse agents that take the grunt work out of your day, and the guesswork
              out of decisions.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl focus-within:border-purple-400 focus-within:shadow-[0_0_0_1px_#a78bfa]">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input type="text" placeholder="Search agents" className="flex-1 bg-transparent outline-none text-[14px] text-gray-900 placeholder:text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] font-bold text-gray-900">Browse AI agents</h3>
            <button className="flex items-center gap-1 text-[13px] text-gray-600 hover:text-gray-900">
              All Salesforce Orgs <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENT_CARDS.map((agent) => (
              <div key={agent.name} className="border border-gray-200 rounded-xl p-4 hover:shadow-md cursor-pointer transition-all hover:border-gray-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${agent.color} flex items-center justify-center shrink-0`}>
                    <img src="/slackbot-logo.svg" alt="" className="w-5 h-5 opacity-90" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-gray-900 truncate">{agent.name}</p>
                    <p className="text-[11px] text-gray-500">{agent.org}</p>
                  </div>
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed mb-3 line-clamp-2">{agent.desc}</p>
                {agent.prompts.length > 0 && (
                  <div className="space-y-1.5">
                    {agent.prompts.map((prompt) => (
                      <div key={prompt} className="text-[12px] text-purple-700 bg-purple-50 border border-purple-100 rounded-lg px-3 py-1.5 truncate cursor-pointer hover:bg-purple-100 transition-colors">
                        {prompt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
