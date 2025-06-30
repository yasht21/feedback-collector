import { prisma } from "@/lib/db";

export async function getFormsForUser(userId: string) {
  if (!userId) return [];
  const forms = await prisma.feedbackForm.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return forms;
}
