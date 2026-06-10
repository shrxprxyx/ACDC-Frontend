export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type IncidentStatus =
  | "TRIAGING"
  | "ANALYZING"
  | "SIMULATING"
  | "PENDING_APPROVAL"
  | "EXECUTING"
  | "RESOLVED"
  | "AUTO_RESOLVED";

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  type: string;
  affectedAsset: string;
  confidence: number;
  createdAt: Date;
  agentStage: number;
}

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "INC-2025-0942",
    title: "Lateral Movement — AD Controller",
    severity: "CRITICAL",
    status: "PENDING_APPROVAL",
    type: "lateral_movement",
    affectedAsset: "AD Controller / 192.168.1.10",
    confidence: 0.91,
    createdAt: new Date(Date.now() - 1000 * 60 * 4),
    agentStage: 5,
  },
  {
    id: "INC-2025-0941",
    title: "C2 Beacon — Cobalt Strike Signature",
    severity: "HIGH",
    status: "SIMULATING",
    type: "c2_communication",
    affectedAsset: "Web Server / 192.168.1.55",
    confidence: 0.87,
    createdAt: new Date(Date.now() - 1000 * 60 * 12),
    agentStage: 4,
  },
  {
    id: "INC-2025-0940",
    title: "Brute Force — SSH Login Attempts",
    severity: "MEDIUM",
    status: "ANALYZING",
    type: "brute_force",
    affectedAsset: "Jump Host / 10.0.0.5",
    confidence: 0.78,
    createdAt: new Date(Date.now() - 1000 * 60 * 28),
    agentStage: 2,
  },
  {
    id: "INC-2025-0939",
    title: "Suspicious PowerShell Execution",
    severity: "HIGH",
    status: "PENDING_APPROVAL",
    type: "malicious_script",
    affectedAsset: "Workstation / 192.168.2.44",
    confidence: 0.94,
    createdAt: new Date(Date.now() - 1000 * 60 * 41),
    agentStage: 5,
  },
  {
    id: "INC-2025-0938",
    title: "Port Scan — Internal Subnet",
    severity: "LOW",
    status: "AUTO_RESOLVED",
    type: "reconnaissance",
    affectedAsset: "VLAN-10 / 192.168.1.0/24",
    confidence: 0.72,
    createdAt: new Date(Date.now() - 1000 * 60 * 95),
    agentStage: 6,
  },
  {
    id: "INC-2025-0937",
    title: "Data Exfiltration Attempt — S3 Bucket",
    severity: "CRITICAL",
    status: "RESOLVED",
    type: "exfiltration",
    affectedAsset: "Finance DB / 10.0.1.20",
    confidence: 0.96,
    createdAt: new Date(Date.now() - 1000 * 60 * 180),
    agentStage: 6,
  },
];

export const MOCK_PENDING_APPROVALS = [
  {
    id: "INC-2025-0942",
    title: "Lateral Movement — AD Controller",
    severity: "CRITICAL" as Severity,
    action: "Quarantine host 192.168.1.55 + block egress to 45.33.32.156",
    plan: "Surgical Isolation (PLAN-A)",
    confidence: 0.91,
    timeoutSeconds: 300,
    createdAt: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: "INC-2025-0939",
    title: "Suspicious PowerShell Execution",
    severity: "HIGH" as Severity,
    action: "Force password reset for user:jsmith + isolate workstation",
    plan: "Credential Containment (PLAN-B)",
    confidence: 0.94,
    timeoutSeconds: 180,
    createdAt: new Date(Date.now() - 1000 * 60 * 1),
  },
];