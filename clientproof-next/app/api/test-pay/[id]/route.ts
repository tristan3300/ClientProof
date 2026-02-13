import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { generateFullAnalysis } from "@/lib/analysis";

export const maxDuration = 60;

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Disabled in production
  if (
    process.env.VERCEL ||
    process.env.NODE_ENV === "production"
  ) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = getSupabase();
  const { id } = await params;

  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Analyse introuvable." },
      { status: 404 }
    );
  }

  try {
    const fullAnalysis = await generateFullAnalysis(data.conversation);

    await supabase
      .from("analyses")
      .update({ paid: true, full_analysis: fullAnalysis })
      .eq("id", id);

    console.log(
      `[TEST] Analysis ${id} marked as paid and full report generated.`
    );

    return NextResponse.json({
      success: true,
      reportUrl: `/rapport?id=${id}`,
    });
  } catch (err) {
    console.error("Full analysis generation failed:", err);
    return NextResponse.json(
      { error: "Erreur lors de la génération du rapport." },
      { status: 500 }
    );
  }
}
