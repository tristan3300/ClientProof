import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const { analysisId } = await req.json();

  if (!analysisId) {
    return NextResponse.json(
      { error: "ID d'analyse manquant." },
      { status: 400 }
    );
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
            unit_amount: 100, // 1€ en centimes — changer à 2900 pour 29€
            product_data: {
              name: "ClientProof - Analyse complète",
              description:
                "Rapport détaillé : red flags, recommandations, clauses, message type",
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
      { error: "Erreur lors de la création du paiement." },
      { status: 500 }
    );
  }
}
