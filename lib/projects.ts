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
}

export const projects: Project[] = [
  {
    slug: "autodrive",
    title: "Autodrive",
    summary: "A full-stack fleet & driver management mobile app, shipped to the Play Store after two years of development.",
    role: "Product Manager + Flutter Contributor",
    stack: ["Flutter", "Firebase", "GitHub Actions", "Dart"],
    tags: ["Mobile", "Flutter", "Product Management"],
    outcome: "Shipped to Play Store · 2-year development · Full CI/CD pipeline",
    featured: true,
    order_index: 1,
    category: "mobile",
    problem:
      "Fleet operators in Nigeria lacked an affordable, mobile-first tool to manage drivers, track trips, and handle vehicle assignments. Existing solutions were desktop-only and expensive.",
    build:
      "Led product scope, roadmap, and sprint cycles while contributing directly to the Flutter codebase. Implemented CI/CD with GitHub Actions for automated builds and Play Store deployment. Firebase handled authentication, real-time updates, and cloud storage.",
    lessons:
      "Two years taught me that shipping matters more than perfection. The product evolved from scope creep into focused delivery once we cut features and prioritised the core loop.",
    timeline: "2023 – 2025",
    status: "Shipped",
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
      "Health information in Nigeria is fragmented and hard to access on mobile. Users needed a single app for symptom checking, appointment reminders, and health records.",
    build:
      "Built all 25 screens in Flutter with a clean Bloc state management architecture. Firebase Firestore handled user health data, Firebase Auth managed accounts, and push notifications kept users engaged with medication and appointment reminders.",
    lessons:
      "Health apps demand extreme attention to UX at every screen. A confused user in a health context is a failed product. I learned to design for the least technical user first.",
    timeline: "2024",
    status: "Shipped",
  },
  {
    slug: "insdec",
    title: "iNSDEC Website & Internal Tools",
    summary: "End-to-end tech setup for an NGO — company website, Microsoft 365 deployment, and internal workflow tools.",
    role: "Technical Officer",
    stack: ["Next.js", "Microsoft 365", "SharePoint", "Power Automate"],
    tags: ["Web", "Consulting", "Business Tech"],
    outcome: "M365 deployed for full org · Internal tools live · Company website shipped",
    featured: false,
    order_index: 3,
    category: "consulting",
    problem:
      "iNSDEC operated with no centralised communication platform, no document management system, and no public web presence. Staff used personal emails and WhatsApp for everything.",
    build:
      "Scoped and deployed Microsoft 365 for the entire organisation, including Teams, SharePoint, and OneDrive. Built internal workflow tools using Power Automate. Designed and built the company website with Next.js.",
    lessons:
      "Non-technical organisations need hand-holding through adoption, not just deployment. The tech is the easy part — the change management is the real challenge.",
    timeline: "2025",
    status: "Live",
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
      "HermexTravels needed a clean, fast mobile interface for their travel booking backend. The existing web UI didn't translate well to mobile, causing high drop-off rates.",
    build:
      "Built responsive Flutter UI components with smooth animations and REST API integration. Focused on performance — lazy loading, optimistic UI updates, and efficient list rendering for search results.",
    lessons:
      "Travel UX lives and dies by speed. A one-second delay on a search result costs a booking. I learned to profile Flutter apps relentlessly and cut every unnecessary rebuild.",
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
