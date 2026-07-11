// Supabase Edge Function: generate-reply
// Ported from ml/prediction/ml_model.py + ml/prediction/reply_engine.py
// Deploy: supabase functions deploy generate-reply
// Model data (review_model.json) is bundled alongside this file — see model.json

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import modelData from "./model.json" with { type: "json" };

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ---------- Naive Bayes text model (ported from ml_model.py) ----------

const TOKEN_RE = /[a-zA-Z][a-zA-Z']+/g;

const TOKEN_NORMALIZATIONS: Record<string, string> = {
  canvaas: "canvas",
  cannvas: "canvas",
  canvass: "canvas",
  demolished: "damaged",
  destroyed: "damaged",
  broke: "broken",
};

function tokenize(text: string): string[] {
  const raw = text.match(TOKEN_RE) ?? [];
  const words = raw.map((t) => {
    const lower = t.toLowerCase().replace(/^'+|'+$/g, "");
    return TOKEN_NORMALIZATIONS[lower] ?? lower;
  });
  const bigrams = words.slice(0, -1).map((w, i) => `${w}_${words[i + 1]}`);
  const trigrams = words.slice(0, -2).map((w, i) => `${w}_${words[i + 1]}_${words[i + 2]}`);
  return [...words, ...bigrams, ...trigrams];
}

type LabelModel = {
  labels: string[];
  label_doc_counts: Record<string, number>;
  label_token_counts: Record<string, number>;
  token_counts: Record<string, Record<string, number>>;
  vocabulary: string[];
};

function predict(model: LabelModel, text: string): [string, number] {
  const vocabulary = new Set(model.vocabulary);
  const totalDocs = Object.values(model.label_doc_counts).reduce((a, b) => a + b, 0);
  const vocabSize = Math.max(vocabulary.size, 1);
  const tokens = tokenize(text);

  const scores: Record<string, number> = {};
  for (const label of model.labels) {
    const prior = (model.label_doc_counts[label] + 1) / (totalDocs + model.labels.length);
    let score = Math.log(prior);
    const denominator = model.label_token_counts[label] + vocabSize;
    const labelTokens = model.token_counts[label] ?? {};

    for (const token of tokens) {
      if (!vocabulary.has(token)) continue;
      score += Math.log(((labelTokens[token] ?? 0) + 1) / denominator);
    }
    scores[label] = score;
  }

  let predicted = model.labels[0];
  let best = -Infinity;
  for (const [label, score] of Object.entries(scores)) {
    if (score > best) {
      best = score;
      predicted = label;
    }
  }

  const maxScore = Math.max(...Object.values(scores));
  const expScores = Object.fromEntries(
    Object.entries(scores).map(([l, s]) => [l, Math.exp(s - maxScore)]),
  );
  const total = Object.values(expScores).reduce((a, b) => a + b, 0);
  const confidence = total ? expScores[predicted] / total : 0;

  return [predicted, Math.round(confidence * 10000) / 10000];
}

function predictReviewLabels(review: string): [string, number, string, number] {
  const [sentimentModel, topicModel] = [
    modelData.label_models.sentiment as LabelModel,
    modelData.label_models.topic as LabelModel,
  ];
  let [sentiment, sentimentConfidence] = predict(sentimentModel, review);
  const [topic, topicConfidence] = predict(topicModel, review);

  const hasNeg = hasStrongNegativeKeyword(review);
  const hasPos = hasStrongPositiveKeyword(review);
  if (hasNeg && !hasPos) {
    sentiment = "negative";
    sentimentConfidence = Math.max(sentimentConfidence, 0.95);
  } else if (hasPos && !hasNeg) {
    sentiment = "positive";
    sentimentConfidence = Math.max(sentimentConfidence, 0.95);
  }

  return [sentiment, sentimentConfidence, topic, topicConfidence];
}

// ---------- Reply engine (ported from reply_engine.py) ----------

const TOPIC_LABELS: Record<string, string> = {
  mural_design: "mural design",
  canvas_art: "canvas artwork",
  art_quality: "art quality",
  delivery: "delivery experience",
  communication: "studio communication",
  pricing: "pricing clarity",
  general: "overall experience",
};

const SMILEY_EMOJIS = ["😊", "😁", "😄", "🤗", "😃", "🥰", "😍", "🤩", "😌", "🙂", "😋", "🤠", "😎", "🥳", "😇", "☺️", "😉"];

const STRONG_NEGATIVE_KEYWORDS = [
  "awful", "terrible", "worst", "very bad", "not good", "bad", "poor", "disappointing",
  "damaged", "demolished", "destroyed", "broken", "expected madhiri illa", "size sari illa",
  "reference madhiri illa", "finish sari illa", "quality sari illa", "satisfied illa",
];

const STRONG_POSITIVE_KEYWORDS = [
  "super", "extraordinary", "amazing", "semma", "vera level", "nalla iruku",
  "excellent", "beautiful", "perfect", "worth ah",
];

const CONTRAST_KEYWORDS = ["but", "however", "except", "though", "ana", "aana"];

const TOPIC_KEYWORDS: Record<string, string[]> = {
  mural_design: ["mural", "wall painting", "home painting", "living room wall", "bedroom mural", "design", "expected madhiri illa"],
  canvas_art: ["canvas", "portrait", "framed painting", "gift painting", "custom canvas", "cannvas", "canvaas", "canvass", "size sari illa", "reference madhiri illa", "damaged", "demolished", "destroyed", "broken"],
  art_quality: ["quality", "color", "colors", "detailing", "finish", "texture", "brush", "finish sari illa", "quality sari illa", "nalla quality"],
  delivery: ["delivery", "courier", "shipping", "handover", "package", "late", "delayed", "late aachu", "time ku"],
  communication: ["response", "message", "call", "communication", "update", "reply", "responsive", "slow", "update varala", "reply late", "fast reply", "nalla response"],
  pricing: ["price", "cost", "rate", "budget", "pricing", "costly", "expensive", "high", "over budget", "worth", "value", "adhigam", "worth ah", "budget friendly"],
};

function normalizeReviewText(review: string): string {
  let normalized = review.toLowerCase();
  for (const [source, target] of Object.entries(TOKEN_NORMALIZATIONS)) {
    normalized = normalized.replace(new RegExp(`\\b${source}\\b`, "g"), target);
  }
  return normalized;
}

function containsKeyword(text: string, keyword: string): boolean {
  if (keyword.includes(" ")) return text.includes(keyword);
  return new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(text);
}

function hasStrongNegativeKeyword(review: string): boolean {
  const n = normalizeReviewText(review);
  return STRONG_NEGATIVE_KEYWORDS.some((k) => containsKeyword(n, k));
}

function hasStrongPositiveKeyword(review: string): boolean {
  const n = normalizeReviewText(review);
  return STRONG_POSITIVE_KEYWORDS.some((k) => containsKeyword(n, k));
}

function detectReviewTopics(review: string, primaryTopic: string): string[] {
  const topics = [primaryTopic];
  const normalized = normalizeReviewText(review);
  const secondaryScores: [number, string][] = [];

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (topic === primaryTopic) continue;
    const score = keywords.filter((k) => containsKeyword(normalized, k)).length;
    if (score) secondaryScores.push([score, topic]);
  }
  secondaryScores.sort((a, b) => b[0] - a[0]);
  if (secondaryScores.length) topics.push(secondaryScores[0][1]);

  if (topics.length > 1) {
    const idx = topics.indexOf("general");
    if (idx !== -1) topics.splice(idx, 1);
  }
  return topics;
}

