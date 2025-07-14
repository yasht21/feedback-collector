// src/app/api/forms/[slug]/submit/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { content } = await req.json();

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const form = await prisma.feedbackForm.findUnique({
    where: { slug },
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const feedback = await prisma.feedback.create({
    data: {
      formId: form.id,
      message: content,
    },
  });

  const isToxic = await checkToxicity(content);


  await prisma.feedback.update({
    where: { id: feedback.id },
    data: { isToxic },
  });

  return NextResponse.json({ success: true, feedbackId: feedback.id }, { status: 200 });
}

export async function checkToxicity(text: string): Promise<boolean> {
  const apiKey = process.env.HUGGINGFACE_API_KEY!;
  if (!apiKey) throw new Error("HUGGINGFACE_API_KEY is not set");

  const url = `https://api-inference.huggingface.co/models/unitary/toxic-bert`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!res.ok) {
    console.error("HuggingFace API error:", res.status, await res.text());
    throw new Error("Failed to call HuggingFace API");
  }

  const data = await res.json();

  // data is an array of label/score objects
  // e.g. [ { label: 'toxic', score: 0.95 }, { label: 'neutral', score: 0.05 } ]
  const toxicEntry = data[0].find(
    (entry: { label: string; score: number }) =>
      entry.label === "toxic"
  );

  const score = toxicEntry?.score ?? 0;
  console.log("Toxicity score:", score, toxicEntry, data);

  // adjust this threshold if you like
  const THRESHOLD = 0.7;

  return score >= THRESHOLD;
}

