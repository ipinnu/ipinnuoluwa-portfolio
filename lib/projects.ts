export interface Project {
  slug: string;
  title: string;
  summary: string;
  role: string;
  stack: string[];
  tags: string[];
  outcome: string;
  featured: boolean;
  order_index: number;
  category: "mobile" | "web" | "consulting";
  problem: string;
  build: string;
  lessons: string;
  timeline: string;
  status: "Live" | "Shipped" | "Ongoing";
  image?: string;
  images?: string[];
  liveUrl?: string;
  playStoreUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "autodrive",
    title: "Autodrive",
    summary:
      "A renewal and document management platform built for Nigerian drivers. Covers license, insurance, and roadworthiness renewals — with structured booking flows, Flutterwave payment integration, automated reminders, and admin-side tooling for backend teams.",
    role: "Product Designer & Flutter Engineer",
    stack: ["Flutter", "Firebase", "Flutterwave", "GitHub Actions", "Dart", "Figma"],
    tags: ["Mobile", "Flutter", "Fintech", "Product Design"],
    outcome: "Shipped to Play Store · Flutterwave payments integrated · End-to-end renewal flows · CI/CD pipeline · Android & iOS",
    featured: true,
    order_index: 1,
    category: "mobile",
    problem:
      "Millions of Nigerian drivers operate with expired licenses, insurance, and roadworthiness certificates — not from negligence, but because the renewal process is fragmented, opaque, and difficult to navigate on mobile. There was no single platform that handled the full cycle from document tracking to payment to confirmation, and backend teams had no structured tooling to support them.",
    build:
      "Translated Figma UI/UX flows into production-ready Flutter code, ensuring the final product matched design intent while staying optimised for real-world driver habits. Built structured booking logic that adapts to different renewal types, dynamically surfaces required documents per vehicle profile, and validates user input to reduce errors before submission.\n\nIntegrated secure Flutterwave payment hooks with edge-case handling across failed payments, timeouts, and duplicates — ensuring smooth progression regardless of network conditions. Introduced role-based access controls and admin-side interfaces that gave backend teams clear status visibility and streamlined their support workflows.\n\nUsed GitHub branching strategies and pull requests to maintain clean code practices throughout. Set up deployment pipelines that ensured quick, reliable updates — reducing downtime and giving both users and operational partners confidence in the platform's stability.",
    lessons:
      "The hardest part of building for this market is not the technology — it is designing for trust. Nigerian users have been burned by apps that take payments and disappear. Every edge case in the payment flow, every status indicator, every confirmation screen was an opportunity to either build or destroy that trust. I learned to engineer for confidence, not just functionality.",
    timeline: "2023 – 2025",
    status: "Shipped",
    image: "/images/projects/autodrive/Frame%20486.png",
    images: [
      "/images/projects/autodrive/Frame%20536.png",
      "/images/projects/autodrive/Your%20Profile.png",
      "/images/projects/autodrive/Your%20Profile%20-%20Personal%20Info%20-%20Address%20details.png",
    ],
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.ipinnu.AutodriveNew",
  },
  {
    slug: "my-health-padi",
    title: "My Health Padi",
    summary: "A 25-screen cross-platform health companion app built with Flutter and Firebase.",
    role: "Flutter Developer",
    stack: ["Flutter", "Firebase", "Dart"],
    tags: ["Mobile", "Flutter", "Health"],
    outcome: "25-screen health app · Cross-platform · Android & iOS",
    featured: true,
    order_index: 2,
    category: "mobile",
    problem:
      "Health information in Nigeria is scattered and hard to access on mobile. Users needed one app for symptom checking, appointment reminders and health records.",
    build:
      "Built all 25 screens in Flutter using Bloc for state management. Firebase Firestore handled health data, Firebase Auth managed accounts, and push notifications handled medication and appointment reminders.",
    lessons:
      "A confused user in a health context means a failed product. I started designing every screen for the least technical person in the room.",
    timeline: "2025 – Present",
    status: "Ongoing",
  },
  {
    slug: "insdec",
    title: "iNSDEC Website & Internal Tools",
    summary: "End-to-end tech setup for an NGO. Company website, Microsoft 365 deployment and internal workflow tools.",
    role: "Technical Officer",
    stack: ["Next.js", "Microsoft 365", "SharePoint", "Power Automate"],
    tags: ["Web", "Consulting", "Business Tech"],
    outcome: "M365 deployed for full org · Internal tools live · Company website shipped",
    featured: false,
    order_index: 3,
    category: "consulting",
    problem:
      "iNSDEC had no centralised communication platform, no document management and no public web presence. Staff were running everything through personal emails and WhatsApp.",
    build:
      "Scoped and deployed Microsoft 365 for the whole organisation including Teams, SharePoint and OneDrive. Built internal workflow tools with Power Automate. Designed and built the company website with Next.js.",
    lessons:
      "Non-technical organisations need proper hand-holding through adoption, not just deployment. The tech is the easy part. Getting people to actually use it is the real work.",
    timeline: "2025",
    status: "Live",
    liveUrl: "https://luxury-torte-55be7e.netlify.app/",
  },
  {
    slug: "brainbox-studios",
    title: "BrainBox Studios",
    summary:
      "Full company website for a technology execution firm, built to convert enterprise clients across founders, startups, businesses and government institutions.",
    role: "Web Designer & Developer",
    stack: ["Next.js", "React", "Tailwind CSS", "Netlify"],
    tags: ["Web", "Next.js", "Product Design"],
    outcome: "Live · Enterprise-grade positioning · Covers 5 client tiers from founders to government",
    featured: true,
    order_index: 5,
    category: "web",
    problem:
      "BrainBox Studios needed a web presence that matched the seriousness of their work. Government deployments, AI system architecture, enterprise contracts. A generic agency template would have undersold them.",
    build:
      "Designed and built the full site from scratch. Structured the narrative around five client tiers from founders to institutions, wrote the copy, built out service sections, a business model breakdown and a government case study for the NYSC-SAED programme. That was a 10,000+ user national deployment with 99.8% uptime.",
    lessons:
      "On a B2B website, positioning is the product. Every design decision has to reflect how serious the client is. I learned to build sites that do sales work, not just look good.",
    timeline: "2024",
    status: "Live",
    liveUrl: "https://brainboxportfolio.netlify.app/",
  },
  {
    slug: "autodrive-website",
    title: "AutoDrive Nigeria — Marketing Site",
    summary:
      "Next.js marketing website for the AutoDrive app. A problem-led landing page built to drive beta signups for Nigeria's vehicle document management platform.",
    role: "Web Designer & Developer",
    stack: ["Next.js", "React", "CSS", "Netlify"],
    tags: ["Web", "Next.js", "Marketing"],
    outcome: "Live · Beta signup funnel · Mobile-first · Paired with Android app launch",
    featured: false,
    order_index: 6,
    category: "web",
    problem:
      "AutoDrive needed a landing page that could do the explaining the app store listing could not. Convert people who had never heard of the product into beta users.",
    build:
      "Built with Next.js, mobile-first throughout. Opened with a problem narrative (18–25% of Nigerian drivers on the road with expired documents) before introducing AutoDrive as the answer. Used a limited-availability CTA to create urgency around the beta launch, with clear feature sections covering doorstep renewal, smart reminders and multi-vehicle management.",
    lessons:
      "A landing page has one job. Make the user take one action. I cut everything that did not serve that. No features for their own sake, no copy that makes the builder feel good but confuses the user.",
    timeline: "2025",
    status: "Live",
    liveUrl: "https://visionary-hotteok-f36a9b.netlify.app/",
  },
  {
    slug: "hermex-travels",
    title: "HermexTravels",
    summary: "Mobile-first UI for a travel booking platform with REST API integration.",
    role: "Frontend Engineer",
    stack: ["Flutter", "REST APIs", "Dart"],
    tags: ["Mobile", "Flutter", "Travel"],
    outcome: "Responsive UI components · API integration · Mobile-first",
    featured: false,
    order_index: 4,
    category: "mobile",
    problem:
      "HermexTravels needed a clean, fast mobile interface for their travel booking backend. The web UI did not translate well to mobile and users were dropping off.",
    build:
      "Built responsive Flutter UI components with REST API integration. Focused on performance throughout: lazy loading, optimistic UI updates and efficient list rendering for search results.",
    lessons:
      "In travel apps, speed is the UX. A one-second delay on a search result costs a booking. I started profiling Flutter apps properly and cutting every unnecessary rebuild.",
    timeline: "2024",
    status: "Ongoing",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => a.order_index - b.order_index);
}

export function getProjectsByCategory(
  category: Project["category"]
): Project[] {
  return projects
    .filter((p) => p.category === category)
    .sort((a, b) => a.order_index - b.order_index);
}
