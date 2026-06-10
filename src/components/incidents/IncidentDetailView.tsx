"use client";

import { useState, useEffect } from "react";
import { Clock, ChevronLeft, Activity, Brain, ListChecks } from "lucide-react";
import { IncidentTimeline }     from "./IncidentTimeline";
import { AgentReasoningChain }  from "./AgentReasoningChain";
import { ResponsePlanTable }    from "./ResponsePlanTable";
import { MOCK_INCIDENT }        from "@/lib/mock-incident";

const SEV_COLOR: Record<string, string> = {
  LOW:      "#3d9966",
  MEDIUM:   "#b59a2e",
  HIGH:     "#d97706",
  CRITICAL: "#e05252",
};
const SEV_BG: Record<string, string> = {
  LOW:      "rgba(61,153,102,0.08)",
  MEDIUM:   "rgba(181,154,46,0.08)",
  HIGH:     "rgba(217,119,6,0.08)",
  CRITICAL: "rgba(224,82,82,0.08)",
};
const SEV_BORDER: Record<string, string> = {
  LOW:      "rgba(61,153,102,0.25)",
  MEDIUM:   "rgba(181,154,46,0.25)",
  HIGH:     "rgba(217,119,6,0.25)",
  CRITICAL: "rgba(224,82,82,0.25)",
};

function CountdownTimer({ deadline }: { deadline: string }) {
  const [remaining, setRemaining] = useState("");
  const [urgent, setUrgent]       = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) { setRemaining("Expired"); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${m}:${s.toString().padStart(2, "0")}`);
      setUrgent(diff < 60000);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px]"
      style={{
        background: urgent ? "var(--red-dim)"    : "var(--yellow-dim)",
        border:     urgent ? "1px solid var(--red-border)" : "1px solid var(--yellow-border)",
        color:      urgent ? "var(--red)"         : "var(--yellow)",
      }}>
      <Clock className="w-3 h-3 animate-pulse" />
      <span className="font-mono font-bold">{remaining}</span>
      <span className="opacity-60 text-[10px]">until default reject</span>
    </div>
  );
}

const TABS = [
  { id: "timeline", label: "Timeline",       icon: Activity   },
  { id: "agents",   label: "Agent Reasoning", icon: Brain      },
  { id: "plans",    label: "Response Plans",  icon: ListChecks },
] as const;
type TabId = typeof TABS[number]["id"];

export function IncidentDetailView() {
  const [tab, setTab] = useState<TabId>("timeline");
  const inc = MOCK_INCIDENT;
  const sevColor  = SEV_COLOR[inc.severity];
  const sevBg     = SEV_BG[inc.severity];
  const sevBorder = SEV_BORDER[inc.severity];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-base)" }}>

      {/* top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3"
        style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-1.5 text-[12px] transition-opacity hover:opacity-80"
            style={{ color: "var(--text-muted)" }}>
            <ChevronLeft className="w-3.5 h-3.5" />
            Command Center
          </a>
          <span style={{ color: "var(--border-default)" }}>/</span>
          <span className="text-[12px] font-mono" style={{ color: "var(--text-secondary)" }}>{inc.id}</span>
        </div>
        <CountdownTimer deadline={inc.approvalDeadline} />
      </div>

      <div className="flex-1 p-6 space-y-4 max-w-5xl w-full mx-auto">

        {/* incident card */}
        <div className="rounded-lg p-5"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)" }}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              {/* badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded"
                  style={{ background: sevBg, color: sevColor, border: `1px solid ${sevBorder}` }}>
                  {inc.severity}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded"
                  style={{ background: "var(--yellow-dim)", color: "var(--yellow)", border: "1px solid var(--yellow-border)" }}>
                  PENDING APPROVAL
                </span>
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{inc.attackPhase}</span>
              </div>

              <h1 className="text-[18px] font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                {inc.title}
              </h1>

              <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
                Confidence{" "}
                <span style={{ color: "var(--text-primary)" }}>{(inc.confidence * 100).toFixed(0)}%</span>
                {" · "}Attributed to{" "}
                <span style={{ color: "var(--text-primary)" }}>{inc.threatActor.group}</span>
                {" "}({(inc.threatActor.confidence * 100).toFixed(0)}% conf.)
                {" · "}MITRE:{" "}
                {inc.mitreTechniques.map((t) => (
                  <span key={t} className="font-mono mr-1" style={{ color: "var(--accent)" }}>{t}</span>
                ))}
              </p>

              {/* affected assets */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Affected:</span>
                {inc.affectedAssets.map((a) => (
                  <span key={a} className="text-[11px] font-mono px-1.5 py-0.5 rounded"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* stat pills */}
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              {[
                { label: "Assets at Risk", value: "4",    color: "var(--red)",    bg: "var(--red-dim)",    border: "var(--red-border)"    },
                { label: "Impact Score",   value: "8.4",  color: "var(--orange)", bg: "var(--orange-dim)", border: "var(--orange-border)" },
                { label: "Confidence",     value: "87%",  color: "var(--accent)", bg: "var(--accent-dim)", border: "var(--accent-border)" },
              ].map((s) => (
                <div key={s.label} className="text-center px-4 py-2.5 rounded-lg"
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                  <div className="text-[20px] font-semibold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="flex gap-0.5 p-1 rounded-lg w-fit"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-[12px] font-medium transition-all"
              style={tab === id
                ? { background: "var(--bg-elevated)", color: "var(--text-primary)" }
                : { color: "var(--text-muted)" }}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* tab content */}
        <div className="rounded-lg p-5"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)" }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-4"
            style={{ color: "var(--text-muted)" }}>
            {tab === "timeline" ? "Incident Timeline" : tab === "agents" ? "Agent Reasoning Chain" : "Candidate Response Plans"}
          </p>

          {tab === "timeline" && <IncidentTimeline entries={inc.timeline as any} />}
          {tab === "agents"   && <AgentReasoningChain agents={inc.agentChain as any} />}
          {tab === "plans"    && <ResponsePlanTable plans={inc.responsePlans as any} approvalDeadline={inc.approvalDeadline} />}
        </div>

      </div>
    </div>
  );
}