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
