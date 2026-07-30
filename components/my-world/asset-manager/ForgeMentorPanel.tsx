"use client";

import dynamic from "next/dynamic";
import type { Asset, AssetClass, FloorState, Vision } from "@/lib/types/forge";

// Dynamically import MentorShell to avoid SSR issues with localStorage
const MentorShell = dynamic(() => import("@/components/ai/MentorShell"), {
  ssr: false,
});

interface ForgeMentorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  assets: Asset[];
  visions: Vision[];
  floor: FloorState;
  selectedAssetId: string | null;
  onUpdateAsset: (id: string, patch: Partial<Asset>) => void | Promise<void>;
  onCreateAsset: (input: {
    name: string;
    assetClass?: AssetClass;
    mandateText?: string;
    visionIds?: string[];
  }) => Promise<Asset>;
  onSelectAsset: (asset: Asset) => void;
  onUpdateFloor: (floor: FloorState) => void;
  onUpdateVision: (id: string, patch: Partial<Vision>) => void | Promise<void>;
}

/**
 * ForgeMentorPanel - Thin wrapper around unified MentorShell
 * 
 * This component maintains backward compatibility with existing Forge Dashboard
 * while using the unified /api/mentor/chat endpoint and MentorShell component.
 */
export default function ForgeMentorPanel(props: ForgeMentorPanelProps) {
  return (
    <MentorShell
      {...props}
      currentRoute="forge"
      focus="forge"
    />
  );
}

// Re-export FAB for backward compatibility
export { MentorFab as ForgeMentorFab } from "@/components/ai/MentorShell";
