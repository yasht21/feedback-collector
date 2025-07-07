import { prisma } from "@/lib/db";
import FeedbackFormClient from "@/components/FeedbackFormClient";

export default async function PublicFeedbackPage({
  params,
}: {
  params: { slug: string };
}) {
  const form = await prisma.feedbackForm.findUnique({
    where: { slug: params.slug },
  });

  if (!form) {
    return <div>Form not found</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <FeedbackFormClient slug={form.slug} />
    </div>
  );
}