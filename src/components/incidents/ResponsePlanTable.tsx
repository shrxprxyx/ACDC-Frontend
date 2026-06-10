"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Star, ChevronDown, ChevronRight, Shield, User, Zap } from "lucide-react";

type Action = { type: string; target: string; detail: string };
type Plan = {
  id: string;
  label: string;
  recommended: boolean;
  res: number;
  containmentProb: number;
  disruption: "LOW" | "MEDIUM" | "HIGH";
  speed: string;
  simulationScore: number;
  actions: Action[];
  complianceStatus: string;
};

const DISRUPTION = {
  LOW:    { color: "var(--green)",  bg: "var(--green-dim)",  border: "var(--green-border)"  },
  MEDIUM: { color: "var(--yellow)", bg: "var(--yellow-dim)", border: "var(--yellow-border)" },
  HIGH:   { color: "var(--red)",    bg: "var(--red-dim)",    border: "var(--red-border)"    },
};

const ACTION_ICON: Record<string, React.ReactNode> = {
  firewall_block:       <Shield className="w-3.5 h-3.5" />,
  quarantine_host:      <XCircle className="w-3.5 h-3.5" />,
  force_password_reset: <User    className="w-3.5 h-3.5" />,
  isolate_vlan:         <Zap     className="w-3.5 h-3.5" />,
};

function PlanCard({
  plan, selected, onSelect,
}: {
  plan: Plan; selected: boolean; onSelect: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(plan.recommended);
  const d = DISRUPTION[plan.disruption];

  return (
    <div className="rounded-lg overflow-hidden transition-all"
      style={{
        background: selected ? "rgba(59,130,246,0.04)" : "var(--bg-surface)",
        border: `1px solid ${selected ? "var(--accent-border)" : "var(--border-default)"}`,
      }}>
      {/* header row */}
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/2 transition-colors"
        onClick={() => onSelect(plan.id)}>
        {/* radio */}
        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
          style={{
            border: `2px solid ${selected ? "var(--accent)" : "var(--border-strong)"}`,
            background: selected ? "var(--accent)" : "transparent",
          }}>
          {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>

        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{plan.label}</span>
          <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>{plan.id}</span>
          {plan.recommended && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded"
              style={{ background: "var(--green-dim)", color: "var(--green)", border: "1px solid var(--green-border)" }}>
              <Star className="w-2.5 h-2.5" /> Recommended
            </span>
          )}
        </div>

        {/* metrics */}
        <div className="hidden sm:flex items-center gap-5 text-[12px] mr-2">
          <div className="text-center">
            <div className="text-[10px] mb-0.5" style={{ color: "var(--text-muted)" }}>RES</div>
            <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{(plan.res * 100).toFixed(0)}%</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] mb-0.5" style={{ color: "var(--text-muted)" }}>Containment</div>
            <div className="font-semibold" style={{ color: "var(--green)" }}>{(plan.containmentProb * 100).toFixed(0)}%</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] mb-0.5" style={{ color: "var(--text-muted)" }}>Disruption</div>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
              style={{ background: d.bg, color: d.color, border: `1px solid ${d.border}` }}>
              {plan.disruption}
            </span>
          </div>
        </div>

        <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          style={{ color: "var(--text-muted)" }}>
          {expanded
            ? <ChevronDown  className="w-4 h-4" />
            : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* expanded */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold pt-3" style={{ color: "var(--text-muted)" }}>
            Actions
          </p>
          <div className="space-y-1.5">
            {plan.actions.map((action, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-md"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
                <div className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                  style={{ background: "var(--bg-base)", color: "var(--text-muted)" }}>
                  {ACTION_ICON[action.type] ?? <Zap className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-mono" style={{ color: "var(--accent)" }}>{action.type}</span>
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}> · {action.target} — {action.detail}</span>
                </div>
              </div>
            ))}
          </div>

          {/* sim score bar */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-[11px] w-28" style={{ color: "var(--text-muted)" }}>Simulation Score</span>
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--border-subtle)" }}>
              <div className="h-full rounded-full" style={{ width: `${plan.simulationScore}%`, background: "var(--accent)", opacity: 0.7 }} />
            </div>
            <span className="text-[11px] font-mono w-7" style={{ color: "var(--text-secondary)" }}>{plan.simulationScore}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ResponsePlanTable({ plans, approvalDeadline }: { plans: Plan[]; approvalDeadline: string }) {
  const [selected, setSelected]   = useState(plans.find((p) => p.recommended)?.id ?? plans[0].id);
  const [decision, setDecision]   = useState<"approved" | "rejected" | null>(null);
  const selectedPlan = plans.find((p) => p.id === selected)!;

  if (decision === "approved") return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
      <div className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: "var(--green-dim)", border: "1px solid var(--green-border)" }}>
        <CheckCircle className="w-7 h-7" style={{ color: "var(--green)" }} />
      </div>
      <p className="text-[15px] font-semibold" style={{ color: "var(--green)" }}>Plan Approved</p>
      <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>{selectedPlan.label} has been queued for execution.</p>
    </div>
  );

  if (decision === "rejected") return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
      <div className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: "var(--red-dim)", border: "1px solid var(--red-border)" }}>
        <XCircle className="w-7 h-7" style={{ color: "var(--red)" }} />
      </div>
      <p className="text-[15px] font-semibold" style={{ color: "var(--red)" }}>Plan Rejected</p>
      <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Incident escalated for manual handling.</p>
    </div>
  );

  return (
    <div className="space-y-2">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} selected={selected === plan.id} onSelect={setSelected} />
      ))}

      {/* action bar */}
      <div className="flex items-center gap-2 pt-2">
        <button onClick={() => setDecision("approved")}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-[13px] font-medium transition-opacity hover:opacity-80"
          style={{ background: "var(--green-dim)", color: "var(--green)", border: "1px solid var(--green-border)" }}>
          <CheckCircle className="w-3.5 h-3.5" />
          Approve {selectedPlan.label}
        </button>
        <button onClick={() => setDecision("rejected")}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-[13px] font-medium transition-opacity hover:opacity-80"
          style={{ background: "var(--red-dim)", color: "var(--red)", border: "1px solid var(--red-border)" }}>
          <XCircle className="w-3.5 h-3.5" />
          Reject
        </button>
      </div>
    </div>
  );
}