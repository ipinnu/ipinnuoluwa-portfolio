import { NextRequest, NextResponse } from "next/server";
import { runChatCompletion } from "@/lib/ai/chat-provider";

export async function POST(req: NextRequest) {
  try {
    const { type, job, cvVersion, cvText, contactPerson, contactContext } = await req.json();
    if (!job?.title || !job?.company || !job?.description) {
      return NextResponse.json({ error: "Title, company and description are required." }, { status: 400 });
    }
    if (type === "cover_letter" && !cvText?.trim()) {
      return NextResponse.json({ error: "Add the CV text for this application first." }, { status: 400 });
    }
    const cover = type === "cover_letter";
    const system = cover
      ? "Write a concise tailored cover letter using only evidence in the CV. Never invent achievements. Return only the finished letter."
      : "Write a specific, human recruiter outreach note under 120 words. Never invent experience. Return only the finished note.";
    const prompt = [
      `Role: ${job.title}`,
      `Company: ${job.company}`,
      `Job description:\n${job.description}`,
      cover
        ? `CV version: ${cvVersion || "Unlabelled"}\nCV:\n${cvText}`
        : `Contact: ${contactPerson || "Unknown"}\nContext: ${contactContext || "None"}`,
    ].join("\n\n");
    const result = await runChatCompletion({
      system,
      messages: [{ role: "user", content: prompt }],
      maxTokens: cover ? 850 : 300,
    });
    return NextResponse.json({ text: result.content, provider: result.provider });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Draft generation failed." },
      { status: 500 },
    );
  }
}
