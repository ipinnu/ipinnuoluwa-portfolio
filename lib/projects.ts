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
  imageCaptions?: string[];
  imageLayout?: "grid" | "stack";
  proofPoints?: { value: string; label: string }[];
  highlights?: string[];
  media?: {
    src: string;
    poster: string;
    title: string;
    caption: string;
    duration: string;
  }[];
  note?: string;
  liveUrl?: string;
  playStoreUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "fixora-global-hub",
    title: "Fixora Global Hub",
    summary:
      "An end-to-end, two-sided services marketplace connecting Nigerian customers with skilled artisans through job posting, bidding, real-time communication, identity verification, payments, reviews, and marketplace operations.",
    role: "Product Designer & Full-Stack Engineer",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Supabase",
      "PostgreSQL",
      "Paystack",
      "Resend",
    ],
    tags: ["Full Stack", "Marketplace", "Payments", "Realtime", "Nigeria"],
    outcome:
      "Production-ready marketplace · 3 role-specific products · Secure payment state machine · Verification and proof-of-work operations",
    featured: true,
    order_index: 0,
    category: "web",
    problem:
      "Nigeria's artisan economy is still driven by fragmented referrals. Customers struggle to verify skill and accountability, while capable professionals struggle to reach qualified demand and prove their credibility. FIXORA needed to coordinate discovery, trust, communication, work approval, and payment across customers, artisans, and marketplace administrators without exposing private or financial data between roles.",
    build:
      "Architected three interconnected product experiences for customers, artisans, and administrators. Built authentication, protected dashboards, editable profiles, marketplace discovery, public artisan profiles, category and state filtering, and a multi-step job-posting workflow covering service taxonomy, budgets, timelines, Nigerian location data, and image uploads.\n\nDesigned a PostgreSQL model for profiles, jobs, bids, messages, notifications, reviews, transactions, verification applications, job photos, and proof-of-work submissions. Supabase Realtime powers private messaging and unread state; database triggers match new jobs by trade and location and notify customers when bids arrive. Row-Level Security policies protect user-owned data, marketplace transactions, verification records, private messages, and storage objects.\n\nEngineered the bidding and payment lifecycle from bid submission and comparison through acceptance, job-state transitions, Paystack transaction initialization, HMAC webhook validation, server-side verification, escrow state, proof submission, and controlled payment release or refund. Administrators can review identity applications, proof of work, transactions, and manual release decisions. Safe demo modes expose all three dashboards to stakeholders without revealing production user data.",
    lessons:
      "Marketplace engineering is state-machine and trust engineering. Payments, verification, proof of work, permissions, and messaging only feel simple when the underlying transitions and access rules are explicit, secure, and recoverable.",
    timeline: "2026",
    status: "Live",
    liveUrl: "https://www.fixoraglobalhub.com/",
    image: "/images/projects/fixora/marketplace-poster.jpg",
    proofPoints: [
      { value: "3", label: "Interconnected user roles" },
      { value: "23", label: "Application pages" },
      { value: "10", label: "Core database entities" },
      { value: "≈12k", label: "Lines of TypeScript, SQL & CSS" },
    ],
    highlights: [
      "Role-specific customer, artisan, and administrator dashboards",
      "Supabase Auth, protected routes, session handling, and editable profiles",
      "PostgreSQL triggers for trade-and-location job matching and bid notifications",
      "Row-Level Security across marketplace data, private messages, and storage",
      "Bid submission, comparison, acceptance, rejection, and job-state transitions",
      "Paystack initialization, signed webhook validation, and server-side verification",
      "NIN verification, document upload, browser camera capture, and admin review",
      "Proof-of-work submission, approval, rejection, and controlled payment release",
      "Realtime messaging, notifications, unread counters, ratings, and reviews",
      "Production-aware demo modes, empty states, SEO foundations, and Vercel validation",
    ],
    media: [
      {
        src: "/Videos/Fixora%20Intro.mp4",
        poster: "/images/projects/fixora/marketplace-poster.jpg",
        title: "Marketplace experience",
        caption:
          "The public marketplace communicates the trust model, introduces verified professionals, and creates clear paths into task posting and artisan discovery.",
        duration: "0:41",
      },
      {
        src: "/Videos/Fixora%20Post%20a%20Task.mp4",
        poster: "/images/projects/fixora/post-task-poster.jpg",
        title: "Multi-step task creation",
        caption:
          "A structured job-posting workflow captures trade, location, problem context, urgency, budget, timing, and supporting media before matching can begin.",
        duration: "2:12",
      },
      {
        src: "/Videos/Fixora%20Sign%20up.mp4",
        poster: "/images/projects/fixora/signup-poster.jpg",
        title: "Role-aware onboarding",
        caption:
          "Account creation branches cleanly between customers seeking help and artisans offering services, while preserving a consistent trust-led experience.",
        duration: "1:29",
      },
    ],
  },
  {
    slug: "epraise-welding",
    title: "Epraise Welding",
    summary:
      "A full-stack digital commerce and client operations platform combining a conversion-focused industrial website with authenticated communication, quotations, approvals, and administrator-managed portfolio content.",
    role: "Product Designer & Full-Stack Engineer",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Supabase",
      "PostgreSQL",
      "Canvas API",
      "Resend",
    ],
    tags: ["Full Stack", "Client Portal", "CMS", "Realtime", "Industrial"],
    outcome:
      "Live · Authenticated client operations · Realtime messaging · Quote approval workflow · Self-managed gallery CMS",
    featured: true,
    order_index: 4,
    category: "web",
    problem:
      "EPraise Welding needed more than an online brochure. The business needed to acquire customers with a credible industrial presence, move serious inquiries into a private workspace, formalize project scope and pricing, and keep its portfolio current without depending on a developer for every image change.",
    build:
      "Designed and engineered a responsive, multi-page acquisition website with an industrial visual system, video-led storytelling, service discovery, animated counters, scroll reveals, parallax, asymmetric project galleries, contextual inquiries, and persistent pre-filled WhatsApp conversion paths.\n\nBuilt a Supabase-powered client operations portal with account registration, email/password authentication, protected routes, role-based client and administrator experiences, Realtime messaging, unread tracking, contextual inquiries, file attachments, and an admin inbox. Administrators can create line-item quotations, calculate totals, and send quote or contract cards directly into the client conversation. A cross-device HTML Canvas signature component supports mouse and touch approval.\n\nCreated a lightweight gallery CMS backed by Supabase Storage and PostgreSQL so administrators can upload, replace, edit, categorize, orient, and delete portfolio images themselves. Added Resend notifications, Row-Level Security, role-aware access policies, Nigeria-focused structured SEO, optimized image delivery, compressed video, deferred analytics, and render-performance improvements.",
    lessons:
      "The most valuable handoff is operational independence. A polished acquisition site wins attention, but the client portal and gallery CMS turn the platform into infrastructure the business can operate without ongoing developer intervention.",
    timeline: "2026",
    status: "Live",
    liveUrl: "https://www.epraisewelding.com/",
    image: "/images/projects/epraise/gallery-cms-poster.jpg",
    images: ["/images/Epraise.png"],
    imageCaptions: [
      "Administrator conversation workspace with contextual portfolio references, a structured line-item quote composer, attachments, and quote lifecycle controls.",
    ],
    imageLayout: "stack",
    proofPoints: [
      { value: "2", label: "Role-aware portal experiences" },
      { value: "Realtime", label: "Client and admin messaging" },
      { value: "RLS", label: "Database-level access control" },
      { value: "CMS", label: "Client-managed portfolio content" },
    ],
    highlights: [
      "Responsive industrial marketing system with video-led storytelling",
      "Supabase Auth, protected routes, and client/admin role separation",
      "Realtime messaging, unread state, contextual inquiries, and attachments",
      "Admin inbox with recent-thread prioritization and inquiry context",
      "Line-item quotation and contract cards delivered inside conversations",
      "Mouse- and touch-enabled HTML Canvas signature approvals",
      "Supabase Storage for attachments, signatures, and gallery assets",
      "Gallery CMS for upload, replacement, editing, orientation, and categorization",
      "Resend notifications, WhatsApp deep links, and Nigeria-focused technical SEO",
      "Media compression, deferred scripts, and reduced scroll-driven re-renders",
    ],
    media: [
      {
        src: "/Videos/Epraise.mp4",
        poster: "/images/projects/epraise/gallery-cms-poster.jpg",
        title: "Administrator-managed gallery CMS",
        caption:
          "The business can edit titles and descriptions, categorize work, replace imagery, adjust orientation, and remove portfolio items without developer support.",
        duration: "0:40",
      },
    ],
    note:
      "Scope note: the public contact form currently presents a designed success-state prototype but does not transmit or persist submissions. The implemented lead channels are the authenticated client portal and pre-filled WhatsApp journeys.",
  },
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
    summary:
      "A mobile travel platform that brings trip planning, flight and hotel booking, visa support, travel management, and AI-assisted guidance into one streamlined experience.",
    role: "Frontend Engineer",
    stack: ["Flutter", "REST APIs", "Dart"],
    tags: ["Mobile", "Flutter", "Travel", "API Integration"],
    outcome:
      "Live on Google Play · Production Flutter experience · REST API integration · Responsive booking flows",
    featured: false,
    order_index: 4,
    category: "mobile",
    problem:
      "HermexTravels needed to turn a broad set of travel services into a mobile experience that felt simple and dependable. Users needed to move from discovery to action without navigating a web interface that did not translate well to smaller screens. The challenge was to present trip planning, flight and hotel search, visa assistance, booking management, and travel support as one coherent journey while keeping the interface responsive around live travel data.",
    build:
      "Built the customer-facing mobile interface in Flutter and connected it to the existing travel backend through REST APIs. I translated the platform's core services into reusable, responsive components so search results, booking details, forms, and account states remained consistent across different screen sizes.\n\nStructured the data and UI layers to handle loading, success, empty, and failure states without breaking the booking journey. Performance work included lazy loading, optimistic UI updates, and efficient list rendering for data-heavy search results, reducing unnecessary rebuilds and keeping navigation responsive.\n\nThe result was a production mobile experience that made HermexTravels' wider offering easier to access from one place and established a component foundation that could grow with new travel products and backend capabilities.",
    lessons:
      "Travel products make performance and feedback inseparable from trust. Search, pricing, and availability depend on remote systems, so every loading state and API failure has to reassure the user that the app is still working. This project sharpened how I profile Flutter rebuilds, structure asynchronous UI states, and design resilient flows around network-dependent data.",
    timeline: "2024",
    status: "Live",
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=com.hermex.hermex_travels&pcampaignid=web_share",
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
