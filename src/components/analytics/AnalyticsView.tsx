"use client";

import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  INCIDENT_TREND, MTTD_TREND, CONFIDENCE_DIST,
  AUTO_RESOLVE_TREND, MITRE_DATA, SEVERITY_PIE, SUMMARY_STATS,
} from "@/lib/mock-analytics";

// ── shared chart theme ─────────────────────────────────────────────────────────

const GRID_COLOR   = "rgba(255,255,255,0.05)";
const AXIS_COLOR   = "rgba(255,255,255,0.18)";
const TICK_STYLE   = { fill: "#3d4d63", fontSize: 10, fontFamily: "Inter, sans-serif" };
const TOOLTIP_STYLE: React.CSSProperties = {
  background: "#1c2333",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 6,
  fontSize: 11,
  color: "#e2e8f0",
  boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
};

function ChartCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg p-4"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)" }}>
      <p className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{title}</p>
      {sub && <p className="text-[11px] mb-4" style={{ color: "var(--text-muted)" }}>{sub}</p>}
      {!sub && <div className="mb-4" />}
      {children}
    </div>
  );
}

// ── MITRE heatmap ──────────────────────────────────────────────────────────────

const MAX_COUNT = Math.max(...MITRE_DATA.map((d) => d.count));

function MitreHeatmap() {
  const tactics = Array.from(new Set(MITRE_DATA.map((d) => d.tactic)));

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr>
            <th className="text-left pb-2 pr-3 font-medium whitespace-nowrap"
              style={{ color: "var(--text-muted)" }}>Tactic</th>
            <th className="text-left pb-2 pr-3 font-medium whitespace-nowrap"
              style={{ color: "var(--text-muted)" }}>Technique</th>
            <th className="text-left pb-2 font-medium"
              style={{ color: "var(--text-muted)" }}>Hits</th>
          </tr>
        </thead>
        <tbody>
          {MITRE_DATA.map((row, i) => {
            const intensity = row.count / MAX_COUNT;
            const bg = `rgba(224,82,82,${(intensity * 0.55).toFixed(2)})`;
            const color = intensity > 0.5 ? "#f8b4b4" : intensity > 0.25 ? "#e05252" : "#7a8599";
            const showTactic = i === 0 || MITRE_DATA[i - 1].tactic !== row.tactic;

            return (
              <tr key={row.technique}
                className="transition-colors hover:bg-white/2"
                style={{ borderTop: showTactic ? "1px solid var(--border-subtle)" : "none" }}>
                <td className="py-1.5 pr-3 whitespace-nowrap align-middle"
                  style={{ color: showTactic ? "var(--text-secondary)" : "transparent" }}>
                  {row.tactic}
                </td>
                <td className="py-1.5 pr-3 font-mono whitespace-nowrap align-middle"
                  style={{ color: "var(--accent)", opacity: 0.8 }}>
                  {row.technique}
                </td>
                <td className="py-1.5 align-middle">
                  <div className="flex items-center gap-2">
                    <div className="h-5 rounded flex items-center justify-center px-2 min-w-8 text-center text-[10px] font-semibold"
                      style={{ background: bg, color, border: "1px solid rgba(224,82,82,0.15)", minWidth: `${(intensity * 80 + 28)}px` }}>
                      {row.count}
                    </div>
                    <span style={{ color: "var(--text-muted)" }}>{row.name}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── custom tooltip ─────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE} className="px-3 py-2 rounded-md">
      <p className="mb-1.5 font-medium text-[11px]" style={{ color: "var(--text-muted)" }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--text-secondary)" }}>{p.name}:</span>
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── page ───────────────────────────────────────────────────────────────────────

export function AnalyticsView() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-base)" }}>

      {/* header */}
      <div className="px-6 py-4 shrink-0"
        style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)" }}>
        <h1 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Analytics</h1>
      </div>

      <div className="flex-1 p-6 space-y-4">

        {/* summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {SUMMARY_STATS.map((s) => (
            <div key={s.label} className="rounded-lg p-4"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)" }}>
              <p className="text-[10px] uppercase tracking-widest font-medium mb-2"
                style={{ color: "var(--text-muted)" }}>{s.label}</p>
              <p className="text-[22px] font-semibold" style={{ color: "var(--text-primary)" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* row 1 — incident trend + MTTD/MTTR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          <ChartCard title="Incident Volume" sub="Daily totals by severity (7d)">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={INCIDENT_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  {[
                    { id: "gCrit",   color: "#e05252" },
                    { id: "gHigh",   color: "#d97706" },
                    { id: "gMedium", color: "#b59a2e" },
                  ].map(({ id, color }) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="critical" name="Critical" stroke="#e05252" strokeWidth={1.5} fill="url(#gCrit)"   dot={false} />
                <Area type="monotone" dataKey="high"     name="High"     stroke="#d97706" strokeWidth={1.5} fill="url(#gHigh)"   dot={false} />
                <Area type="monotone" dataKey="medium"   name="Medium"   stroke="#b59a2e" strokeWidth={1.5} fill="url(#gMedium)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="MTTD & MTTR Trend" sub="Mean time to detect / respond in minutes (7d)">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MTTD_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="mttd" name="MTTD (min)" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="mttr" name="MTTR (min)" stroke="#b59a2e" strokeWidth={2} dot={false} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

        {/* row 2 — confidence dist + auto-resolve + severity pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          <ChartCard title="Confidence Distribution" sub="Agent output confidence buckets">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={CONFIDENCE_DIST} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="bucket" tick={{ ...TICK_STYLE, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Incidents" radius={[3, 3, 0, 0]}>
                  {CONFIDENCE_DIST.map((_, i) => (
                    <Cell key={i}
                      fill={i >= 3 ? "#3b82f6" : "#3d4d63"}
                      fillOpacity={0.75}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Auto-Resolve Rate" sub="% incidents resolved without operator (7d)">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={AUTO_RESOLVE_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gAuto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3d9966" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3d9966" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} domain={[50, 75]} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rate" name="Auto-Resolve %" stroke="#3d9966" strokeWidth={2} fill="url(#gAuto)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Severity Breakdown" sub="Total incidents by severity (7d)">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={SEVERITY_PIE}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {SEVERITY_PIE.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: "var(--text-secondary)", fontSize: 11 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

        {/* row 3 — MITRE heatmap full width */}
        <ChartCard title="MITRE ATT&CK Coverage" sub="Technique hit frequency across all incidents (7d)">
          <MitreHeatmap />
        </ChartCard>

      </div>
    </div>
  );
}