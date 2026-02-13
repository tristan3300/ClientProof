export interface FreeAnalysis {
  riskLevel: "Faible" | "Moyen" | "Élevé";
  score: number;
  summary: string;
}

export interface RedFlag {
  flag: string;
  severity: "critique" | "modéré" | "mineur";
  explanation: string;
}

export interface GreenFlag {
  flag: string;
  explanation: string;
}

export interface Clause {
  title: string;
  content: string;
}

export interface Pricing {
  advice: string;
  riskPremium: string;
}

export interface FullAnalysis {
  score: number;
  riskLevel: "Faible" | "Moyen" | "Élevé";
  verdict: string;
  redFlags: RedFlag[];
  greenFlags: GreenFlag[];
  recommendations: string[];
  clauses: Clause[];
  pricing: Pricing;
  message: string;
}

export interface AnalysisRecord {
  id: string;
  conversation: string;
  free_analysis: FreeAnalysis | null;
  full_analysis: FullAnalysis | null;
  paid: boolean;
  stripe_session_id: string | null;
  created_at: string;
}
