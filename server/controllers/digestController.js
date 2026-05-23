// server/controllers/digestController.js

import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config(); // load environment variables from .env

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Mode definitions
const MODE_CONFIG = [
  {
    key: "summary",
    instruction: "Write a concise, neutral summary of this news article in 3–5 sentences.",
    format: "Plain prose. No bullet points.",
  },
  {
    key: "keyFacts",
    instruction: "Extract the most important facts from this news article.",
    format: "Return as a numbered list. Each item one sentence. Maximum 8 items.",
  },
  {
    key: "eli5",
    instruction: "Explain this news article as if the reader is 10 years old with no background knowledge.",
    format: "Use simple words, short sentences, and friendly analogies.",
  },
  {
    key: "biasCheck",
    instruction:
      "Analyze this news article for potential bias, framing choices, and missing perspectives.",
    format:
      "Structure your response with three sections: 1) Detected Framing, 2) Loaded Language, 3) Missing Perspectives.",
  },
];

// Build prompt using reduce()
function buildPrompt(article, mode) {
  const modeData = MODE_CONFIG.find((m) => m.key === mode);
  if (!modeData) throw new Error(`Unknown mode: ${mode}`);

  return Object.entries(modeData).reduce(
    (acc, [key, value]) =>
      key === "key" ? acc : acc + `\n[${key.toUpperCase()}]: ${value}`,
    `You are an expert news analyst. Analyze the following article.\n[ARTICLE]:\n${article}\n\nRespond only with your analysis.`
  );
}

// Sanitize article text
function sanitizeArticle(text) {
  return text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .filter((line) => /[\x20-\x7E\u00A0-\uFFFF]/.test(line))
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

// Main function
export async function generateDigest(req, res) {
  try {
    const { article, mode } = req.body;

    // Input validation
    if (!article || typeof article !== "string" || article.trim().length === 0) {
      return res.status(400).json({ error: "Article text is required." });
    }

    const VALID_MODES = MODE_CONFIG.map((m) => m.key);
    if (!mode || !VALID_MODES.includes(mode)) {
      return res.status(400).json({ error: `Mode must be one of: ${VALID_MODES.join(", ")}` });
    }

    if (article.length > 4000) {
      return res.status(400).json({ error: "Article exceeds 4000 character limit. Please shorten it." });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is not configured. Add it to server/.env" });
    }

    // Sanitize and build prompt
    const cleanArticle = sanitizeArticle(article);
    const prompt = buildPrompt(cleanArticle, mode);

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant", // fixed syntax
      temperature: 0.5,
      max_tokens: 1024,
    });

    const result = chatCompletion.choices[0]?.message?.content;

    if (!result) {
      return res.status(500).json({ error: "No response returned from Groq." });
    }

    return res.json({
      result,
      mode,
      model: chatCompletion.model,
      usage: chatCompletion.usage,
    });
  } catch (err) {
    console.error("[Groq Error]", err?.message || err);

    if (err?.status === 401) {
      return res.status(401).json({ error: "Invalid Groq API key. Check GROQ_API_KEY in server/.env" });
    }
    if (err?.status === 429) {
      return res.status(429).json({ error: "Groq rate limit reached. Please wait a moment and try again." });
    }

    return res.status(500).json({ error: "Failed to generate digest.", detail: err?.message });
  }
}