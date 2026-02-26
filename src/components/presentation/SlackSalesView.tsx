"use client";

import { RITA_DATA, HEALTH_COLORS, type DealHealth } from "@/lib/ritaData";

function fmt(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

function HealthDot({ health }: { health: DealHealth }) {
  return (
    <span
      className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: HEALTH_COLORS[health].dot }}
      title={HEALTH_COLORS[health].label}
    />
  );
}

function HealthBadge({ health }: { health: DealHealth }) {
  const c = HEALTH_COLORS[health];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ background: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white rounded-xl overflow-hidden ${className}`}
      style={{ border: "1px solid #E0E0E0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, count }: { title: string; count?: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid #F0F0F0" }}>
      <span className="text-[14px] font-semibold text-gray-800">
        {title}
        {count && <span className="text-gray-400 font-normal ml-1 text-[13px]">· {count}</span>}
      </span>
    </div>
  );
}

const DEAL_ALERTS = [
  {
    dealId: "deal-sporty",
    severity: "at-risk" as DealHealth,
    risk: "Champion silent 14 days. No response to last 3 outreach attempts.",
    recommendation: "Escalate to VP Digital (Chris Park) or pause deal to protect pipeline hygiene.",
  },
  {
    dealId: "deal-acme",
    severity: "cooling" as DealHealth,
    risk: "Champion departure detected. Daniel Kim's calendar being cleared through January.",
    recommendation: "Confirm Priya Shah as new champion path before Jan 8 exec call.",
  },
  {
    dealId: "deal-novacorp",
    severity: "needs-nurture" as DealHealth,
    risk: "Legal review overdue by 3 days. No update from counsel (Sandra Nguyen) since Dec 22.",
    recommendation: "Send gentle follow-up to Marcus Lee with a 'by end of week' ask.",
  },
];

export function SlackSalesView() {
  const { seller, q4, q1Pipeline, deals } = RITA_DATA;

  const pipelineTotal = q1Pipeline.total;
  const pctOnTrack      = (q1Pipeline.onTrack.value / pipelineTotal) * 100;
  const pctNeedsNurture = (q1Pipeline.needsNurture.value / pipelineTotal) * 100;
  const pctCooling      = (q1Pipeline.cooling.value / pipelineTotal) * 100;
  const pctAtRisk       = (q1Pipeline.atRisk.value / pipelineTotal) * 100;

  const topDeals = [...deals].sort((a, b) => {
    const order = { "at-risk": 0, "cooling": 1, "needs-nurture": 2, "on-track": 3 };
    return order[a.health] - order[b.health] || b.amount - a.amount;
  });

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden bg-[#F8F8F8] h-full"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Lato, sans-serif' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 shrink-0 bg-white" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div className="flex items-center gap-2">
          <span className="text-[18px] font-bold text-gray-900">Sales</span>
          <span className="text-sm text-gray-400">Q1 · Week 1</span>
        </div>
        <div className="text-[13px] text-gray-500">
          {seller.name} · {fmt(seller.quota)} quota
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-5xl mx-auto px-5 py-5 space-y-4">

          {/* Quota Progress */}
          <Card>
            <div className="px-5 py-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-[13px] text-gray-500 mb-0.5">Quota Progress — Q1</div>
                  <div className="text-[22px] font-bold text-gray-900">
                    $0 <span className="text-[15px] font-normal text-gray-400">of {fmt(seller.quota)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] text-gray-500 mb-0.5">Commission</div>
                  <div className="text-[17px] font-semibold text-gray-700">
                    $0 <span className="text-[13px] font-normal text-gray-400">of {fmt(seller.commissionAtQuota)}</span>
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-2">
                <div className="h-full rounded-full bg-green-500" style={{ width: "0%" }} />
              </div>
              <div className="text-[12px] text-gray-400">
                Q1 started today.{" "}
                <span className="text-gray-600 font-medium">First close expected: Jan 31</span>
                {" "}(NovaCorp · $45K · Legal Review)
              </div>
            </div>
          </Card>

          {/* Pipeline Health + Win Rate — 2 columns */}
          <div className="grid grid-cols-2 gap-4">

            {/* Pipeline Health */}
            <Card>
              <CardHeader title="📊 Pipeline Health" count={`${fmt(pipelineTotal)} · ${q1Pipeline.activeDeals} deals`} />
              <div className="px-5 py-4 space-y-3">
                {/* Stacked bar */}
                <div className="h-2.5 rounded-full overflow-hidden flex gap-0.5">
                  <div className="h-full rounded-l-full" style={{ width: `${pctOnTrack}%`,      background: HEALTH_COLORS["on-track"].dot }} />
                  <div className="h-full"                style={{ width: `${pctNeedsNurture}%`, background: HEALTH_COLORS["needs-nurture"].dot }} />
                  <div className="h-full"                style={{ width: `${pctCooling}%`,      background: HEALTH_COLORS["cooling"].dot }} />
                  <div className="h-full rounded-r-full" style={{ width: `${pctAtRisk}%`,       background: HEALTH_COLORS["at-risk"].dot }} />
                </div>
                {/* Legend */}
                <div className="space-y-1.5">
                  {(["on-track", "needs-nurture", "cooling", "at-risk"] as DealHealth[]).map((h) => {
                    const data = h === "on-track" ? q1Pipeline.onTrack
                      : h === "needs-nurture" ? q1Pipeline.needsNurture
                      : h === "cooling"       ? q1Pipeline.cooling
                      : q1Pipeline.atRisk;
                    return (
                      <div key={h} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: HEALTH_COLORS[h].dot }} />
                          <span className="text-[12px] text-gray-600">{HEALTH_COLORS[h].label}</span>
                        </div>
                        <div className="text-[12px] text-gray-700 font-medium">
                          {fmt(data.value)} <span className="text-gray-400 font-normal">· {data.count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Win Rate */}
            <Card>
              <CardHeader title="📈 Win Rate Trend" />
              <div className="px-5 py-4 space-y-4">
                <div>
                  <div className="text-[28px] font-bold text-gray-900">{q4.winRate}%</div>
                  <div className="text-[12px] text-gray-400">Q4 win rate <span className="text-green-600 font-medium">↑ 8% from Q3</span></div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Personal close rate",    value: q4.personalCloseRate,   color: "#22C55E" },
                    { label: "Delegated close rate",   value: q4.delegatedCloseRate,  color: "#F97316" },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] text-gray-600">{row.label}</span>
                        <span className="text-[12px] font-semibold text-gray-800">{row.value}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${row.value}%`, background: row.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="text-[11px] text-gray-400">Avg cycle</div>
                    <div className="text-[14px] font-semibold text-gray-800">{q4.avgSalesCycle} days</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400">Avg deal size</div>
                    <div className="text-[14px] font-semibold text-gray-800">{fmt(q4.avgDealSize)}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Deal Alerts */}
          <Card>
            <CardHeader title="🔔 Deal Alerts" count={`${DEAL_ALERTS.length} need attention`} />
            <div className="divide-y divide-[#F5F5F5]">
              {DEAL_ALERTS.map((alert) => {
                const deal = deals.find(d => d.id === alert.dealId)!;
                return (
                  <div key={alert.dealId} className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <HealthDot health={alert.severity} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[14px] font-semibold text-gray-900">{deal.name}</span>
                          <span className="text-[12px] text-gray-500">{fmt(deal.amount)}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{deal.stage}</span>
                        </div>
                        <p className="text-[13px] text-gray-700 mb-1 leading-snug">{alert.risk}</p>
                        <p className="text-[12px] text-gray-400 italic mb-2 leading-snug">
                          Recommendation: {alert.recommendation}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            className="text-[12px] text-blue-600 font-medium hover:underline"
                          >
                            View in #{deal.channel}
                          </button>
                          <span className="text-gray-300">·</span>
                          <button className="text-[12px] text-gray-400 hover:text-gray-600">Snooze</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* All Deals table */}
          <Card>
            <CardHeader title="📋 All Deals" count={`${q1Pipeline.activeDeals} active`} />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #F0F0F0" }}>
                    {["Deal", "Amount", "Stage", "Health", "Close Date"].map((h) => (
                      <th key={h} className="px-5 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8F8F8]">
                  {topDeals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                      <td className="px-5 py-3">
                        <span className="text-[13px] font-medium text-gray-900">{deal.name}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[13px] text-gray-700 font-semibold">{fmt(deal.amount)}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[13px] text-gray-600">{deal.stage}</span>
                      </td>
                      <td className="px-5 py-3">
                        <HealthBadge health={deal.health} />
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[13px] text-gray-500">{deal.closeDate}</span>
                      </td>
                    </tr>
                  ))}
                  {q1Pipeline.activeDeals > deals.length && (
                    <tr>
                      <td colSpan={5} className="px-5 py-3">
                        <button className="text-[13px] text-blue-600 hover:underline">
                          + {q1Pipeline.activeDeals - deals.length} more deals...
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
