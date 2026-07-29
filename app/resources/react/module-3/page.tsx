import type { Metadata } from "next";
import FoundationModuleLab from "@/components/react-hub/FoundationModuleLab";
import { CSS_MODULE } from "@/lib/react-hub/foundation-modules";

export const metadata: Metadata = {
  title: "Module 3: CSS · React Hub",
  description: "Style the expense tracker with selectors, spacing, layout, and responsive CSS.",
};

export default function CssModulePage() {
  return <FoundationModuleLab config={CSS_MODULE} />;
}
