import type { Metadata } from "next";
import ModuleOneLab from "@/components/react-hub/ModuleOneLab";

export const metadata: Metadata = {
  title: "Module 1: Computers, Programs, and the Web · React Hub",
  description:
    "Explore browsers, servers, web languages, program inputs and outputs, and project files in a guided web laboratory.",
};

export default function ModuleOnePage() {
  return <ModuleOneLab />;
}