function generateReplyLine(review: string, topicLabel: string): string {
  const r = review.toLowerCase();
  const has = (words: string[]) => words.some((w) => r.includes(w));

  const isDelivery = has(["delivery", "shipping", "package", "courier", "handover"]);
  const isLate = has(["late", "delayed", "time"]);
  const isDamage = has(["damage", "broken", "crack", "destroyed"]);
  const isDesign = has(["design", "mural", "pattern", "motif"]);
  const isQuality = has(["quality", "finish", "texture", "brush"]);
  const isColor = has(["color", "shade", "paint"]);
  const isComms = has(["communication", "response", "update", "message", "call"]);
  const isPrice = has(["price", "cost", "budget", "expensive", "rate"]);
  const isCanvas = has(["canvas", "portrait", "frame"]);
  const isPositive = has(["amazing", "wonderful", "super", "semma", "excellent", "outstanding", "fantastic", "beautiful", "lovely", "great", "nice", "good", "perfect", "nalla", "worth", "awesome"]);
  const hasContrast = has(["but", "however", "although", "though", "ana", "aana", "except"]);
  const hasNegative = isDamage || has(["satisfied illa", "sari illa", "disappointing", "poor", "bad", "worst", "terrible", "awful", "late", "delayed", "slow"]);
  const isMixed = hasContrast && hasNegative && isPositive;

  if (isMixed) return `Thank you for your honest feedback. We're sorry about the issue and will work on improving the ${topicLabel}.`;
  if (isDelivery && isDamage) return "We appreciate your feedback about the delivery condition. Your input helps us strengthen our packaging for future shipments.";
  if (isCanvas && isDamage) return "Thank you for letting us know about the canvas. Every detail matters, and your feedback helps us protect our artwork better during transit.";
  if (isDamage) return "Thank you for bringing this to our attention. We sincerely apologize and will address the quality concern immediately.";
  if (isDelivery && isLate) return "Thank you for sharing your thoughts about our delivery. Your feedback on the timing helps us improve our logistics and serve you better.";
  if (isDelivery) return "Thanks for your feedback on the delivery experience. We're always working to make sure your artwork arrives safely and on time.";
  if (isCanvas && isQuality) return "We value your thoughts on the canvas quality. Your feedback directly helps our artists refine their craft.";
  if (isCanvas) return "Thanks for sharing your experience with our canvas artwork. Your feedback helps us improve every custom piece we create.";
  if (isDesign && isColor) return "Your feedback on the design and colors is valuable. We're always refining our creative process to match your vision perfectly.";
  if (isDesign) return "Thank you for your thoughts on the design. Every mural is crafted with care, and your insights help us grow.";
  if (isQuality && isColor) return "We appreciate your feedback on the artwork quality and colors. Our team is dedicated to delivering exceptional results.";
  if (isQuality) return "Your feedback on the work quality is important to us. We're committed to giving every detail the attention it deserves.";
  if (isComms) return "Thanks for your honest feedback on communication. We're always looking for ways to keep our clients more informed.";
  if (isPrice) return "We appreciate your perspective on pricing. Your feedback helps us ensure our work remains accessible and valuable.";
  if (isPositive) return "We are so happy to hear you loved the work! Your kind words mean everything to our entire team.";
  return `Thank you for your thoughtful feedback about our ${topicLabel}. We truly value your perspective and use it to improve.`;
}

