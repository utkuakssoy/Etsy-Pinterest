import OpenAI from "openai";
import { z } from "zod";
import { env } from "@/lib/env";
import { readAiCredentials } from "@/services/local-store";
import type { EtsyListingView, SeoGenerationResult } from "@/types";

const seoResultSchema = z.object({
  pinterestTitles: z.array(z.string()).default([]),
  pinterestDescriptions: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  etsyTitleSuggestion: z.string().default(""),
  etsyDescriptionSuggestion: z.string().default(""),
  boardSuggestions: z.array(z.string()).default([]),
  pinConcepts: z.array(
    z.object({
      template: z.string().default(""),
      headline: z.string().default(""),
      visualDirection: z.string().default(""),
      targetKeyword: z.string().default("")
    })
  ).default([])
});

export async function generateSeoForListing(listing: EtsyListingView): Promise<SeoGenerationResult> {
  const credentials = getAiCredentials();

  if (credentials.geminiApiKey) {
    return generateSeoWithGemini(listing, credentials.geminiApiKey);
  }

  if (credentials.openaiApiKey) {
    return generateSeoWithOpenAi(listing, credentials.openaiApiKey);
  }

  throw new Error("Add a Gemini or OpenAI API key in Settings before generating content.");
}

export function getAiCredentials() {
  const storedCredentials = readAiCredentials();

  return {
    geminiApiKey: storedCredentials?.geminiApiKey || env.geminiApiKey,
    openaiApiKey: storedCredentials?.openaiApiKey || env.openaiApiKey
  };
}

export function getAiStatus() {
  const credentials = getAiCredentials();

  return {
    geminiConfigured: Boolean(credentials.geminiApiKey),
    openaiConfigured: Boolean(credentials.openaiApiKey)
  };
}

async function generateSeoWithOpenAi(listing: EtsyListingView, apiKey: string): Promise<SeoGenerationResult> {
  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You generate Pinterest SEO for Etsy sellers. Output valid JSON only. Do not include markdown."
      },
      {
        role: "user",
        content: buildSeoPrompt(listing)
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message.content;
  if (!content) {
    throw new Error("OpenAI returned an empty response");
  }

  return parseSeoResult(content);
}

async function generateSeoWithGemini(listing: EtsyListingView, apiKey: string): Promise<SeoGenerationResult> {
  const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You generate Pinterest SEO for Etsy sellers. Output valid JSON only. Do not include markdown.\n\n${buildSeoPrompt(listing)}`
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      })
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Gemini SEO generation failed: ${message}`);
  }

  const payload = await response.json();
  const content = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error("Gemini returned an empty response");
  }

  return parseSeoResult(content);
}

function buildSeoPrompt(listing: EtsyListingView) {
  return `
Analyze the Etsy product title, description, tags, category, and images if available.
Generate natural Pinterest SEO copy.
Avoid keyword stuffing.
Use buyer-intent keywords.
Make titles clickable but not spammy.
Generate seasonal and gift-focused angles when relevant.
Do not make false claims.
Preserve the product's real features.
Output valid JSON only.

Return this strict JSON shape:
{
  "pinterestTitles": [],
  "pinterestDescriptions": [],
  "keywords": [],
  "etsyTitleSuggestion": "",
  "etsyDescriptionSuggestion": "",
  "boardSuggestions": [],
  "pinConcepts": [
    {
      "template": "",
      "headline": "",
      "visualDirection": "",
      "targetKeyword": ""
    }
  ]
}

Listing:
${JSON.stringify(listing, null, 2)}
`;
}

function parseSeoResult(content: string): SeoGenerationResult {
  try {
    return seoResultSchema.parse(JSON.parse(content));
  } catch {
    throw new Error("AI returned invalid JSON. Try again or switch API provider.");
  }
}
