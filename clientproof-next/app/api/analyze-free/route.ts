import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSupabase } from "@/lib/supabase";
import { generateFreeAnalysis } from "@/lib/analysis";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const { conversation } = await req.json();

  if (!conversation || conversation.trim().length < 20) {
    return NextResponse.json(
      {
        error:
          "Veuillez fournir une conversation d'au moins 20 caractères.",
      },
      { status: 400 }
    );
  }

  const id = uuidv4();

  try {
    console.log("[analyze-free] Starting OpenAI call...");
    const analysis = await generateFreeAnalysis(conversation);
    console.log("[analyze-free] OpenAI OK, saving to Supabase...");

    // Save to Supabase
    const { error: insertError } = await supabase.from("analyses").insert({
      id,
      conversation,
      free_analysis: analysis,
      full_analysis: null,
      paid: false,
    });

    if (insertError) {
      console.error("[analyze-free] Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Erreur base de données: " + insertError.message },
        { status: 500 }
      );
    }

    console.log("[analyze-free] Success, id:", id);
    return NextResponse.json({
      id,
      score: analysis.score,
      riskLevel: analysis.riskLevel,
      summary: analysis.summary,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[analyze-free] Error:", message);
    return NextResponse.json(
      { error: "Erreur: " + message },
      { status: 500 }
    );
  }
}
