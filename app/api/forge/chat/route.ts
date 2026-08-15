import { NextRequest, NextResponse } from "next/server";
import {
  getConfiguredProviderName,
  runChatCompletion,
  type ChatMessage,
} from "@/lib/ai/chat-provider";
import { buildForgeSystemPrompt } from "@/lib/forge/mentor-prompt";
import type { ForgeContextPayload } from "@/lib/forge/mentor-prompt";

export async function GET() {
  const provider = getConfiguredProviderName();
  return NextResponse.json({
    configured: Boolean(provider),
    provider,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], context } = body as {
      message?: string;
      history?: ChatMessage[];
      context?: ForgeContextPayload;
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (!context?.assets || !context?.visions || !context?.floor) {
      return NextResponse.json(
        { error: "Forge context payload is required." },
        { status: 400 }
      );
    }

    const system = buildForgeSystemPrompt(context);
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
    console.error("Forge mentor error:", err);
    const msg =
      err instanceof Error ? err.message : "Failed to get forge mentor response.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
