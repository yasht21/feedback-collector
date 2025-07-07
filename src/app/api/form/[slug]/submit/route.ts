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

  await prisma.feedback.create({
    data: {
      formId: form.id,
      message: content,
    },
  });

  return NextResponse.json({ success: true });
}
