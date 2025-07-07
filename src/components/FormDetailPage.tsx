'use client';
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { toast } from "react-toastify";

type Feedback = {
  id: string;
  formId: string;
  message: string;
  createdAt: Date;
};

type Form = {
  id: string;
  userId: string;
  title: string;
  slug: string;
  feedbacks: Feedback[];
  // Add other fields as needed
};

interface FormDetailsPageProps {
  form: Form;
}

export default function FormDetailsPage({ form }: FormDetailsPageProps) {
  const [title, setTitle] = useState(form.title);
  const router = useRouter();
  const handleTitleSave = async () => {

    try {
      const res = await fetch("/api/form/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: form.id, title }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update form title");
      }

      toast.success("Form title updated successfully");
      // optionally show a toast or success message here
    } catch (err) {
      console.error("Error updating title:", err);
      toast.error("Could not update form title");
      // optionally show an error toast
    }
};


  // Delete the entire form
  const handleDeleteForm = async () => {
    // Confirm and delete form
    const confirmed = confirm("Are you sure you want to delete this form?");
    if (!confirmed) return;

    try {
      const res = await fetch("/api/form/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: form.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete form");
      }
      console.log("Form deleted successfully");
      toast.success("Form deleted successfully");
      router.push(`/dashboard`);
      // Optionally redirect the user or refresh list
    } catch (err) {
      console.error("Error deleting form:", err);
      toast.error("Could not delete form");
      // optionally show an error toast
    }
  };
  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      {/* Back and Delete Form */}
      <div className="flex justify-between items-center">
        <Link href="/dashboard" className="text-sm text-blue-600 underline">
          ← Back to Forms
        </Link>
        <button
          onClick={handleDeleteForm}
          className="text-red-600 hover:text-red-800 flex items-center gap-1"
        >
          <Trash className="w-4 h-4" /> Delete Form
        </button>
      </div>

      {/* Editable Form Title */}
      <div>
        <label className="block text-sm font-medium">Form Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleSave} // Save on blur (or add a Save button)
          className="border rounded p-2 w-full mt-1"
        />
        <div className="text-sm text-gray-500 mt-1">Slug: {form.slug}</div>
        <a
          href={`/f/${form.slug}`}
          target="_blank"
          className="text-blue-600 text-sm underline"
        >
          View Public Link →
        </a>
      </div>
       <div className="space-y-3">
      <h2 className="text-xl font-semibold">
        Submitted Feedbacks ({form.feedbacks.length})
      </h2>
      <ul className="space-y-2">
        {form.feedbacks.map((fb) => (
          <li key={fb.id} className="border p-3 rounded shadow">
            <p>{fb.message}</p>
            <p className="text-xs text-gray-500">
              Submitted on {new Date(fb.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>


    
    </div>
  );
}
