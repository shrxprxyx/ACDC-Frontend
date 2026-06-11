export const INCIDENT_TREND = [
  { date: "Sep 13", total: 3,  critical: 1, high: 1, medium: 1, autoResolved: 2  },
  { date: "Sep 14", total: 5,  critical: 2, high: 2, medium: 1, autoResolved: 3  },
  { date: "Sep 15", total: 4,  critical: 1, high: 2, medium: 1, autoResolved: 3  },
  { date: "Sep 16", total: 7,  critical: 3, high: 2, medium: 2, autoResolved: 4  },
  { date: "Sep 17", total: 6,  critical: 2, high: 3, medium: 1, autoResolved: 5  },
  { date: "Sep 18", total: 9,  critical: 4, high: 3, medium: 2, autoResolved: 6  },
  { date: "Sep 19", total: 4,  critical: 2, high: 1, medium: 1, autoResolved: 2  },
];

export const MTTD_TREND = [
  { date: "Sep 13", mttd: 4.2, mttr: 18.5 },
  { date: "Sep 14", mttd: 3.8, mttr: 16.2 },
  { date: "Sep 15", mttd: 3.1, mttr: 14.8 },
  { date: "Sep 16", mttd: 2.9, mttr: 13.1 },
  { date: "Sep 17", mttd: 2.5, mttr: 12.4 },
  { date: "Sep 18", mttd: 2.2, mttr: 11.9 },
  { date: "Sep 19", mttd: 2.1, mttr: 11.7 },
];

export const CONFIDENCE_DIST = [
  { bucket: "50–60%", count: 2  },
  { bucket: "60–70%", count: 5  },
  { bucket: "70–80%", count: 8  },
  { bucket: "80–90%", count: 14 },
  { bucket: "90–95%", count: 9  },
  { bucket: "95–100%",count: 4  },
];

export const AUTO_RESOLVE_TREND = [
  { date: "Sep 13", rate: 55 },
  { date: "Sep 14", rate: 58 },
  { date: "Sep 15", rate: 61 },
  { date: "Sep 16", rate: 59 },
  { date: "Sep 17", rate: 63 },
  { date: "Sep 18", rate: 66 },
  { date: "Sep 19", rate: 68 },
];

// MITRE ATT&CK heatmap — tactic × technique hit counts
export const MITRE_DATA = [
  { tactic: "Initial Access",   technique: "T1190",    name: "Exploit Public App",      count: 4  },
  { tactic: "Initial Access",   technique: "T1566",    name: "Phishing",                count: 2  },
  { tactic: "Execution",        technique: "T1059.001",name: "PowerShell",              count: 7  },
  { tactic: "Execution",        technique: "T1059.003",name: "Windows Cmd Shell",       count: 3  },
  { tactic: "Persistence",      technique: "T1053",    name: "Scheduled Task",          count: 2  },
  { tactic: "Persistence",      technique: "T1547",    name: "Boot Autostart",          count: 1  },
  { tactic: "Defense Evasion",  technique: "T1055",    name: "Process Injection",       count: 3  },
  { tactic: "Defense Evasion",  technique: "T1562",    name: "Impair Defenses",         count: 2  },
  { tactic: "Credential Access",technique: "T1003",    name: "OS Credential Dumping",   count: 5  },
  { tactic: "Credential Access",technique: "T1110",    name: "Brute Force",             count: 3  },
  { tactic: "Lateral Movement", technique: "T1021",    name: "Remote Services",         count: 6  },
  { tactic: "Lateral Movement", technique: "T1550",    name: "Use Alt Auth Material",   count: 2  },
  { tactic: "C2",               technique: "T1071.001",name: "App Layer Protocol",      count: 8  },
  { tactic: "C2",               technique: "T1095",    name: "Non-App Layer Protocol",  count: 1  },
  { tactic: "Exfiltration",     technique: "T1041",    name: "Exfil Over C2",           count: 3  },
  { tactic: "Impact",           technique: "T1486",    name: "Data Encrypted",          count: 1  },
];

export const SEVERITY_PIE = [
  { name: "Critical", value: 8,  color: "#e05252" },
  { name: "High",     value: 14, color: "#d97706" },
  { name: "Medium",   value: 9,  color: "#b59a2e" },
  { name: "Low",      value: 7,  color: "#3d9966" },
];

export const SUMMARY_STATS = [
  { label: "Total Incidents (7d)", value: "38"    },
  { label: "Auto-Resolved",        value: "25"    },
  { label: "Avg MTTD",             value: "2m 6s" },
  { label: "Avg MTTR",             value: "11m 42s"},
];