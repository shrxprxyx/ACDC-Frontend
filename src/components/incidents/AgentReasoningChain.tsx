"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle, Cpu } from "lucide-react";

type Agent = {
  id: string;
  name: string;
  status: "complete" | "running" | "pending";
  duration: string;
  reasoning: string[];
  output: Record<string, unknown>;
};

function AgentCard({ agent, defaultOpen = false }: { agent: Agent; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg overflow-hidden transition-all"
      style={{
        background: open ? "rgba(59,130,246,0.04)" : "var(--bg-surface)",
        border: `1px solid ${open ? "var(--accent-border)" : "var(--border-default)"}`,
      }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/2">
        <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)" }}>
          <Cpu className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{agent.name}</span>
          <CheckCircle className="w-3 h-3" style={{ color: "var(--green)" }} />
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>completed in {agent.duration}</span>
        </div>
        {open
          ? <ChevronDown  className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
          : <ChevronRight className="w-4 h-4" style={{ color: "var(--text-muted)" }} />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          {/* reasoning */}
          <div className="pt-3">
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
              Reasoning
            </p>
            <ol className="space-y-2">
              {agent.reasoning.map((step, i) => (
                <li key={i} className="flex gap-3 text-[12px]" style={{ color: "var(--text-secondary)" }}>
                  <span className="shrink-0 w-5 h-5 rounded-full text-[10px] font-mono flex items-center justify-center mt-0.5"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* output */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
              Structured Output
            </p>
            <pre className="text-[11px] p-3 rounded-md overflow-x-auto leading-relaxed"
              style={{
                background: "var(--bg-base)",
                border: "1px solid var(--border-subtle)",
                color: "var(--green)",
              }}>
              {JSON.stringify(agent.output, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export function AgentReasoningChain({ agents }: { agents: Agent[] }) {
  return (
    <div className="space-y-2">
      {agents.map((agent, i) => (
        <AgentCard key={agent.id} agent={agent} defaultOpen={i === 0} />
      ))}
    </div>
  );
}