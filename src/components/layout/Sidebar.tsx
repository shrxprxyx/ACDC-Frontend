"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShieldAlert, GitFork,
  BarChart3, Cpu, Settings, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/",           icon: LayoutDashboard, label: "Command Center" },
  { href: "/incidents",  icon: ShieldAlert,     label: "Incidents",     badge: "3" },
  { href: "/twin",       icon: GitFork,         label: "Digital Twin"  },
  { href: "/analytics",  icon: BarChart3,       label: "Analytics"     },
  { href: "/agents",     icon: Cpu,             label: "Agents"        },
  { href: "/settings",   icon: Settings,        label: "Configuration" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col w-56 shrink-0 h-screen sticky top-0 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0f1e 0%, #080c18 100%)",
        borderRight: "1px solid rgba(99,179,237,0.08)",
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(99,102,241,0.3) 100%)",
              border: "1px solid rgba(99,179,237,0.25)",
              boxShadow: "0 0 16px rgba(59,130,246,0.2)",
            }}
          >
            <ShieldAlert className="w-4 h-4" style={{ color: "#60a5fa" }} />
          </div>
          <div>
            <p
              className="text-sm font-bold tracking-[0.2em]"
              style={{ color: "#e2e8f0" }}
            >
              ACDC
            </p>
            <p
              className="text-[9px] tracking-[0.15em] uppercase"
              style={{ color: "#4a6080" }}
            >
              Cyber Defense
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mt-5 h-px w-full"
          style={{ background: "linear-gradient(90deg, rgba(99,179,237,0.15) 0%, transparent 100%)" }}
        />
      </div>

      {/* Nav label */}
      <p className="px-5 mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: "#2d4a6e" }}>
        Navigation
      </p>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 group",
              )}
              style={
                active
                  ? {
                      background: "linear-gradient(90deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 100%)",
                      color: "#60a5fa",
                      border: "1px solid rgba(59,130,246,0.2)",
                    }
                  : {
                      color: "#4a6080",
                      border: "1px solid transparent",
                    }
              }
            >
              {/* Active left bar */}
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ background: "#60a5fa", boxShadow: "0 0 8px #60a5fa" }}
                />
              )}

              <Icon
                className="w-4 h-4 shrink-0 transition-colors"
                style={{ color: active ? "#60a5fa" : "#2d4a6e" }}
              />

              <span className="flex-1">{label}</span>

              {badge && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(239,68,68,0.15)",
                    color: "#f87171",
                    border: "1px solid rgba(239,68,68,0.2)",
                  }}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-2 mt-2">
        {/* Divider */}
        <div
          className="h-px mx-2 mb-3"
          style={{ background: "linear-gradient(90deg, rgba(99,179,237,0.1) 0%, transparent 100%)" }}
        />

        {/* Platform mode */}
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
          style={{
            background: "rgba(234,179,8,0.06)",
            border: "1px solid rgba(234,179,8,0.15)",
          }}
        >
          <Zap className="w-3.5 h-3.5 shrink-0" style={{ color: "#facc15" }} />
          <div className="flex-1 min-w-0">
            <p className="text-[9px] uppercase tracking-[0.15em]" style={{ color: "#713f12" }}>
              Platform Mode
            </p>
            <p className="text-[11px] font-semibold" style={{ color: "#facc15" }}>
              Semi-Auto
            </p>
          </div>
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
            style={{ background: "#facc15", boxShadow: "0 0 6px #facc15" }}
          />
        </div>

        {/* Live status */}
        <div
          className="flex items-center gap-2.5 px-3 py-2"
          style={{ color: "#2d4a6e" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
            style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
          />
          <span className="text-[11px]">All systems operational</span>
        </div>
      </div>
    </aside>
  );
}