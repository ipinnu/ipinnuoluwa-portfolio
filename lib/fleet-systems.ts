export type EvidenceStatus =
  | "Shipped · Anonymized"
  | "Concept exploration · Personal product thesis"
  | "In development · Concept stage"
  | "Unaffiliated personal concept";

export interface FleetMediaSlot {
  id: string;
  kind: "screenshot" | "video";
  title: string;
  description: string;
  status: EvidenceStatus;
  src?: string;
  poster?: string;
  alt?: string;
}

export interface MaturityStage {
  version: "V1" | "V2" | "V3";
  name: string;
  promise: string;
  status: EvidenceStatus;
  summary: string;
  capabilities: string[];
  businessValue: string;
  media: FleetMediaSlot[];
}

export const systemProof = [
  {
    value: "3,000+",
    label: "vehicles within the operational footprint",
  },
  {
    value: "Multi-tenant",
    label: "enterprise environments kept deliberately isolated",
  },
  {
    value: "Daily",
    label: "operational decisions supported by live fleet signals",
  },
] as const;

export const architectureDecisions = [
  {
    index: "01",
    title: "Isolated multi-tenant dashboards",
    description:
      "I ran four enterprise dashboards on one droplet, but each tenant got its own data path. Vehicle rows, reports, and alerts were scoped by tenant ID on every query so one fleet could not read another. Same codebase, separate stores—no shared tables, no cross-tenant joins.",
    impact: "Four isolated dashboards, one deploy",
  },
  {
    index: "02",
    title: "Rate-limited provider sync",
    description:
      "I ingested inconsistent JSON from multiple telemetry providers. I could not poll them like a local DB—quotas and stale payloads would fail the job. I batched pulls, normalized each dump before write, and kept the last good record when a provider timed out so the dashboards stayed up.",
    impact: "Sync held under provider limits",
  },
  {
    index: "03",
    title: "JSON → SQLite → Postgres",
    description:
      "I started on JSON dumps. File queries stalled, so I moved to SQLite. Concurrent dashboard reads then write-locked the file store, so I migrated to Postgres. The box followed: 1 vCPU / 1 GB / 25 GB at ~$6 until memory and I/O thrashed, then 2 vCPU / 4 GB / 80 GB / 4 TB at $24.",
    impact: "Four tenants on a $24 droplet",
  },
] as const;

export const maturityStages: MaturityStage[] = [
  {
    version: "V1",
    name: "Visibility",
    promise: "Know what is happening.",
    status: "Shipped · Anonymized",
    summary:
      "Bring fragmented vehicle signals into one operational view so teams can move from chasing updates to seeing fleet health, risk, and exceptions as they emerge.",
    capabilities: [
      "Real-time telemetry and fleet status",
      "Event detection and driver-risk panels",
      "Tenant-aware views and operational reporting",
    ],
    businessValue:
      "Less manual reconciliation, faster exception discovery, and one shared version of fleet reality.",
    media: [
      {
        id: "v1-dashboard",
        kind: "screenshot",
        title: "Fleet visibility dashboard",
        description:
          "Live fleet state, panic alerts, and exception-first vehicle status.",
        status: "Shipped · Anonymized",
        src: "/images/fleet-systems/v1.png",
        alt: "Fleet visibility dashboard showing online assets, anomalies, and status table",
      },
      {
        id: "v1-list",
        kind: "screenshot",
        title: "Vehicle status list",
        description:
          "Parked, idle, and moving states with acknowledge actions on exception rows.",
        status: "Shipped · Anonymized",
        src: "/images/fleet-systems/v1-2.png",
        alt: "Vehicle status list with parked, idle, and moving badges",
      },
    ],
  },
  {
    version: "V2",
    name: "Context",
    promise: "Understand why it matters.",
    status: "Concept exploration · Personal product thesis",
    summary:
      "Move beyond isolated alerts by correlating incidents, location, operating conditions, and external signals into a decision-ready explanation.",
    capabilities: [
      "Incident and signal correlation",
      "Operational context around exceptions",
      "Prioritized investigation views",
    ],
    businessValue:
      "Teams spend less time interpreting noise and more time acting on the events with material operational impact.",
    media: [
      {
        id: "v2-walkthrough",
        kind: "video",
        title: "V2 context walkthrough",
        description:
          "Screen recording of the context layer: settings, operational views, and how an operator moves from signal to investigation.",
        status: "Concept exploration · Personal product thesis",
        src: "/Videos/fleet-systems/v2.mp4",
      },
    ],
  },
  {
    version: "V3",
    name: "Automation & integration",
    promise: "Act before the issue becomes loss.",
    status: "Concept exploration · Personal product thesis",
    summary:
      "Turn known patterns into coordinated action: escalate the right event, detect suspicious behavior, surface predictive risk, and deliver answers in the tools operators already use.",
    capabilities: [
      "Automated escalation and anomaly detection",
      "Predictive risk and self-serve reporting",
      "Conversational access through channels such as WhatsApp",
    ],
    businessValue:
      "Shorter response loops, earlier intervention, and operational intelligence that travels to the user instead of waiting inside a dashboard.",
    media: [],
  },
];

export const erpMedia: FleetMediaSlot[] = [
  {
    id: "erp-1",
    kind: "screenshot",
    title: "ERP suite with fleet module",
    description:
      "Business suite overview with fleet management surfaced as a first-class module.",
    status: "In development · Concept stage",
    src: "/images/fleet-systems/erp-1.png",
    alt: "Business suite dashboard featuring a new fleet management module",
  },
  {
    id: "erp-2",
    kind: "screenshot",
    title: "Finance and ledger workspace",
    description:
      "Accounting, journals, and trial balance sitting in the same suite as fleet.",
    status: "In development · Concept stage",
    src: "/images/fleet-systems/erp-2.png",
    alt: "ERP accounting workspace with journal entries and trial balance",
  },
  {
    id: "erp-3",
    kind: "screenshot",
    title: "Fleet module inside the suite",
    description:
      "Live tracking, assets, drivers, reports, and geofencing as one operational surface.",
    status: "In development · Concept stage",
    src: "/images/fleet-systems/erp-3.png",
    alt: "Fleet management module with live tracking and operational tools",
  },
];

export const companyFit = [
  {
    name: "Shell",
    sector: "Energy operations",
    logo: "/images/fleet-systems/brands/shell.svg",
  },
  {
    name: "TotalEnergies",
    sector: "Distributed fleets",
    logo: "/images/fleet-systems/brands/totalenergies.png",
  },
  {
    name: "Maersk",
    sector: "Logistics networks",
    logo: "/images/fleet-systems/brands/maersk.png",
  },
  {
    name: "DHL",
    sector: "Last-mile operations",
    logo: "/images/fleet-systems/brands/dhl.svg",
  },
  {
    name: "Dangote",
    sector: "Industrial logistics",
    logo: "/images/fleet-systems/brands/dangote.png",
  },
] as const;

