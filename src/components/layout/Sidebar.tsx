"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShieldAlert, GitFork,
  BarChart3, Cpu, Settings, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/",          icon: LayoutDashboard, label: "Command Center" },
  { href: "/incidents", icon: ShieldAlert,     label: "Incidents",    badge: "3" },
  { href: "/twin",      icon: GitFork,         label: "Digital Twin" },
  { href: "/analytics", icon: BarChart3,       label: "Analytics"    },
  { href: "/agents",    icon: Cpu,             label: "Agents"       },
  { href: "/settings",  icon: Settings,        label: "Configuration"},
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-56 shrink-0 h-screen sticky top-0 overflow-hidden"
      style={{ background: "var(--bg-surface)", borderRight: "1px solid var(--border-subtle)" }}>

      {/* Logo */}
      <div className="px-4 pt-5 pb-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
            style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)" }}>
            <ShieldAlert className="w-4 h-4" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-widest" style={{ color: "var(--text-primary)", letterSpacing: "0.18em" }}>
              ACDC
            </p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)", letterSpacing: "0.14em" }}>
              Cyber Defense
            </p>
          </div>
        </div>
      </div>

      {/* Nav label */}
      <p className="px-4 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: "var(--text-muted)", letterSpacing: "0.16em" }}>
        Menu
      </p>

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto pb-2">
        {nav.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className="relative flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors"
              style={active
                ? { background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent-border)" }
                : { color: "var(--text-secondary)", border: "1px solid transparent" }
              }>
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full"
                  style={{ background: "var(--accent)" }} />
              )}
              <Icon className="w-4 h-4 shrink-0" style={{ color: active ? "var(--accent)" : "var(--text-muted)" }} />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: "var(--red-dim)", color: "var(--red)", border: "1px solid var(--red-border)" }}>
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 pb-4 space-y-1.5" style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md"
          style={{ background: "var(--yellow-dim)", border: "1px solid var(--yellow-border)" }}>
          <Zap className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--yellow)" }} />
          <div className="flex-1 min-w-0">
            <p className="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Platform Mode</p>
            <p className="text-[12px] font-semibold" style={{ color: "var(--yellow)" }}>Semi-Auto</p>
          </div>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
            style={{ background: "var(--yellow)" }} />
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "var(--green)" }} />
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>All systems operational</span>
        </div>
      </div>
    </aside>
  );
}