export interface ResourceLink {
  label: string;
  url: string;
  description?: string;
}

export interface ResourceCategory {
  title: string;
  links: ResourceLink[];
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    title: "Official Docs",
    links: [
      { label: "React — Learn", url: "https://react.dev/learn", description: "The official tutorial and guides" },
      { label: "React — Hooks Reference", url: "https://react.dev/reference/react", description: "Every built-in hook documented" },
      { label: "React — API Reference", url: "https://react.dev/reference/react-dom", description: "react-dom and component APIs" },
    ],
  },
  {
    title: "Video Channels",
    links: [
      { label: "Fireship", url: "https://www.youtube.com/@Fireship", description: "Fast, dense, high-quality React content" },
      { label: "Web Dev Simplified", url: "https://www.youtube.com/@WebDevSimplified", description: "Beginner-friendly walkthroughs" },
      { label: "Net Ninja", url: "https://www.youtube.com/@NetNinja", description: "Structured series for every level" },
      { label: "Jack Herrington", url: "https://www.youtube.com/@jherr", description: "Advanced patterns and architecture" },
    ],
  },
  {
    title: "Articles & References",
    links: [
      { label: "W3Schools — React", url: "https://www.w3schools.com/react/", description: "Quick, practical examples for every concept" },
      { label: "DevDocs — React", url: "https://devdocs.io/react/", description: "Offline-capable API reference" },
      { label: "The Odin Project", url: "https://www.theodinproject.com/paths/full-stack-javascript/courses/react", description: "Free full curriculum with projects" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "r/reactjs", url: "https://www.reddit.com/r/reactjs/", description: "Questions, discussions, job posts" },
      { label: "Reactiflux Discord", url: "https://www.reactiflux.com/", description: "Active community of React developers" },
      { label: "Stack Overflow — React", url: "https://stackoverflow.com/questions/tagged/reactjs", description: "Answers to every error you'll ever see" },
    ],
  },
];
