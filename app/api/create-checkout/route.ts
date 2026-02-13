import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import { generateFullAnalysis } from "@/lib/analysis";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const { analysisId, testSecret } = await req.json();

  if (!analysisId) {
    return NextResponse.json(
      { error: "ID d'analyse manquant." },
      { status: 400 }
    );
  }

  // Test mode: bypass Stripe, mark as paid, generate report
  if (testSecret && testSecret === process.env.TEST_PAY_SECRET) {
    try {
      const supabase = getSupabase();
      const { data } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", analysisId)
        .single();

      if (!data) {
        return NextResponse.json({ error: "Analyse introuvable." }, { status: 404 });
      }

      if (!data.full_analysis && data.conversation) {
        const fullAnalysis = await generateFullAnalysis(data.conversation);
        await supabase
          .from("analyses")
          .update({ paid: true, full_analysis: fullAnalysis })
          .eq("id", analysisId);
      } else {
        await supabase
          .from("analyses")
          .update({ paid: true })
          .eq("id", analysisId);
      }

      const origin = req.headers.get("origin") || req.nextUrl.origin;
      return NextResponse.json({ url: `${origin}/rapport?id=${analysisId}` });
    } catch (err) {
      console.error("Test bypass error:", err instanceof Error ? err.message : err);
      return NextResponse.json({ error: "Erreur test bypass." }, { status: 500 });
    }
  }

  try {
    const origin = req.headers.get("origin") || req.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: analysisId,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: 2400, // 24 euros en centimes
            product_data: {
              name: "ClientProof - Analyse complete",
              description:
                "Rapport detaille : red flags, recommandations, clauses, message type",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/rapport?id=${analysisId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/app`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(
      "Checkout session error:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(
      { error: "Erreur lors de la creation du paiement." },
      { status: 500 }
    );
  }
}
