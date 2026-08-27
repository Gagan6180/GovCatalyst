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

module.exports = { processChallengeInput };