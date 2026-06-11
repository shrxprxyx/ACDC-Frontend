"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import cytoscape, { type Core } from "cytoscape";
import {
  Server, Database, Monitor, Router, ShieldCheck,
  Cloud, RefreshCw, Maximize2, Info, X, Wifi
} from "lucide-react";
import { TWIN_NODES, TWIN_EDGES, type TwinNode, type NodeRisk } from "@/lib/mock-twin";

// ── risk colour helpers ────────────────────────────────────────────────────────

const RISK_COLOR: Record<NodeRisk, string> = {
  critical: "#e05252",
  high:     "#d97706",
  medium:   "#b59a2e",
  low:      "#3d9966",
  clean:    "#3b82f6",
};
const RISK_BG: Record<NodeRisk, string> = {
  critical: "rgba(224,82,82,0.10)",
  high:     "rgba(217,119,6,0.10)",
  medium:   "rgba(181,154,46,0.10)",
  low:      "rgba(61,153,102,0.10)",
  clean:    "rgba(59,130,246,0.10)",
};
const RISK_BORDER: Record<NodeRisk, string> = {
  critical: "rgba(224,82,82,0.28)",
  high:     "rgba(217,119,6,0.28)",
  medium:   "rgba(181,154,46,0.28)",
  low:      "rgba(61,153,102,0.28)",
  clean:    "rgba(59,130,246,0.28)",
};

const NODE_TYPE_ICON: Record<TwinNode["type"], React.ElementType> = {
  server:      Server,
  database:    Database,
  workstation: Monitor,
  router:      Router,
  firewall:    ShieldCheck,
  cloud:       Cloud,
};

// ── cytoscape style ────────────────────────────────────────────────────────────


function buildStyle(nodes: TwinNode[]) {
  const base: any[] = [
    {
      selector: "node",
      style: {
        width: 48,
        height: 48,
        shape: "ellipse",
        "background-color": "#ffffff",
        "border-width": 2,
        "border-color": "rgba(0,0,0,0.09)",
        label: "data(label)",
        "text-valign": "bottom",
        "text-halign": "center",
        "font-size": 10,
        color: "#4b5563",
        "text-margin-y": 6,
        "font-family": "Inter, ui-sans-serif, system-ui, sans-serif",
        "overlay-padding": 6,
      },
    },
    {
      selector: "edge",
      style: {
        width: 1.5,
        "line-color": "rgba(0,0,0,0.10)",
        "target-arrow-color": "rgba(0,0,0,0.10)",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        opacity: 0.8,
      },
    },
    {
      selector: "edge[?attackPath]",
      style: {
        width: 2.5,
        "line-color": "rgba(224,82,82,0.55)",
        "target-arrow-color": "rgba(224,82,82,0.55)",
        "line-style": "dashed",
        "line-dash-pattern": [6, 3],
        opacity: 1,
      },
    },
    {
      selector: "node:selected",
      style: {
        "border-width": 2.5,
        "border-color": "#3b82f6",
        "background-color": "rgba(59,130,246,0.15)",
      },
    },
    {
      selector: "node.highlighted",
      style: {
        "border-width": 3,
        "border-color": "#e05252",
        "background-color": "rgba(224,82,82,0.12)",
      },
    },
  ];

  // per-node risk colours
  nodes.forEach((n) => {
    const c = RISK_COLOR[n.risk];
    const bg = n.compromised ? `rgba(224,82,82,0.10)` : `#ffffff`;
    base.push({
      selector: `node[id="${n.id}"]`,
      style: {
        "border-color": n.compromised ? "#e05252" : c,
        "background-color": bg,
        "border-width": n.compromised ? 2.5 : 2,
      },
    });
  });

  return base;
}

// ── layout ─────────────────────────────────────────────────────────────────────

const LAYOUT = {
  name: "preset",
  positions: {
    "c2-ext":  { x: 600, y: 40  },
    "fw-01":   { x: 350, y: 40  },
    "web-01":  { x: 350, y: 160 },
    "app-01":  { x: 350, y: 280 },
    "ad-01":   { x: 200, y: 380 },
    "db-01":   { x: 480, y: 380 },
    "db-02":   { x: 600, y: 280 },
    "jump-01": { x: 100, y: 160 },
    "ws-01":   { x: 50,  y: 380 },
    "ws-02":   { x: 200, y: 480 },
  },
};

// ── detail panel ───────────────────────────────────────────────────────────────

