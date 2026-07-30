import type { Asset, Vision, FloorState } from "@/lib/types/forge";

// ── Domain Types ────────────────────────────────────────────────────────────

export interface ChronicleSignal {
  recentMilestones: string[]; // Last 3-5 significant events
  activeThemes: string[]; // Recurring topics/patterns
  currentPhase: string; // "building", "shipping", "reflecting", etc.
}

export interface ArchiveSignal {
  recentNoteTitles: string[]; // Last 5-10 note titles
  topCategories: string[]; // Most active research areas
  emergingPatterns: string[]; // AI-suggested connections not yet confirmed
}

export interface BrainboxSignal {
  activeNodes: string[]; // 3-5 current thought/project/wonder titles
  orbitingThemes: string[]; // Tags recurring across nodes
}

// ── Unified Context ─────────────────────────────────────────────────────────

export interface UnifiedContext {
  // PRIMARY: Forge (full detail for project management)
  forge: {
    assets: Asset[];
    visions: Vision[];
    floor: FloorState;
    selectedAssetId: string | null;
  };

  // SECONDARY: Life context (lightweight signals for philosophy/patterns)
  chronicle?: ChronicleSignal;
  archive?: ArchiveSignal;
  brainbox?: BrainboxSignal;

  // Route awareness
  currentRoute: string;
  focus: "forge" | "chronicle" | "archive" | "brainbox" | "general";
}

// ── Context Builders ─────────────────────────────────────────────────────────

export function buildForgeContext(
  assets: Asset[],
  visions: Vision[],
  floor: FloorState,
  selectedAssetId: string | null
): UnifiedContext["forge"] {
  return {
    assets,
    visions,
    floor,
    selectedAssetId,
  };
}

// Lightweight signal extractors — these run server-side to minimize tokens

