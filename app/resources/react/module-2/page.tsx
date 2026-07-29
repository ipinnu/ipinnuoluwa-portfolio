import type { Metadata } from "next";
import FoundationModuleLab from "@/components/react-hub/FoundationModuleLab";
import { HTML_MODULE } from "@/lib/react-hub/foundation-modules";

export const metadata: Metadata = {
  title: "Module 2: HTML · React Hub",
  description: "Build the meaningful, accessible HTML structure of the expense tracker.",
};

export default function HtmlModulePage() {
  return <FoundationModuleLab config={HTML_MODULE} />;
}
