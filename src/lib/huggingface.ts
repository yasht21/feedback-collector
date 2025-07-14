import fetch from "node-fetch";

export async function summarizeWithHF(text: string): Promise<string> {
  const apiUrl = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`HuggingFace API error: ${errText}`);
  }

  const result = await response.json();

  if (Array.isArray(result) && result[0]?.summary_text) {
    return result[0].summary_text;
  }

  throw new Error("Unexpected response from HuggingFace API");
}

export async function getSentiment(text: string): Promise<"positive" | "neutral" | "negative"> {
  const apiUrl = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";
  const hfToken = process.env.HUGGINGFACE_API_KEY;

  if (!hfToken) throw new Error("HuggingFace API token not set");

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${hfToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error(`HuggingFace API error: ${response.status}`);
  }

  const result = await response.json();

  if (!result || !Array.isArray(result) || !result[0]) {
    throw new Error("Invalid HuggingFace response");
  }

  const label = result[0].label; // "POSITIVE" or "NEGATIVE"
  const score = result[0].score;

  // Optional: treat low confidence (<0.6) as neutral
  if (score < 0.6) return "neutral";

  if (label.toLowerCase() === "positive") return "positive";
  if (label.toLowerCase() === "negative") return "negative";

  return "neutral";
}