export function buildChronicleSignal(
  articles: Array<{ title: string; publishedAt: string; tags?: string[] }>,
  vaultPosts: Array<{ content: string; platform: string; postedAt?: string }> = []
): ChronicleSignal {
  // Get last 3-5 milestones from articles + vault
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const recentMilestones = sorted.slice(0, 5).map((a) => a.title);

  // Extract themes from tags
  const tagCounts: Record<string, number> = {};
  sorted.slice(0, 10).forEach((a) => {
    a.tags?.forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  const activeThemes = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  // Infer phase from recent activity patterns
  const hasRecentShip = vaultPosts.some(
    (p) => p.postedAt && new Date(p.postedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  );

  const currentPhase = hasRecentShip ? "shipping" : activeThemes.some((t) => t.includes("build")) ? "building" : "operating";

  return {
    recentMilestones,
    activeThemes,
    currentPhase,
  };
}

export function buildArchiveSignal(
  notes: Array<{ title: string; categoryId: string | null; tags: string[]; createdAt: string }>,
  categories: Array<{ id: string; name: string }> = []
): ArchiveSignal {
  // Last 5-10 note titles
  const sorted = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const recentNoteTitles = sorted.slice(0, 8).map((n) => n.title);

  // Top categories by activity
  const categoryCounts: Record<string, number> = {};
  notes.forEach((n) => {
    if (n.categoryId) {
      categoryCounts[n.categoryId] = (categoryCounts[n.categoryId] || 0) + 1;
    }
  });

  const topCategoryIds = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => id);

  const topCategories = topCategoryIds
    .map((id) => categories.find((c) => c.id === id)?.name)
    .filter(Boolean) as string[];

  // Emerging patterns from tags
  const tagCounts: Record<string, number> = {};
  notes.forEach((n) => {
    n.tags.forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  const emergingPatterns = Object.entries(tagCounts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  return {
    recentNoteTitles,
    topCategories,
    emergingPatterns,
  };
}

export function buildBrainboxSignal(
  nodes: Array<{
    title: string;
    type: string;
    tags: string[];
    orbit_ring: number;
    created_at: string;
  }>
): BrainboxSignal {
  // Active nodes (inner orbits = more active)
  const sorted = [...nodes].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const activeNodes = sorted
    .filter((n) => n.orbit_ring <= 2)
    .slice(0, 5)
    .map((n) => `${n.title} (${n.type})`);

  // Orbiting themes from tags
  const tagCounts: Record<string, number> = {};
  nodes.forEach((n) => {
    n.tags.forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  const orbitingThemes = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  return {
    activeNodes,
    orbitingThemes,
  };
}

// ── Token Estimation ─────────────────────────────────────────────────────────

export function estimateContextTokens(ctx: UnifiedContext): number {
  // Rough estimation: 1 token ≈ 4 characters for English text
  const forgeJson = JSON.stringify(ctx.forge);
  const chronicleJson = ctx.chronicle ? JSON.stringify(ctx.chronicle) : "";
  const archiveJson = ctx.archive ? JSON.stringify(ctx.archive) : "";
  const brainboxJson = ctx.brainbox ? JSON.stringify(ctx.brainbox) : "";

  const totalChars = forgeJson.length + chronicleJson.length + archiveJson.length + brainboxJson.length;
  return Math.ceil(totalChars / 4);
}

// ── System Prompt Builder ───────────────────────────────────────────────────

export function buildUnifiedSystemPrompt(ctx: UnifiedContext): string {
  const forge = ctx.forge;

  // Build Forge section (full detail)
  const assetList = forge.assets.map((a) => {
    const actions = a.actions.map((x, i) => `    [${i}] ${x.done ? "✓" : "○"} ${x.text}`).join("\n");
    return `- ${a.id}: ${a.name} (${a.assetClass}) | ${a.status} | alloc ${a.allocation}% | mandate ${a.mandateProgress}%
    visions: [${a.visionIds.join(", ")}]
    actions:
${actions || "    (none)"}`;
  }).join("\n");

  const visionList = forge.visions.map((v) =>
    `- ${v.id}: ${v.title} | weight ${v.gameWeight}% | ${v.status} | ${v.timeHorizon}`
  ).join("\n");

  // Build Life Context section (lightweight signals)
  let lifeContext = "";

  if (ctx.chronicle) {
    lifeContext += `\nRECENT MILESTONES:\n${ctx.chronicle.recentMilestones.map((m) => `- ${m}`).join("\n")}`;
    lifeContext += `\n\nACTIVE THEMES: ${ctx.chronicle.activeThemes.join(", ")}`;
    lifeContext += `\nCURRENT PHASE: ${ctx.chronicle.currentPhase}`;
  }

  if (ctx.archive) {
    lifeContext += `\n\nRECENT RESEARCH: ${ctx.archive.recentNoteTitles.slice(0, 5).join("; ")}`;
    lifeContext += `\nRESEARCH FOCUS: ${ctx.archive.topCategories.slice(0, 3).join(", ")}`;
  }

  if (ctx.brainbox) {
    lifeContext += `\n\nORBITING THOUGHTS: ${ctx.brainbox.activeNodes.join("; ")}`;
    lifeContext += `\nRECURRING PATTERNS: ${ctx.brainbox.orbitingThemes.join(", ")}`;
  }

  return `You are the Forge AI — Ipinnuoluwa's portfolio command assistant. You help manage assets, mandates, and allocation while understanding the broader life context that shapes priorities.

ARCHITECTURE
- The Floor (peace + sovereignty) holds everything. If shaking, portfolio is locked.
- Visions pull upward — directional force.
- Assets connect floor to vision. Class A = core/active, B = forming, C = monitor only.

FLOOR
- peace: ${forge.floor.peace}
- sovereignty: ${forge.floor.sovereignty}

VISIONS
${visionList}

ASSETS (${forge.assets.length})
${assetList}

SELECTED: ${forge.selectedAssetId || "none"}
${lifeContext ? `\nLIFE CONTEXT\n${lifeContext}` : ""}

VOICE
- Direct, systems-thinking, no fluff.
- Reference specific assets and visions by name.
- When suggesting changes, be explicit about tradeoffs.
- Use life context to inform recommendations, not as primary focus.

When you need to change forge data, append this block at the very end:
\`\`\`forge-actions
[{"type":"ACTION_TYPE", ...fields}]
\`\`\`

Available actions: update_asset, create_asset, select_asset, toggle_action, add_action, update_floor, update_vision
`.trim();
}

// ── Server-side Life Context Fetcher ─────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

export interface LifeContextPayload {
  chronicle?: ChronicleSignal;
  archive?: ArchiveSignal;
  brainbox?: BrainboxSignal;
}

export async function fetchLifeContext(): Promise<LifeContextPayload | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch last 5 chronicle articles
    const { data: articles } = await supabase
      .from("chronicle_articles")
      .select("title, published_at, tags")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(5);

    // Fetch last 5 archive notes
    const { data: notes } = await supabase
      .from("archive_notes")
      .select("title, category_id, tags, created_at")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(5);

    // Fetch categories for names
    const { data: categories } = await supabase
      .from("archive_categories")
      .select("id, name");

    // Fetch active brainbox nodes (inner orbits)
    const { data: nodes } = await supabase
      .from("brainbox_nodes")
      .select("title, type, tags, orbit_ring")
      .lte("orbit_ring", 2)
      .order("created_at", { ascending: false })
      .limit(5);

    // Build lightweight signals
    const chronicle = articles
      ? {
          recentMilestones: articles.map((a) => a.title),
          activeThemes: extractThemes(articles),
          currentPhase: inferPhase(articles),
        }
      : undefined;

    const archive =
      notes && categories
        ? {
            recentNoteTitles: notes.map((n) => n.title),
            topCategories: notes
              .map((n) => categories.find((c) => c.id === n.category_id)?.name)
              .filter((name): name is string => Boolean(name)),
            emergingPatterns: extractPatterns(notes),
          }
        : undefined;

    const brainbox = nodes
      ? {
          activeNodes: nodes.map((n) => `${n.title} (${n.type})`),
          orbitingThemes: extractNodeThemes(nodes),
        }
      : undefined;

    return { chronicle, archive, brainbox };
  } catch (err) {
    console.error("Failed to fetch life context:", err);
    return null;
  }
}

// Helper functions for signal extraction
function extractThemes(
  articles: Array<{ tags?: string[] }>
): string[] {
  const counts: Record<string, number> = {};
  articles.forEach((a) => {
    a.tags?.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);
}

function inferPhase(
  articles: Array<{ published_at: string }>
): string {
  const recent = articles.filter(
    (a) => new Date(a.published_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
  );
  if (recent.length >= 2) return "shipping";
  if (recent.length === 1) return "building";
  return "operating";
}

function extractPatterns(
  notes: Array<{ tags: string[] }>
): string[] {
  const counts: Record<string, number> = {};
  notes.forEach((n) => {
    n.tags.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);
}

function extractNodeThemes(
  nodes: Array<{ tags: string[] }>
): string[] {
  const counts: Record<string, number> = {};
  nodes.forEach((n) => {
    n.tags.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);
}
