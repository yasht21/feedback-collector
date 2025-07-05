import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; 
import { prisma } from "@/lib/db";

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id, title } = await req.json();

  if (!id || !title) {
    return NextResponse.json({ success: false, error: "id and title are required" }, { status: 400 });
  }

  const updatedForm = await prisma.feedbackForm.updateMany({
    where: {
      id,
      userId, // make sure user owns it
    },
    data: {
      title,
    },
  });

  if (updatedForm.count === 0) {
    return NextResponse.json({ success: false, error: "Form not found or not owned by user" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