function buildPositiveReply(customerName: string | null, topics: string[], review: string): string {
  const name = customerName ? titleCase(customerName) : "valued customer";
  const topic = topics[0] ?? "general";
  const topicLabel = TOPIC_LABELS[topic];
  const replyLine = generateReplyLine(review, topicLabel);
  return `Dear ${name},\n\n${replyLine}\n\nWith gratitude,\nThe ashmija in color Team`;
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}

function getRandomSmiley(): string {
  return SMILEY_EMOJIS[Math.floor(Math.random() * SMILEY_EMOJIS.length)];
}

function generateArtistReply(review: string, customerName: string | null) {
  const [sentiment, sentimentConfidence, primaryTopic, topicConfidence] = predictReviewLabels(review);
  const topics = detectReviewTopics(review, primaryTopic);
  const reply = buildPositiveReply(customerName, topics, review);

  return {
    reply,
    sentiment,
    sentiment_confidence: sentimentConfidence,
    topics,
    topic_confidence: topicConfidence,
    topic_labels: topics.map((t) => TOPIC_LABELS[t]),
    emoji: getRandomSmiley(),
    card_title: "A warm note from our studio",
  };
}

// ---------- HTTP handler ----------

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const review = String(body.review ?? "").trim();
    const customerName = body.customer_name ?? null;

    if (review.length < 2) {
      return new Response(JSON.stringify({ error: "Review cannot be empty" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const result = generateArtistReply(review, customerName);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
