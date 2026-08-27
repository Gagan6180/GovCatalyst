const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

/**
 * Single call: takes a raw problem description and returns both
 * the outcome-based statement AND suggested tech tags in one shot.
 * Reduces API calls per challenge creation from 2 -> 1 (important for free-tier rate limits).
 */
async function processChallengeInput(rawInput, { sector, budget_ceiling } = {}) {
  const prompt = `You are helping a government department convert a vague operational 
problem into a clear, outcome-based problem statement suitable for an innovation 
procurement challenge aimed at startups.

Raw input from department: "${rawInput}"
Sector: ${sector || 'Not specified'}
Budget ceiling: ${budget_ceiling ? `₹${budget_ceiling}` : 'Not specified'}

Do two things:

1. Rewrite the raw input as a concise, outcome-based problem statement (3-5 sentences) that:
   - States the current operational problem clearly
   - Defines the measurable outcome/impact expected (not a specific technology)
   - Avoids prescribing a specific solution — stays open to innovative approaches
   - Is written in professional, plain language suitable for a public tender document

2. Suggest 3-6 relevant technology tags for this challenge (single words or short phrases, 
   e.g. "IoT", "AI/ML", "Blockchain", "Mobile App", "Data Analytics", "Computer Vision")

Respond with ONLY valid JSON in exactly this format, no markdown formatting, no code fences, no preamble:
{
  "outcome_statement": "...",
  "tech_tags": ["tag1", "tag2", "tag3"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const rawText = response.text?.trim() || '';

    // strip accidental markdown code fences just in case the model adds them
    const cleaned = rawText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      outcome_statement: parsed.outcome_statement || rawInput,
      tech_tags: Array.isArray(parsed.tech_tags) ? parsed.tech_tags : [],
    };
  } catch (err) {
    console.error('Gemini AI processing error or parse failure:', err.message || err);
    // graceful fallback so challenge creation never hard-fails because of AI issues
    return {
      outcome_statement: rawInput,
      tech_tags: [],
    };
  }
}

/**
 * Scores a startup's proposal against a challenge statement using Gemini AI.
 * Returns score (0-100), breakdown, strengths, risks, and recommendation.
 */
async function scoreProposalWithAI({ challenge, startup, proposal_summary }) {
  const prompt = `You are a strict and fair government innovation procurement evaluator.
Evaluate how well the startup's proposal and profile solve the government challenge.

GOVERNMENT CHALLENGE:
Title: ${challenge.title}
Outcome Statement: ${challenge.outcome_statement || challenge.raw_problem_input}
Sector: ${challenge.sector || 'General'}
Required Tech Tags: ${(challenge.tech_tags || []).join(', ')}
Budget Ceiling: ${challenge.budget_ceiling ? `₹${challenge.budget_ceiling}` : 'Not specified'}

STARTUP PROFILE:
Company Name: ${startup.company_name}
Sector: ${startup.sector || 'General'}
Stage: ${startup.stage || 'Early'}
Startup Tech Tags: ${(startup.tech_tags || []).join(', ')}
Pitch Summary: ${startup.pitch_summary || 'Not provided'}
DPIIT Status: ${startup.verification_status || 'unverified'}

PROPOSAL SUBMITTED BY STARTUP:
"${proposal_summary}"

Scoring Guidelines (0 to 100):
- 85-100: Exceptional fit, directly addresses measurable outcomes with proven/viable technical approach.
- 75-84: Strong fit, meets key technical criteria with clear viability for a pilot.
- 60-74: Moderate fit, partially addresses challenge but lacks specificity, measurable KPIs, or technical depth.
- 0-59: Poor fit, irrelevant tech stack, or generic copy-paste proposal.

Respond ONLY with valid JSON in this exact structure without markdown or backticks:
{
  "score": 82,
  "strengths": ["Clear AI computer vision architecture", "Direct alignment with 40% reduction KPI"],
  "risks": ["Deployment timeline needs verification on field"],
  "feedback_summary": "Strong proposal with high domain fit and measurable outcomes.",
  "recommendation": "SHORTLIST"
}`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const rawText = response.text?.trim() || '';
    const cleaned = rawText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const score = typeof parsed.score === 'number' ? Math.min(Math.max(Math.round(parsed.score), 0), 100) : 70;

    return {
      score,
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      risks: Array.isArray(parsed.risks) ? parsed.risks : [],
      feedback_summary: parsed.feedback_summary || 'Evaluation completed.',
      recommendation: score >= 75 ? 'SHORTLIST' : 'REJECT'
    };
  } catch (err) {
    console.error('Gemini proposal scoring error:', err.message || err);
    // Fallback heuristic scoring if AI call fails
    let fallbackScore = 65;
    if (startup.verification_status === 'verified_dpiit') fallbackScore += 10;
    return {
      score: fallbackScore,
      strengths: ['DPIIT Verified Startup'],
      risks: ['AI auto-evaluation unavailable; scored via baseline heuristic'],
      feedback_summary: 'Preliminary baseline score applied.',
      recommendation: fallbackScore >= 75 ? 'SHORTLIST' : 'REJECT'
    };
  }
}

module.exports = { processChallengeInput, scoreProposalWithAI };