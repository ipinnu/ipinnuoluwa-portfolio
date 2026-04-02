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
  imageLayout?: "grid" | "stack";
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
    summary:
      "A telemedicine mobile application connecting patients with healthcare professionals. Streamlines consultations, appointment management, and patient communication — with an integrated AI layer for preliminary responses and symptom triage.",
    role: "Flutter Developer",
    stack: ["Flutter", "Firebase", "Dart", "Bloc", "GitHub Actions"],
    tags: ["Mobile", "Flutter", "Health", "AI", "Telemedicine"],
    outcome: "Role-based telemedicine app · AI patient interaction · CI/CD to Play Store internal track · Cross-platform Android & iOS",
    featured: true,
    order_index: 2,
    category: "mobile",
    problem:
      "Access to healthcare professionals in Nigeria is limited by geography, cost, and availability. Patients needed a way to consult doctors remotely, manage appointments, and get reliable guidance — without the friction of in-person visits. Healthcare teams needed structured tooling to handle patient communication at scale.",
    build:
      "Used Bloc to implement a clean, scalable architecture separating UI, business logic, and data layers. Built modular APIs and a responsive, role-based UI serving three distinct user types — patients, doctors, and admins — each with their own flows and permissions. Applied test-driven development on critical features to ensure reliability across user roles.\n\nSet up GitHub Actions CI/CD pipelines to automatically build, test, and upload the app to an internal Play Store testing track — maintaining a production-ready workflow end-to-end.\n\nIntegrated an AI layer to provide intelligent responses to patients: symptom triage, automated guidance, and frequently asked questions. This reduces the load on healthcare professionals while improving patient engagement and accessibility from first contact.",
    lessons:
      "In healthcare, trust is the product. Every screen — from a symptom input to an AI response — had to communicate reliability, not just function. I learned to design for confidence first, features second.",
    timeline: "2025 – Present",
    status: "Ongoing",
    image: "/images/projects/my-health-padi/cover.avif",
    images: [
      "/images/projects/my-health-padi/Home%20page.avif",
      "/images/projects/my-health-padi/Screenshot%202026-03-31%20142740.png",
      "/images/projects/my-health-padi/0dPnF0rGYoF2BwUEXfSewoGro.avif",
      "/images/projects/my-health-padi/NoHdlaalRsJLbVuNatPF09cTZ4.avif",
    ],
  },
  {
    slug: "insdec",
    title: "YSoT Website",
    summary:
      "A dynamic company website for the Yaba School of Thought (YSoT) — featuring a full blogging system, event management, and gallery, backed by a custom CMS that gives the team complete content control without technical support.",
    role: "Web Developer",
    stack: ["Flutter", "Firebase", "Netlify", "Framer", "Android Studio"],
    tags: ["Web", "Flutter", "CMS", "Full Stack"],
    outcome: "Live · Custom CMS deployed · Full blog and event system · Mobile-ready shared codebase",
    featured: false,
    order_index: 3,
    category: "web",
    problem:
      "YSoT needed more than a static brochure site. As an organisation publishing policy briefs, hosting events, and growing a community, they needed a platform their own team could update in real time — without raising a support ticket every time they wanted to post an article or add a gallery image.",
    build:
      "Designed and implemented a custom backend CMS giving the YSoT team complete ownership of their content. From publishing blog posts and updating event details to managing gallery media, the team can independently keep the site current without external intervention. The CMS was built to be intuitive for non-technical users while maintaining structure and consistency in how content is presented — so the site stays coherent as it grows.\n\nBuilt the website on Flutter for web, delivering a responsive, high-performance experience across devices. The shared codebase also lays the groundwork for a future mobile app — core features can be extended to native Android and iOS without rebuilding from scratch. Firebase handles the backend and data layer, with Netlify managing deployment and hosting.",
    lessons:
      "Handing over a website is not the end — it is the beginning. Building a CMS that a non-technical team will actually use taught me that the interface for managing content is as important as the content itself. If it is confusing, it will not be used.",
    timeline: "2025",
    status: "Live",
    liveUrl: "https://luxury-torte-55be7e.netlify.app/",
    image: "/images/projects/insdec/Screenshot%202026-03-31%20162202.png",
    imageLayout: "stack",
    images: [
      "/images/projects/insdec/Screenshot%202026-03-31%20162234.png",
      "/images/projects/insdec/Screenshot%202026-03-31%20163519.png",
    ],
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
    image: "/images/projects/brainbox-studios/Screenshot%202026-03-31%20155925.png",
    imageLayout: "stack",
    images: [
      "/images/projects/brainbox-studios/Screenshot%202026-03-31%20160048.png",
      "/images/projects/brainbox-studios/Screenshot%202026-03-31%20160123.png",
    ],
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
    image: "/images/projects/autodrive-website/Screenshot%202026-03-31%20153648.png",
    images: [
      "/images/projects/autodrive-website/Screenshot%202026-03-31%20213827.png",
      "/images/projects/autodrive-website/Screenshot%202026-03-31%20153839.png",
      "/images/projects/autodrive-website/phone%20list.png",
    ],
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
    image: "/images/projects/hermex-travels/unnamed%20(1).webp",
    images: [
      "/images/projects/hermex-travels/unnamed%20(1).webp",
      "/images/projects/hermex-travels/unnamed.webp",
      "/images/projects/hermex-travels/unnamed%20(2).webp",
    ],
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
