// src/app/incidents/page.tsx
import Link from "next/link";
import { MOCK_INCIDENT } from "@/lib/mock-incident"; // adjust path as needed

export default function IncidentsPage() {
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-xl font-bold text-slate-100 mb-6">Incidents</h1>
      <Link
        href={`/incidents/${MOCK_INCIDENT.id}`}
        className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors"
      >
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/40">
          HIGH
        </span>
        <span className="text-sm font-mono text-slate-500">{MOCK_INCIDENT.id}</span>
        <span className="text-sm text-slate-200 flex-1">{MOCK_INCIDENT.title}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
          PENDING
        </span>
      </Link>
    </div>
  );
}