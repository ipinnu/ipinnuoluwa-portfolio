"use client";

import { useState } from "react";
import PasswordGate from "@/components/my-world/asset-manager/PasswordGate";
import JobTracker from "./JobTracker";

export default function PrivateJobTracker() {
  const [open, setOpen] = useState(false);
  if (open) return <JobTracker />;
  return (
    <main className="min-h-screen bg-bg-primary pt-24">
      <PasswordGate onSuccess={() => setOpen(true)} onClose={() => history.back()} />
    </main>
  );
}
