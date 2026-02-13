import { getOpenAI } from "./openai";
import type { FreeAnalysis, FullAnalysis } from "@/types";

function parseAIResponse<T>(raw: string): T {
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("Invalid AI response format");
  }
}

export async function generateFreeAnalysis(
  conversation: string
): Promise<FreeAnalysis> {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content: `Tu es un expert en relations freelance-client avec 15 ans d'expérience. Tu analyses des échanges entre freelances et prospects pour détecter les risques.

Analyse la conversation suivante et retourne UNIQUEMENT un JSON valide (sans markdown, sans backticks) avec cette structure exacte :
{
  "riskLevel": "Faible" | "Moyen" | "Élevé",
  "score": <nombre entre 0 et 100, où 100 = risque maximum>,
  "summary": "<2 phrases courtes expliquant les principaux signaux détectés>"
}`,
      },
      {
        role: "user",
        content: conversation,
      },
    ],
  });

  const raw = completion.choices[0].message.content!.trim();
  return parseAIResponse<FreeAnalysis>(raw);
}

export async function generateFullAnalysis(
  conversation: string
): Promise<FullAnalysis> {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    max_tokens: 2000,
    messages: [
      {
        role: "system",
        content: `Tu es un expert en relations freelance-client avec 15 ans d'expérience en gestion de projets, négociation commerciale et prévention de conflits.

Analyse en profondeur la conversation suivante entre un freelance et un prospect. Retourne UNIQUEMENT un JSON valide (sans markdown, sans backticks) avec cette structure exacte :
{
  "score": <nombre entre 0 et 100, où 100 = risque maximum>,
  "riskLevel": "Faible" | "Moyen" | "Élevé",
  "verdict": "<phrase résumant le verdict global>",
  "redFlags": [
    { "flag": "<nom du red flag>", "severity": "critique" | "modéré" | "mineur", "explanation": "<explication détaillée>" }
  ],
  "greenFlags": [
    { "flag": "<nom du green flag>", "explanation": "<explication>" }
  ],
  "recommendations": [
    "<recommandation actionnable 1>",
    "<recommandation actionnable 2>",
    "<recommandation actionnable 3>"
  ],
  "clauses": [
    { "title": "<titre de la clause>", "content": "<texte de la clause à ajouter au contrat>" }
  ],
  "pricing": {
    "advice": "<conseil sur le positionnement tarifaire>",
    "riskPremium": "<pourcentage de prime de risque recommandé>"
  },
  "message": "<message prêt à copier-coller à envoyer au prospect pour cadrer la relation>"
}`,
      },
      {
        role: "user",
        content: conversation,
      },
    ],
  });

  const raw = completion.choices[0].message.content!.trim();
  return parseAIResponse<FullAnalysis>(raw);
}
