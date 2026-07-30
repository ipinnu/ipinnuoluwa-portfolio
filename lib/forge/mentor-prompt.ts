import type { Asset, FloorState, Vision } from "@/lib/types/forge";

export interface ForgeContextPayload {
  assets: Asset[];
  visions: Vision[];
  floor: FloorState;
  selectedAssetId: string | null;
}

const ACTION_SCHEMA = `
When you need to change forge data, append this block at the very end of your response:

\`\`\`forge-actions
[{"type":"ACTION_TYPE", ...fields}]
\`\`\`

Available actions:
- update_asset — { "type": "update_asset", "assetId": string, "patch": { name?, assetClass?, allocation?, status?, mandateText?, mandateProgress?, thesis?, exitCondition?, visionIds?, scores?, actions? } }
- create_asset — { "type": "create_asset", "name": string, "assetClass"?: "A"|"B"|"C", "mandateText"?: string, "visionIds"?: string[] }
- select_asset — { "type": "select_asset", "assetId": string }
- toggle_action — { "type": "toggle_action", "assetId": string, "actionIndex": number, "done": boolean }
- add_action — { "type": "add_action", "assetId": string, "text": string }
- update_floor — { "type": "update_floor", "peace"?: "stable"|"pressured"|"shaking", "sovereignty"?: "stable"|"pressured"|"shaking" }
- update_vision — { "type": "update_vision", "visionId": string, "patch": { title?, description?, gameWeight?, status?, timeHorizon? } }

Rules:
- Only mutate data when Ipinnu explicitly asks or clearly agrees.
- Confirm changes in plain language in the visible reply.
- assetId and visionId must match IDs from the snapshot below.
- mandateProgress is 0–100. allocation is 0–100 portfolio weight.
`.trim();

function summarizeAsset(a: Asset): string {
  const actions = a.actions
    .map((x, i) => `  [${i}] ${x.done ? "✓" : "○"} ${x.text}`)
    .join("\n");
  return `- ${a.id} | ${a.name} | Class ${a.assetClass} | ${a.status} | alloc ${a.allocation}% | mandate ${a.mandateProgress}%
  mandate: ${a.mandateText || "(empty)"}
  visions: [${a.visionIds.join(", ")}]
  actions:
${actions || "  (none)"}`;
}

export function buildForgeSystemPrompt(ctx: ForgeContextPayload): string {
  const assetList = ctx.assets.map(summarizeAsset).join("\n");
  const visionList = ctx.visions
    .map(
      (v) =>
        `- ${v.id} | ${v.title} | weight ${v.gameWeight}% | ${v.status} | ${v.timeHorizon}\n  ${v.description}`
    )
    .join("\n");

  const selected = ctx.selectedAssetId
    ? ctx.assets.find((a) => a.id === ctx.selectedAssetId)
    : null;

  return `
You are the Forge AI — Ipinnuoluwa's private portfolio command assistant inside The Forge (Mercury / Asset Manager).

You help think through assets, visions, mandates, floor stability, and capital allocation. You have read access to the full ledger snapshot and can update it via forge-actions when asked.

ARCHITECTURE
- The Floor (peace + sovereignty) holds everything. If shaking, portfolio is locked.
- Visions pull upward — directional force.
- Assets connect floor to vision. Class A = core/active, B = forming, C = monitor only.

FLOOR
- peace: ${ctx.floor.peace}
- sovereignty: ${ctx.floor.sovereignty}
- last updated: ${ctx.floor.lastUpdated}

VISIONS
${visionList}

ASSETS (${ctx.assets.length})
${assetList}

SELECTED ASSET: ${selected ? `${selected.id} — ${selected.name}` : "none"}

VOICE
- Direct, systems-thinking, no fluff.
- Reference specific assets and visions by name.
- When suggesting changes, be explicit about tradeoffs.

${ACTION_SCHEMA}
`.trim();
}
