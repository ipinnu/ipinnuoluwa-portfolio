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
    title: "Isolation before convenience",
    description:
      "Tenant context is carried through the request and data-access path so one operator's vehicles, reports, and risk events cannot leak into another environment. Shared product foundations stay reusable without flattening operational boundaries.",
    impact: "Safer multi-client reuse",
  },
  {
    index: "02",
    title: "Treat provider limits as a system constraint",
    description:
      "A rate-limited telemetry source cannot be queried like an internal database. The integration paces collection, normalizes provider responses, retries transient failures with restraint, and preserves the last trustworthy state when the upstream service slows down.",
    impact: "Stable visibility under API pressure",
  },
  {
    index: "03",
    title: "Let the data layer mature with the product",
    description:
      "I started on JSON dumps, moved to SQLite for queryable local state, then migrated to Postgres when concurrent dashboard reads locked the file store. The droplet followed the same path: 1 GB / $6 until it thrashed, then 4 GB / $24 to hold four enterprise tenants without oversizing.",
    impact: "JSON → SQLite → Postgres, cost-held",
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

