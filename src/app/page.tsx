"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert, Clock, Zap, CheckCircle2,
  TrendingUp, Activity, ChevronRight, Check, X,
  AlertTriangle
} from "lucide-react";
import { MOCK_INCIDENTS, MOCK_PENDING_APPROVALS, type Severity, type IncidentStatus } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

// ── severity config ───────────────────────────────────────────────────────────

const SEV: Record<Severity, { label: string; color: string; bg: string; border: string }> = {
  CRITICAL: { label: "Critical", color: "#c9534f", bg: "rgba(180,60,60,0.08)",  border: "rgba(180,60,60,0.18)"  },
  HIGH:     { label: "High",     color: "#b06a2e", bg: "rgba(180,110,50,0.08)", border: "rgba(180,110,50,0.18)" },
  MEDIUM:   { label: "Medium",   color: "#8f7c2a", bg: "rgba(160,140,50,0.08)", border: "rgba(160,140,50,0.18)" },
  LOW:      { label: "Low",      color: "#3d7a56", bg: "rgba(50,120,80,0.08)",  border: "rgba(50,120,80,0.18)"  },
};

const STATUS_META: Record<IncidentStatus, { label: string; color: string; bg: string; border: string }> = {
  TRIAGING:         { label: "Triaging",       color: "#6b8aad", bg: "rgba(80,110,160,0.08)",  border: "rgba(80,110,160,0.15)"  },
  ANALYZING:        { label: "Analyzing",      color: "#6b8aad", bg: "rgba(80,110,160,0.08)",  border: "rgba(80,110,160,0.15)"  },
  SIMULATING:       { label: "Simulating",     color: "#6b8aad", bg: "rgba(80,110,160,0.08)",  border: "rgba(80,110,160,0.15)"  },
  PENDING_APPROVAL: { label: "Needs Approval", color: "#8f7c2a", bg: "rgba(160,140,50,0.07)",  border: "rgba(160,140,50,0.18)"  },
  EXECUTING:        { label: "Executing",      color: "#6b8aad", bg: "rgba(80,110,160,0.08)",  border: "rgba(80,110,160,0.15)"  },
  RESOLVED:         { label: "Resolved",       color: "#3d7a56", bg: "rgba(50,120,80,0.07)",   border: "rgba(50,120,80,0.15)"   },
  AUTO_RESOLVED:    { label: "Auto-Resolved",  color: "#3d7a56", bg: "rgba(50,120,80,0.07)",   border: "rgba(50,120,80,0.15)"   },
};

const AGENT_STAGES = ["Triage", "Threat Intel", "Attack Analysis", "Containment", "Simulation", "Compliance", "Done"];

// ── small components ──────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: Severity }) {
  const s = SEV[severity];
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color, opacity: 0.8 }} />
      {s.label}
    </span>
  );
}

function StatusPill({ status }: { status: IncidentStatus }) {
  const m = STATUS_META[status];
  const isPending = status === "PENDING_APPROVAL";
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      {isPending && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: m.color }} />}
      {m.label}
    </span>
  );
}

