import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const stripe = getStripe();
  try {
    const { sessionId, analysisId, conversation, freeAnalysis } =
      await req.json();

    if (!sessionId || !analysisId) {
      return NextResponse.json(
        { error: "Paramètres manquants." },
        { status: 400 }
      );
    }

    // Verify payment with Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (err) {
      console.error(
        "Stripe session retrieval error:",
        err instanceof Error ? err.message : err
      );
      return NextResponse.json(
        {
          error:
            "Erreur Stripe: " +
            (err instanceof Error ? err.message : "Unknown"),
        },
        { status: 500 }
      );
    }

    if (
      session.payment_status !== "paid" ||
      session.client_reference_id !== analysisId
    ) {
      return NextResponse.json(
        {
          error:
            "Paiement non vérifié. Status: " +
            session.payment_status +
            ", ref: " +
            session.client_reference_id,
        },
        { status: 403 }
      );
    }

    // Check if analysis exists in Supabase
    const { data: existing } = await supabase
      .from("analyses")
      .select("id")
      .eq("id", analysisId)
      .single();

    if (!existing && conversation) {
      // Record lost or never saved - recreate from client data
      await supabase.from("analyses").insert({
        id: analysisId,
        conversation,
        free_analysis: freeAnalysis || null,
        full_analysis: null,
        paid: true,
        stripe_session_id: sessionId,
      });
    } else {
      // Mark as paid
      await supabase
        .from("analyses")
        .update({ paid: true, stripe_session_id: sessionId })
        .eq("id", analysisId);
    }

    return NextResponse.json({ verified: true, id: analysisId });
  } catch (err) {
    console.error(
      "verify-payment error:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(
      {
        error:
          "Erreur interne: " +
          (err instanceof Error ? err.message : "Unknown"),
      },
      { status: 500 }
    );
  }
}
