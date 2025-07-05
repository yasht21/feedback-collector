import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; 
import { prisma } from "@/lib/db";

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
  }

  const deletedForm = await prisma.feedbackForm.deleteMany({
    where: {
      id,
      userId,
    },
  });

  if (deletedForm.count === 0) {
    return NextResponse.json({ success: false, error: "Form not found or not owned by user" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
