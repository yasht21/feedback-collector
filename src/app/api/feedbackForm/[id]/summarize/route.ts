import { prisma } from "@/lib/db";
import { summarizeWithHF } from "@/lib/huggingface";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id: formId } = params;
   // Validate param
  if (!formId) {
    return NextResponse.json({ error: "Form ID is required" }, { status: 400 });
  }

  // Fetch the form with feedbacks
  const form = await prisma.feedbackForm.findUnique({
    where: { id: formId },
    select: {
      feedbacks: {
        select: { message: true },
      },
    },
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const feedbacks = form.feedbacks || [];
    if (feedbacks.length === 0) {
    return NextResponse.json(
      { error: "No feedbacks to summarize" },
      { status: 400 }
    );
  }

    // Combine feedback messages
  const combinedText = feedbacks.map(f => f.message).join("\n");

  // Generate summary
  const summary = await summarizeWithHF(combinedText);
    if (!summary) {
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }

  // Save summary back to form
  await prisma.feedbackForm.update({
    where: { id: formId },
    data: { summary },
  });

  return NextResponse.json({ summary, form: { id: formId, ...form } }, { status: 200 });
}
