"use client";

import { useState } from "react";
import Sidebar, {
  MobileSidebar,
  MobileSidebarToggle,
} from "@/components/react-hub/Sidebar";
import { GlossaryProvider } from "@/components/react-hub/GlossaryContext";
import GlossaryPanel from "@/components/react-hub/GlossaryPanel";
import {
  LearnerAuthProvider,
  RequireLearner,
} from "@/components/react-hub/LearnerAuth";

export default function ReactHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <LearnerAuthProvider>
    <GlossaryProvider>
      <div className="min-h-screen pt-16">
        {/* Mobile toggle */}
        <MobileSidebarToggle
          isOpen={mobileOpen}
          onToggle={() => setMobileOpen((v) => !v)}
        />

        {/* Mobile sidebar */}
        <MobileSidebar
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <div className="flex" style={{ minHeight: "calc(100vh - 4rem)" }}>
          {/* Desktop sidebar */}
          <div className="hidden md:flex w-64 flex-shrink-0 flex-col sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
            <Sidebar />
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0 border-l border-border">
            <RequireLearner>{children}</RequireLearner>
          </main>
        </div>
      </div>

      {/* Glossary panel — rendered outside layout flow so it overlays freely */}
      <GlossaryPanel />
    </GlossaryProvider>
    </LearnerAuthProvider>
  );
}
