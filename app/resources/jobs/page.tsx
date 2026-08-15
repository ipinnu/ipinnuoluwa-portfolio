import type { Metadata } from "next";
import PrivateJobTracker from "@/components/jobs/PrivateJobTracker";

export const metadata: Metadata = {
  title: "Opportunity Desk",
  description: "Private job and application tracker.",
  robots: { index: false, follow: false },
};

export default function JobsPage() {
  return <PrivateJobTracker />;
}
