export type NodeRisk = "critical" | "high" | "medium" | "low" | "clean";

export interface TwinNode {
  id: string;
  label: string;
  type: "server" | "workstation" | "router" | "firewall" | "database" | "cloud";
  ip: string;
  os?: string;
  risk: NodeRisk;
  compromised?: boolean;
  services?: string[];
  vlan?: string;
}

export interface TwinEdge {
  id: string;
  source: string;
  target: string;
  protocol?: string;
  port?: number;
  attackPath?: boolean;
}

export const TWIN_NODES: TwinNode[] = [
  {
    id: "fw-01",
    label: "Perimeter FW",
    type: "firewall",
    ip: "10.0.0.1",
    risk: "medium",
    vlan: "DMZ",
    services: ["pfSense 2.7"],
  },
  {
    id: "web-01",
    label: "Web Server",
    type: "server",
    ip: "192.168.1.55",
    os: "Ubuntu 22.04",
    risk: "critical",
    compromised: true,
    vlan: "DMZ",
    services: ["nginx 1.24", "Node.js 20"],
  },
  {
    id: "app-01",
    label: "App Server",
    type: "server",
    ip: "192.168.1.60",
    os: "Ubuntu 22.04",
    risk: "high",
    vlan: "APP",
    services: ["Python 3.11", "FastAPI"],
  },
  {
    id: "ad-01",
    label: "AD Controller",
    type: "server",
    ip: "192.168.1.10",
    os: "Windows Server 2022",
    risk: "critical",
    vlan: "CORE",
    services: ["Active Directory", "DNS", "LDAP"],
  },
  {
    id: "db-01",
    label: "Finance DB",
    type: "database",
    ip: "192.168.1.20",
    os: "RHEL 9",
    risk: "high",
    vlan: "DATA",
    services: ["PostgreSQL 16"],
  },
  {
    id: "db-02",
    label: "App DB",
    type: "database",
    ip: "192.168.1.21",
    os: "RHEL 9",
    risk: "low",
    vlan: "DATA",
    services: ["PostgreSQL 16"],
  },
  {
    id: "ws-01",
    label: "Workstation A",
    type: "workstation",
    ip: "10.0.5.11",
    os: "Windows 11",
    risk: "low",
    vlan: "CORP",
    services: [],
  },
  {
    id: "ws-02",
    label: "Workstation B",
    type: "workstation",
    ip: "10.0.5.12",
    os: "Windows 11",
    risk: "medium",
    vlan: "CORP",
    services: [],
  },
  {
    id: "jump-01",
    label: "Jump Host",
    type: "server",
    ip: "10.0.0.5",
    os: "Ubuntu 22.04",
    risk: "medium",
    vlan: "MGMT",
    services: ["OpenSSH 9.3"],
  },
  {
    id: "c2-ext",
    label: "C2 Server",
    type: "cloud",
    ip: "45.33.32.156",
    risk: "critical",
    compromised: true,
    services: ["Cobalt Strike"],
  },
];

export const TWIN_EDGES: TwinEdge[] = [
  { id: "e1",  source: "c2-ext",  target: "web-01",  protocol: "HTTPS", port: 443, attackPath: true  },
  { id: "e2",  source: "fw-01",   target: "web-01",  protocol: "HTTP/S", port: 443                   },
  { id: "e3",  source: "web-01",  target: "app-01",  protocol: "HTTP",  port: 8000, attackPath: true  },
  { id: "e4",  source: "app-01",  target: "db-01",   protocol: "TCP",   port: 5432                   },
  { id: "e5",  source: "app-01",  target: "db-02",   protocol: "TCP",   port: 5432                   },
  { id: "e6",  source: "app-01",  target: "ad-01",   protocol: "LDAP",  port: 389,  attackPath: true  },
  { id: "e7",  source: "ad-01",   target: "db-01",   protocol: "TCP",   port: 1433                   },
  { id: "e8",  source: "ws-01",   target: "ad-01",   protocol: "LDAP",  port: 389                    },
  { id: "e9",  source: "ws-02",   target: "ad-01",   protocol: "LDAP",  port: 389                    },
  { id: "e10", source: "jump-01", target: "web-01",  protocol: "SSH",   port: 22                     },
  { id: "e11", source: "jump-01", target: "app-01",  protocol: "SSH",   port: 22                     },
  { id: "e12", source: "fw-01",   target: "jump-01", protocol: "SSH",   port: 22                     },
];