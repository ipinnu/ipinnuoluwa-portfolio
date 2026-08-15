export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatOptions {
  system: string;
  messages: ChatMessage[];
  maxTokens?: number;
}

function getProvider():
  | { name: "groq"; key: string }
  | { name: "gemini"; key: string }
  | { name: "anthropic"; key: string }
  | null {
  if (process.env.GROQ_API_KEY) {
    return { name: "groq", key: process.env.GROQ_API_KEY };
  }
  if (process.env.GEMINI_API_KEY) {
    return { name: "gemini", key: process.env.GEMINI_API_KEY };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return { name: "anthropic", key: process.env.ANTHROPIC_API_KEY };
  }
  return null;
}

export function getConfiguredProviderName(): string | null {
  return getProvider()?.name ?? null;
}

async function groqChat({ system, messages, maxTokens = 1024 }: ChatOptions) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: system }, ...messages],
      max_tokens: maxTokens,
      temperature: 0.6,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq error: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

async function geminiChat({ system, messages, maxTokens = 1024 }: ChatOptions) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.6,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error: ${err}`);
  }

  const data = await res.json();
  return (
    data.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

async function anthropicChat({
  system,
  messages,
  maxTokens = 1024,
}: ChatOptions) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: maxTokens,
      system,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic error: ${err}`);
  }

  const data = await res.json();
  const block = data.content?.find(
    (c: { type: string }) => c.type === "text"
  );
  return block?.text?.trim() ?? "";
}

export async function runChatCompletion(options: ChatOptions): Promise<{
  content: string;
  provider: string;
}> {
  const provider = getProvider();
  if (!provider) {
    throw new Error(
      "No AI API key configured. Add GROQ_API_KEY, GEMINI_API_KEY, or ANTHROPIC_API_KEY to .env.local"
    );
  }

  let content = "";
  switch (provider.name) {
    case "groq":
      content = await groqChat(options);
      break;
    case "gemini":
      content = await geminiChat(options);
      break;
    case "anthropic":
      content = await anthropicChat(options);
      break;
  }

  return { content, provider: provider.name };
}
