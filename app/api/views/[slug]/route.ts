import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

interface Params {
  params: { slug: string };
}

// GET: Fetch view count for a post
export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = params;

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("post_views")
    .select("views")
    .eq("slug", slug)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: "Failed to fetch views." }, { status: 500 });
  }

  return NextResponse.json({ views: data?.views ?? 0 });
}

// POST: Increment view count for a post
export async function POST(_req: NextRequest, { params }: Params) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  // Upsert: increment if exists, insert with 1 if not
  const { data: existing } = await supabase
    .from("post_views")
    .select("views")
    .eq("slug", slug)
    .single();

  const currentViews = existing?.views ?? 0;
  const newViews = currentViews + 1;

  const { error } = await supabase
    .from("post_views")
    .upsert(
      { slug, views: newViews, updated_at: new Date().toISOString() },
      { onConflict: "slug" }
    );

  if (error) {
    console.error("View count error:", error);
    return NextResponse.json({ error: "Failed to update views." }, { status: 500 });
  }

  return NextResponse.json({ views: newViews });
}
