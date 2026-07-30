import type {
  Asset,
  AssetClass,
  FloorState,
  FloorSignal,
  Vision,
} from "@/lib/types/forge";
import { setFloorState, getFloorState } from "@/lib/floor";

export type ForgeAction =
  | { type: "update_asset"; assetId: string; patch: Partial<Asset> }
  | {
      type: "create_asset";
      name: string;
      assetClass?: AssetClass;
      mandateText?: string;
      visionIds?: string[];
    }
  | { type: "select_asset"; assetId: string }
  | {
      type: "toggle_action";
      assetId: string;
      actionIndex: number;
      done: boolean;
    }
  | { type: "add_action"; assetId: string; text: string }
  | {
      type: "update_floor";
      peace?: FloorSignal;
      sovereignty?: FloorSignal;
    }
  | { type: "update_vision"; visionId: string; patch: Partial<Vision> };

const ACTIONS_RE = /```forge-actions\s*([\s\S]*?)```/i;

export function stripForgeActionsBlock(content: string): string {
  return content.replace(ACTIONS_RE, "").trim();
}

export function parseForgeActions(content: string): ForgeAction[] {
  const match = content.match(ACTIONS_RE);
  if (!match?.[1]) return [];

  try {
    const parsed = JSON.parse(match[1].trim());
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidForgeAction);
  } catch {
    return [];
  }
}

function isValidForgeAction(value: unknown): value is ForgeAction {
  if (!value || typeof value !== "object" || !("type" in value)) return false;
  const action = value as ForgeAction;
  switch (action.type) {
    case "update_asset":
      return typeof action.assetId === "string" && !!action.patch;
    case "create_asset":
      return typeof action.name === "string";
    case "select_asset":
      return typeof action.assetId === "string";
    case "toggle_action":
      return (
        typeof action.assetId === "string" &&
        typeof action.actionIndex === "number" &&
        typeof action.done === "boolean"
      );
    case "add_action":
      return typeof action.assetId === "string" && typeof action.text === "string";
    case "update_floor":
      return true;
    case "update_vision":
      return typeof action.visionId === "string" && !!action.patch;
    default:
      return false;
  }
}

export interface ForgeActionHandlers {
  assets: Asset[];
  onUpdateAsset: (id: string, patch: Partial<Asset>) => void | Promise<void>;
  onCreateAsset: (input: {
    name: string;
    assetClass?: AssetClass;
    mandateText?: string;
    visionIds?: string[];
  }) => Asset | void | Promise<Asset | void>;
  onSelectAsset: (asset: Asset) => void;
  onUpdateFloor: (floor: FloorState) => void;
  onUpdateVision: (
    id: string,
    patch: Partial<Vision>
  ) => void | Promise<void>;
}

export async function executeForgeActions(
  actions: ForgeAction[],
  handlers: ForgeActionHandlers
): Promise<string[]> {
  const results: string[] = [];

  for (const action of actions) {
    switch (action.type) {
      case "update_asset":
        await handlers.onUpdateAsset(action.assetId, action.patch);
        results.push(`Updated asset ${action.assetId}.`);
        break;

      case "create_asset": {
        const created = await handlers.onCreateAsset({
          name: action.name,
          assetClass: action.assetClass,
          mandateText: action.mandateText,
          visionIds: action.visionIds,
        });
        results.push(
          created
            ? `Created asset "${created.name}".`
            : `Created asset "${action.name}".`
        );
        break;
      }

      case "select_asset": {
        const asset = handlers.assets.find((a) => a.id === action.assetId);
        if (asset) {
          handlers.onSelectAsset(asset);
          results.push(`Selected ${asset.name}.`);
        }
        break;
      }

      case "toggle_action": {
        const asset = handlers.assets.find((a) => a.id === action.assetId);
        if (!asset) break;
        const actionsList = [...asset.actions];
        const item = actionsList[action.actionIndex];
        if (!item) break;
        actionsList[action.actionIndex] = { ...item, done: action.done };
        await handlers.onUpdateAsset(action.assetId, { actions: actionsList });
        results.push(`Toggled action on ${asset.name}.`);
        break;
      }

      case "add_action": {
        const asset = handlers.assets.find((a) => a.id === action.assetId);
        if (!asset) break;
        await handlers.onUpdateAsset(action.assetId, {
          actions: [...asset.actions, { text: action.text, done: false }],
        });
        results.push(`Added action to ${asset.name}.`);
        break;
      }

      case "update_floor": {
        const existing = getFloorState();
        const next: FloorState = {
          peace: action.peace ?? existing.peace,
          sovereignty: action.sovereignty ?? existing.sovereignty,
          lastUpdated: new Date().toISOString(),
        };
        setFloorState(next);
        handlers.onUpdateFloor(next);
        results.push("Updated floor signals.");
        break;
      }

      case "update_vision":
        await handlers.onUpdateVision(action.visionId, action.patch);
        results.push(`Updated vision ${action.visionId}.`);
        break;
    }
  }

  return results;
}
