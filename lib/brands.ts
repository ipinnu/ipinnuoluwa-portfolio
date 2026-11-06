export interface Brand {
  name: string;
  shortName: string;
  sector: string;
  href?: string;
}

export const brands: Brand[] = [
  {
    name: "Fixora Global Hub",
    shortName: "FIXORA",
    sector: "Marketplace",
    href: "https://www.fixoraglobalhub.com/",
  },
  {
    name: "Epraise Welding",
    shortName: "EPRAISE",
    sector: "Industrial",
    href: "https://www.epraisewelding.com/",
  },
  {
    name: "AutoDrive Nigeria",
    shortName: "AUTODRIVE",
    sector: "Mobility",
  },
  {
    name: "My Health Padi",
    shortName: "HEALTH PADI",
    sector: "Health",
  },
  {
    name: "BrainBox Studios",
    shortName: "BRAINBOX",
    sector: "Technology",
    href: "https://brainboxportfolio.netlify.app/",
  },
  {
    name: "Yaba School of Thought",
    shortName: "YSOT",
    sector: "Policy",
    href: "https://luxury-torte-55be7e.netlify.app/",
  },
  {
    name: "HermexTravels",
    shortName: "HERMEX",
    sector: "Travel",
    href: "https://play.google.com/store/apps/details?id=com.hermex.hermex_travels",
  },
];

export interface CollaborationTeam {
  name: string;
  logo?: string;
  logoSize?: "large";
  accent?: "orange" | "yellow" | "blue";
  accentText?: string;
  showName?: boolean;
  logoHasPadding?: boolean;
  icon?: "airplane";
  affiliation?: { name: string; logo: string };
}

export const collaborationTeams: CollaborationTeam[] = [
  { name: "Chevron", logo: "/images/teams/chevron.svg" },
  { name: "Yaba School of Thought", affiliation: { name: "BusinessDay", logo: "/images/teams/businessday.png" } },
  { name: "Total", logo: "/images/fleet-systems/brands/totalenergies.png" },
  { name: "AutoDrive Nigeria", logo: "/images/teams/autodrive.png", showName: true },
  { name: "Lafarge", logo: "/images/teams/lafarge.svg" },
  { name: "JMG", logo: "/images/teams/jmg.webp" },
  { name: "Eduvibehub", logo: "/images/teams/eduvibehub.png", logoSize: "large" },
  ...brands.filter((brand) => brand.shortName !== "YSOT" && brand.shortName !== "AUTODRIVE").map((brand): CollaborationTeam => {
    if (brand.shortName === "FIXORA") {
      return { name: brand.name, accent: "orange", accentText: "Fixora" };
    }
    if (brand.shortName === "EPRAISE") {
      return { name: brand.name, logo: "/images/teams/epraise.png", accent: "yellow", showName: true, logoHasPadding: true };
    }
    if (brand.shortName === "HEALTH PADI") {
      return { name: brand.name, accent: "blue", accentText: "Health" };
    }
    if (brand.shortName === "HERMEX") {
      return { name: "Hermex Travels", accent: "blue", accentText: "Hermex", icon: "airplane" };
    }
    return { name: brand.name };
  }),
];