function CountdownTimer({ createdAt, timeoutSeconds }: { createdAt: Date; timeoutSeconds: number }) {
  const elapsed = Math.floor((Date.now() - createdAt.getTime()) / 1000);
  const [remaining, setRemaining] = useState(Math.max(0, timeoutSeconds - elapsed));

  useEffect(() => {
    const t = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const pct = (remaining / timeoutSeconds) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const urgent = remaining < 60;

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "var(--border-subtle)" }}>
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: urgent ? "#c9534f" : "#8f7c2a", opacity: 0.7 }} />
      </div>
      <span className="text-[12px] font-mono tabular-nums"
        style={{ color: urgent ? "#c9534f" : "var(--text-secondary)" }}>
        {mins}:{secs.toString().padStart(2, "0")}
      </span>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, sub, accentColor }: {
  icon: React.ElementType; label: string; value: string; sub: string; accentColor: string;
}) {
  return (
    <div className="rounded-lg p-4 flex flex-col gap-3"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
        <div className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}22` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: accentColor }} />
        </div>
      </div>
      <p className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>{value}</p>
      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{sub}</p>
    </div>
  );
}

function AgentPipeline({ stage }: { stage: number }) {
  return (
    <div className="flex items-center">
      {AGENT_STAGES.map((name, i) => {
        const done   = i < stage;
        const active = i === stage;
        return (
          <div key={name} className="flex items-center">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold"
                style={{
                  background: done   ? "rgba(60,110,80,0.15)"  : active ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.03)",
                  border:     done   ? "1px solid rgba(60,110,80,0.3)" : active ? "1px solid rgba(59,130,246,0.3)" : "1px solid var(--border-subtle)",
                  color:      done   ? "#3d7a56" : active ? "var(--accent)" : "var(--text-muted)",
                }}>
                {done ? <Check className="w-2.5 h-2.5" /> : i + 1}
              </div>
              <span className="text-[8px] whitespace-nowrap"
                style={{ color: done ? "#3d7a56" : active ? "var(--accent)" : "var(--text-muted)", opacity: done || active ? 1 : 0.5 }}>
                {name}
              </span>
            </div>
            {i < AGENT_STAGES.length - 1 && (
              <div className="w-4 h-px mb-3.5"
                style={{ background: done ? "rgba(60,110,80,0.25)" : "var(--border-subtle)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function CommandCenter() {
  const active   = MOCK_INCIDENTS.filter(i => !["RESOLVED", "AUTO_RESOLVED"].includes(i.status));
  const resolved = MOCK_INCIDENTS.filter(i =>  ["RESOLVED", "AUTO_RESOLVED"].includes(i.status));

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="flex-1 p-6 space-y-6">

        {/* metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <MetricCard icon={ShieldAlert}  label="Active Incidents"  value={String(active.length)}   sub="3 need attention"     accentColor="#c9534f" />
          <MetricCard icon={Clock}        label="Avg MTTD"          value="2m 14s"                  sub="↓ 18% vs last week"   accentColor="#6b8aad" />
          <MetricCard icon={Zap}          label="Avg MTTR"          value="11m 42s"                 sub="↓ 31% vs last week"   accentColor="#6b8aad" />
          <MetricCard icon={CheckCircle2} label="Resolved Today"    value={String(resolved.length)} sub="2 auto-resolved"      accentColor="#3d7a56" />
          <MetricCard icon={TrendingUp}   label="Auto-Resolve Rate" value="68%"                     sub="↑ 5pts vs last week"  accentColor="#8f7c2a" />
        </div>

        {/* pending approvals */}
        {MOCK_PENDING_APPROVALS.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#8f7c2a" }} />
              <h2 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Pending Approvals</h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                style={{ background: "rgba(160,140,50,0.08)", color: "#8f7c2a", border: "1px solid rgba(160,140,50,0.2)" }}>
                {MOCK_PENDING_APPROVALS.length}
              </span>
            </div>

            <div className="space-y-2">
              {MOCK_PENDING_APPROVALS.map(ap => (
                <div key={ap.id} className="rounded-lg p-4"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)" }}>
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <SeverityBadge severity={ap.severity} />
                        <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{ap.title}</span>
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{ap.id}</span>
                      </div>
                      <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                        Proposed: <span style={{ color: "var(--text-secondary)" }}>{ap.action}</span>
                      </p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          Plan: <span style={{ color: "var(--accent)", opacity: 0.8 }}>{ap.plan}</span>
                        </span>
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          Confidence: <span style={{ color: "#3d7a56" }}>{Math.round(ap.confidence * 100)}%</span>
                        </span>
                        <CountdownTimer createdAt={ap.createdAt} timeoutSeconds={ap.timeoutSeconds} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium transition-opacity hover:opacity-80"
                        style={{ background: "rgba(50,120,80,0.08)", color: "#3d7a56", border: "1px solid rgba(50,120,80,0.2)" }}>
                        <Check className="w-3 h-3" /> Approve
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium transition-opacity hover:opacity-80"
                        style={{ background: "rgba(180,60,60,0.08)", color: "#c9534f", border: "1px solid rgba(180,60,60,0.2)" }}>
                        <X className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* incident feed */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
              <h2 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Live Incident Feed</h2>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#3d7a56" }} />
            </div>
            <Link href="/incidents" className="flex items-center gap-1 text-[12px] hover:opacity-80 transition-opacity"
              style={{ color: "var(--text-muted)" }}>
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-subtle)" }}>
            {/* header */}
            <div className="grid px-4 py-2.5 text-[10px] uppercase tracking-widest font-medium"
              style={{
                gridTemplateColumns: "1fr 160px 130px 90px 300px 80px",
                background: "var(--bg-surface)",
                color: "var(--text-muted)",
                borderBottom: "1px solid var(--border-subtle)",
              }}>
              <span>Incident</span>
              <span>Asset</span>
              <span>Status</span>
              <span>Confidence</span>
              <span>Agent Pipeline</span>
              <span>Age</span>
            </div>

            {/* rows */}
            {MOCK_INCIDENTS.map((inc, idx) => {
              const sev = SEV[inc.severity];
              return (
                <Link href={`/incidents/${inc.id}`} key={inc.id}
                  className="grid px-4 py-3.5 items-center transition-colors hover:bg-white/[0.02]"
                  style={{
                    gridTemplateColumns: "1fr 160px 130px 90px 300px 80px",
                    background: idx % 2 === 0 ? "var(--bg-surface)" : "var(--bg-base)",
                    borderBottom: "1px solid var(--border-subtle)",
                    borderLeft: `2px solid ${sev.color}`,
                    opacity: inc.status === "RESOLVED" || inc.status === "AUTO_RESOLVED" ? 0.6 : 1,
                  }}>

                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={inc.severity} />
                      <span className="text-[13px] truncate" style={{ color: "var(--text-primary)" }}>
                        {inc.title}
                      </span>
                    </div>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{inc.id}</p>
                  </div>

                  <span className="text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>
                    {inc.affectedAsset}
                  </span>

                  <StatusPill status={inc.status} />

                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: "var(--border-subtle)" }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${inc.confidence * 100}%`, background: "var(--text-muted)", opacity: 0.6 }} />
                    </div>
                    <span className="text-[11px] font-mono tabular-nums" style={{ color: "var(--text-muted)" }}>
                      {Math.round(inc.confidence * 100)}%
                    </span>
                  </div>

                  <AgentPipeline stage={inc.agentStage} />

                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {formatDistanceToNow(inc.createdAt, { addSuffix: false })}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}