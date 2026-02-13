import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import { generateFullAnalysis } from "@/lib/analysis";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const stripe = getStripe();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const analysisId = session.client_reference_id;

    if (analysisId) {
      const { data } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", analysisId)
        .single();

      if (data) {
        // Mark as paid
        await supabase
          .from("analyses")
          .update({ paid: true, stripe_session_id: session.id })
          .eq("id", analysisId);

        // Generate full analysis
        try {
          const fullAnalysis = await generateFullAnalysis(data.conversation);
          await supabase
            .from("analyses")
            .update({ full_analysis: fullAnalysis })
            .eq("id", analysisId);
        } catch (err) {
          console.error(
            "Full analysis generation failed:",
            err instanceof Error ? err.message : err
          );
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
