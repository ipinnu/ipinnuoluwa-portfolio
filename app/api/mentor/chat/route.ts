import { NextRequest, NextResponse } from "next/server";
import {
  getConfiguredProviderName,
  runChatCompletion,
  type ChatMessage,
} from "@/lib/ai/chat-provider";
import {
  buildUnifiedSystemPrompt,
  fetchLifeContext,
  type LifeContextPayload,
} from "@/lib/ai/context";
import type { Asset, Vision, FloorState } from "@/lib/types/forge";

export async function GET() {
  const provider = getConfiguredProviderName();
  return NextResponse.json({
    configured: Boolean(provider),
    provider,
  });
}

interface MentorRequest {
  message: string;
  history?: ChatMessage[];
  forge: {
    assets: Asset[];
    visions: Vision[];
    floor: FloorState;
    selectedAssetId: string | null;
  };
  includeLifeContext?: boolean;
  currentRoute?: string;
  focus?: "forge" | "chronicle" | "archive" | "brainbox" | "general";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as MentorRequest;
    const { message, history = [], forge, includeLifeContext = true } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (!forge?.assets || !forge?.visions || !forge?.floor) {
      return NextResponse.json(
        { error: "Forge context is required." },
        { status: 400 }
      );
    }

    // Fetch life context server-side (lightweight signals only)
    let lifeContext: LifeContextPayload | null = null;
    if (includeLifeContext) {
      lifeContext = await fetchLifeContext();
    }

    // Build unified system prompt
    const system = buildUnifiedSystemPrompt({
      forge,
      chronicle: lifeContext?.chronicle,
      archive: lifeContext?.archive,
      brainbox: lifeContext?.brainbox,
      currentRoute: body.currentRoute ?? "forge",
      focus: body.focus ?? "forge",
    });

    const messages: ChatMessage[] = [
      ...history.slice(-12),
      { role: "user", content: message.trim() },
    ];

    const { content, provider } = await runChatCompletion({
      system,
      messages,
      maxTokens: 1400,
    });

    return NextResponse.json({ reply: content, provider });
  } catch (err) {
    console.error("Mentor chat error:", err);
    const msg =
      err instanceof Error ? err.message : "Failed to get mentor response.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
