import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { generateFullAnalysis } from "@/lib/analysis";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "ID d'analyse manquant." },
      { status: 400 }
    );
  }

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
    return NextResponse.json(
      { error: "Paiement requis pour accéder à l'analyse complète." },
      { status: 403 }
    );
  }

  if (data.full_analysis) {
    return NextResponse.json({ id, report: data.full_analysis });
  }

  try {
    const fullAnalysis = await generateFullAnalysis(data.conversation);
    await supabase
      .from("analyses")
      .update({ full_analysis: fullAnalysis })
      .eq("id", id);

    return NextResponse.json({ id, report: fullAnalysis });
  } catch (err) {
    console.error("Full analysis error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la génération du rapport complet." },
      { status: 500 }
    );
  }
}
