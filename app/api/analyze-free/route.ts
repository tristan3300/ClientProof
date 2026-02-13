import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
import { generateFreeAnalysis } from "@/lib/analysis";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
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
    const analysis = await generateFreeAnalysis(conversation);

    // Save to Supabase
    const { error: insertError } = await supabase.from("analyses").insert({
      id,
      conversation,
      free_analysis: analysis,
      full_analysis: null,
      paid: false,
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      throw new Error("Database error");
    }

    return NextResponse.json({
      id,
      score: analysis.score,
      riskLevel: analysis.riskLevel,
      summary: analysis.summary,
    });
  } catch (err) {
    console.error("Free analysis error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
