import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateFullAnalysis } from "@/lib/analysis";

export const maxDuration = 60;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  if (!data.paid) {
    return NextResponse.json({ error: "not_paid" }, { status: 403 });
  }

  // If paid but no full analysis yet, generate it now
  if (!data.full_analysis) {
    try {
      const fullAnalysis = await generateFullAnalysis(data.conversation);
      await supabase
        .from("analyses")
        .update({ full_analysis: fullAnalysis })
        .eq("id", id);
      data.full_analysis = fullAnalysis;
    } catch (err) {
      console.error(
        "Report generation error:",
        err instanceof Error ? err.message : err
      );
      return NextResponse.json(
        { error: "processing", message: "Génération en cours..." },
        { status: 202 }
      );
    }
  }

  return NextResponse.json({
    id: data.id,
    freeAnalysis: data.free_analysis,
    fullAnalysis: data.full_analysis,
    createdAt: data.created_at,
  });
}
