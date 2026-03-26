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
  liveUrl?: string;
  playStoreUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "autodrive",
    title: "Autodrive",
    summary: "Fleet and driver management mobile app. Two years of development, shipped to the Play Store.",
    role: "Product Manager + Flutter Contributor",
    stack: ["Flutter", "Firebase", "GitHub Actions", "Dart"],
    tags: ["Mobile", "Flutter", "Product Management"],
    outcome: "Shipped to Play Store · 2-year development · Full CI/CD pipeline",
    featured: true,
    order_index: 1,
    category: "mobile",
    problem:
      "Fleet operators in Nigeria had no affordable mobile tool to manage drivers, track trips and handle vehicle assignments. Everything out there was desktop-only and expensive.",
    build:
      "Handled product scope, roadmap and sprint cycles while contributing directly to the Flutter codebase. Set up CI/CD with GitHub Actions for automated builds and Play Store deployment. Firebase handled authentication, real-time updates and cloud storage.",
    lessons:
      "Two years taught me that shipping matters more than perfection. We had scope creep for a long time. Once we cut features and focused on the core loop, we actually shipped.",
    timeline: "2023 – 2025",
    status: "Shipped",
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
