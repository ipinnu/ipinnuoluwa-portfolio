"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";
import { GlossaryEntry, GLOSSARY_MAP } from "@/lib/react-hub/glossary";

interface GlossaryContextValue {
  activeTerm: GlossaryEntry | null;
  openTerm: (termKey: string) => void;
  closeTerm: () => void;
}

const GlossaryContext = createContext<GlossaryContextValue>({
  activeTerm: null,
  openTerm: () => {},
  closeTerm: () => {},
});

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [activeTerm, setActiveTerm] = useState<GlossaryEntry | null>(null);

  const openTerm = useCallback((termKey: string) => {
    const entry = GLOSSARY_MAP.get(termKey.toLowerCase());
    if (entry) setActiveTerm(entry);
  }, []);

  const closeTerm = useCallback(() => setActiveTerm(null), []);

  return (
    <GlossaryContext.Provider value={{ activeTerm, openTerm, closeTerm }}>
      {children}
    </GlossaryContext.Provider>
  );
}

export function useGlossary() {
  return useContext(GlossaryContext);
}