function NodeDetailPanel({ node, onClose }: { node: TwinNode; onClose: () => void }) {
  const Icon = NODE_TYPE_ICON[node.type];
  const c    = RISK_COLOR[node.risk];
  const bg   = RISK_BG[node.risk];
  const bdr  = RISK_BORDER[node.risk];

  return (
    <div className="absolute top-3 right-3 w-64 rounded-lg overflow-hidden z-20"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}>
      {/* header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
          style={{ background: bg, border: `1px solid ${bdr}` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: c }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>{node.label}</p>
          <p className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>{node.ip}</p>
        </div>
        <button onClick={onClose} className="transition-opacity hover:opacity-70"
          style={{ color: "var(--text-muted)" }}>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* body */}
      <div className="px-3 py-2.5 space-y-2.5">
        <Row label="Risk">
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase"
            style={{ background: bg, color: c, border: `1px solid ${bdr}` }}>
            {node.risk}
          </span>
        </Row>
        <Row label="Type"><span style={{ color: "var(--text-secondary)" }}>{node.type}</span></Row>
        {node.vlan && <Row label="VLAN"><span style={{ color: "var(--text-secondary)" }}>{node.vlan}</span></Row>}
        {node.os   && <Row label="OS"  ><span style={{ color: "var(--text-secondary)" }}>{node.os}</span></Row>}
        {node.compromised && (
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded"
            style={{ background: "var(--red-dim)", border: "1px solid var(--red-border)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--red)" }} />
            <span className="text-[11px] font-medium" style={{ color: "var(--red)" }}>Compromised</span>
          </div>
        )}
        {node.services && node.services.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-1.5 font-semibold" style={{ color: "var(--text-muted)" }}>
              Services
            </p>
            <div className="flex flex-wrap gap-1">
              {node.services.map((s) => (
                <span key={s} className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="text-[11px]">{children}</span>
    </div>
  );
}

// ── legend ─────────────────────────────────────────────────────────────────────

function Legend() {
  const items: { label: string; risk: NodeRisk }[] = [
    { label: "Critical", risk: "critical" },
    { label: "High",     risk: "high"     },
    { label: "Medium",   risk: "medium"   },
    { label: "Low",      risk: "low"      },
  ];
  return (
    <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 z-20 px-2.5 py-2 rounded-md"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
      <p className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "var(--text-muted)" }}>Risk Level</p>
      {items.map((item) => (
        <div key={item.risk} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: RISK_COLOR[item.risk] }} />
          <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{item.label}</span>
        </div>
      ))}
      <div className="mt-1 pt-1.5 flex items-center gap-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div className="w-5 h-px border-t-2 border-dashed" style={{ borderColor: "rgba(224,82,82,0.55)" }} />
        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Attack path</span>
      </div>
    </div>
  );
}

// ── main view ──────────────────────────────────────────────────────────────────

export function DigitalTwinView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef        = useRef<Core | null>(null);
  const [selected, setSelected]       = useState<TwinNode | null>(null);
  const [attackPathOnly, setAttackPathOnly] = useState(false);
  const [syncTime] = useState("09:22:14");

  const resetView = useCallback(() => {
    cyRef.current?.fit(undefined, 40);
    cyRef.current?.center();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = [
      ...TWIN_NODES.map((n) => ({
        data: {
          id: n.id,
          label: n.label,
          risk: n.risk,
          compromised: n.compromised ?? false,
          nodeData: n,
        },
      })),
      ...TWIN_EDGES.map((e) => ({
        data: {
          id: e.id,
          source: e.source,
          target: e.target,
          protocol: e.protocol,
          port: e.port,
          attackPath: e.attackPath ?? false,
        },
      })),
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: buildStyle(TWIN_NODES),
      layout: LAYOUT as any,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      minZoom: 0.4,
      maxZoom: 2.5,
    });

    cy.on("tap", "node", (evt) => {
      const nodeId = evt.target.id() as string;
      const found  = TWIN_NODES.find((n) => n.id === nodeId) ?? null;
      setSelected(found);
    });

    cy.on("tap", (evt) => {
      if (evt.target === cy) setSelected(null);
    });

    // pulse compromised nodes
    TWIN_NODES.filter((n) => n.compromised).forEach((n) => {
      cy.$("#" + n.id).addClass("highlighted");
    });

    cyRef.current = cy;
    cy.fit(undefined, 48);

    return () => cy.destroy();
  }, []);

  // toggle attack-path-only filter
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    if (attackPathOnly) {
      cy.edges().style({ opacity: 0.06 });
      cy.edges("[?attackPath]").style({ opacity: 1 });
    } else {
      cy.edges().style({ opacity: 0.8 });
      cy.edges("[?attackPath]").style({ opacity: 1 });
    }
  }, [attackPathOnly]);

  // risk summary counts
  const byRisk = TWIN_NODES.reduce<Record<string, number>>((acc, n) => {
    acc[n.risk] = (acc[n.risk] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--bg-base)" }}>

      {/* top bar */}
      <div className="flex items-center justify-between px-6 py-3 shrink-0"
        style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div>
        </div>

        <div className="flex items-center gap-2">
          {/* attack path toggle */}
          <button
            onClick={() => setAttackPathOnly((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium transition-opacity hover:opacity-80"
            style={attackPathOnly
              ? { background: "var(--red-dim)",   color: "var(--red)",          border: "1px solid var(--red-border)"          }
              : { background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border-default)"   }}>
            <Wifi className="w-3.5 h-3.5" />
            Attack Path
          </button>

          <button onClick={resetView}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] transition-opacity hover:opacity-80"
            style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}>
            <Maximize2 className="w-3.5 h-3.5" />
            Reset View
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] transition-opacity hover:opacity-80"
            style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}>
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Twin
          </button>
        </div>
      </div>

      {/* risk summary strip */}
      <div className="flex items-center gap-3 px-6 py-2 shrink-0"
        style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)" }}>
        <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--text-muted)" }}>
          Asset Risk
        </span>
        {(["critical", "high", "medium", "low"] as NodeRisk[]).map((r) => (
          <div key={r} className="flex items-center gap-1.5 px-2 py-0.5 rounded"
            style={{ background: RISK_BG[r], border: `1px solid ${RISK_BORDER[r]}` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: RISK_COLOR[r] }} />
            <span className="text-[11px] font-medium capitalize" style={{ color: RISK_COLOR[r] }}>
              {byRisk[r] ?? 0} {r}
            </span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--red)" }} />
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {TWIN_NODES.filter((n) => n.compromised).length} nodes compromised
          </span>
        </div>
      </div>

      {/* graph canvas */}
      <div className="flex-1 relative overflow-hidden">
        <div ref={containerRef} className="w-full h-full" style={{ background: "var(--bg-elevated)" }} />

        {selected && (
          <NodeDetailPanel node={selected} onClose={() => setSelected(null)} />
        )}

        <Legend />

        {/* hint */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded z-20"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
          <Info className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Click a node for details · Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
}