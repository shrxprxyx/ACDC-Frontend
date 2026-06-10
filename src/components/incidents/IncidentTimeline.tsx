"use client";

import { CheckCircle, Clock, Cpu, Zap, Shield } from "lucide-react";

type TimelineEntry = {
  id: string;
  time: string;
  type: "event" | "agent" | "gate";
  label: string;
  detail: string;
  status?: "complete" | "pending" | "running";
};

export function IncidentTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="relative">
      <div className="absolute left-4.75 top-2 bottom-2 w-px" style={{ background: "var(--border-subtle)" }} />
      <div className="space-y-1">
        {entries.map((entry) => {
          const isAgent   = entry.type === "agent";
          const isGate    = entry.type === "gate";
          const isPending = entry.status === "pending";
          const isDone    = entry.status === "complete";

          const dotBg     = isPending || isGate ? "rgba(181,154,46,0.10)" : isAgent ? "rgba(59,130,246,0.10)" : "rgba(255,255,255,0.04)";
          const dotBorder = isPending || isGate ? "rgba(181,154,46,0.30)" : isAgent ? "rgba(59,130,246,0.25)" : "var(--border-default)";
          const dotColor  = isPending || isGate ? "var(--yellow)"         : isAgent ? "var(--accent)"         : "var(--text-muted)";

          const tagBg     = isPending || isGate ? "var(--yellow-dim)"  : isAgent ? "var(--accent-dim)"  : "rgba(255,255,255,0.04)";
          const tagBorder = isPending || isGate ? "var(--yellow-border)": isAgent ? "var(--accent-border)": "var(--border-subtle)";
          const tagColor  = isPending || isGate ? "var(--yellow)"      : isAgent ? "var(--accent)"      : "var(--text-muted)";
          const tagLabel  = isGate ? "GATE" : isAgent ? "AGENT" : "EVENT";

          return (
            <div key={entry.id} className="flex gap-4">
              {/* dot */}
              <div className="relative z-10 mt-3 shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: dotBg, border: `1px solid ${dotBorder}` }}>
                {isGate    ? <Shield className="w-4 h-4" style={{ color: dotColor }} /> :
                 isAgent   ? <Cpu    className="w-4 h-4" style={{ color: dotColor }} /> :
                             <Zap    className="w-4 h-4" style={{ color: dotColor }} />}
              </div>

              {/* content */}
              <div className="flex-1 pb-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{entry.time}</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    style={{ background: tagBg, color: tagColor, border: `1px solid ${tagBorder}` }}>
                    {tagLabel}
                  </span>
                  {isDone && <CheckCircle className="w-3 h-3" style={{ color: "var(--green)" }} />}
                  {isPending && (
                    <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--yellow)" }}>
                      <Clock className="w-3 h-3" /> Awaiting
                    </span>
                  )}
                </div>
                <p className="text-[13px] font-medium mb-0.5" style={{ color: "var(--text-primary)" }}>{entry.label}</p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{entry.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}