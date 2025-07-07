import { prisma } from "@/lib/db";
import FormDetailsPage from "@/components/FormDetailPage";

interface Props {
  params: {
    id: string;
  };
}

export default async function FormPage({ params }: Props) {
  const form = await prisma.feedbackForm.findUnique({
    where: { id: params.id },
    include: { feedbacks: true }
  });

  if (!form) {
    return <div>Form not found</div>;
  }

  return <FormDetailsPage form={form} />;
}