import type { Metadata } from "next";
import ResourcesPage from "@/components/react-hub/ResourcesPage";

export const metadata: Metadata = {
  title: "Resources — React Hub",
  description:
    "Curated docs, channels, articles, and communities for learning React.",
};

export default function ReactResourcesPage() {
  return <ResourcesPage />;
}
