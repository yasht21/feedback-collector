import { auth } from "@clerk/nextjs/server"; // ✅
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const { userId } = await auth(); 
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { title } = await req.json();
  if (!title) return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });

  const slug = `form_${nanoid(6)}`;

  const form = await prisma.feedbackForm.create({
    data: { title, slug, userId },
  });

  return NextResponse.json({ success: true, form });
}
