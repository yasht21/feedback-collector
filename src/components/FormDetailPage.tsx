'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { RotateCcw } from "lucide-react";
import { toast } from "react-toastify";

type Feedback = {
  id: string;
  formId: string;
  sentiment: "positive" | "negative" | "neutral";
  userId: string;
  message: string;
  createdAt: Date;
  isToxic: boolean;
};

type Form = {
  id: string;
  userId: string;
  summary?: string;
  title: string;
  slug: string;
  feedbacks: Feedback[];
};

interface FormDetailsPageProps {
  form: Form;
}

export default function FormDetailsPage({ form }: FormDetailsPageProps) {
  const [title, setTitle] = useState(form.title);
  const [loadingSummary, setLoadingSummary] = useState(false);

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
      if (!res.ok) throw new Error(data.error || "Failed to update form title");

      toast.success("Form title updated successfully");
    } catch (err) {
      console.error("Error updating title:", err);
      toast.error("Could not update form title");
    }
  };

  const handleDeleteForm = async () => {
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
      if (!res.ok) throw new Error(data.error || "Failed to delete form");

      toast.success("Form deleted successfully");
      router.push(`/dashboard`);
    } catch (err) {
      console.error("Error deleting form:", err);
      toast.error("Could not delete form");
    }
  };

  const handleSummarize = async () => {
    setLoadingSummary(true);
    const res = await fetch(`/api/feedbackForm/${form.id}/summarize`, {
      method: "POST",
    });
    if (res.ok) {
      router.refresh();
    }
    setLoadingSummary(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 bg-[#1e1e1e] min-h-screen text-gray-100">
      {/* Back and Delete */}
      <div className="flex justify-between items-center">
        <Link href="/dashboard" className="text-sm text-blue-400 underline">
          ← Back to Forms
        </Link>
        <button
          onClick={handleDeleteForm}
          className="text-red-400 hover:text-red-500 flex items-center gap-1"
        >
          <Trash className="w-4 h-4" /> Delete Form
        </button>
      </div>

      {/* Title & Slug */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">Form Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleSave}
          className="border border-gray-600 bg-[#2c2c2c] text-gray-100 rounded p-2 w-full mt-1"
        />
        <div className="text-sm text-gray-400 mt-1">Slug: {form.slug}</div>
        <a
          href={`/f/${form.slug}`}
          target="_blank"
          className="text-blue-400 text-sm underline"
        >
          View Public Link →
        </a>
      </div>

      {/* Main content: summary & feedbacks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary */}
        <div className="md:col-span-1 space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Summary</h2>
            <button
              onClick={handleSummarize}
              disabled={loadingSummary}
              title="Refresh Summary"
              className="text-gray-300 hover:text-blue-400 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-[#2c2c2c] border border-gray-700 rounded shadow-sm p-4 text-gray-300">
            {form.summary ? (
              <p>{form.summary}</p>
            ) : (
              <p className="italic text-gray-500">
                No summary yet. Click the refresh icon to generate one.
              </p>
            )}
          </div>
        </div>

        {/* Feedbacks */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white">
            Submitted Feedbacks ({form.feedbacks.length})
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {form.feedbacks.map((fb) => (
              <li
                key={fb.id}
                className="bg-[#2c2c2c] border border-gray-700 rounded shadow-sm p-4 space-y-2"
              >
                <p className="text-gray-100 mb-2">{fb.message}</p>
                <div className="flex justify-between items-center text-xs">
                  <div className="space-x-2 flex items-center">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        fb.sentiment === "positive"
                          ? "bg-green-700 text-green-100"
                          : fb.sentiment === "negative"
                          ? "bg-red-700 text-red-100"
                          : "bg-yellow-700 text-yellow-100"
                      }`}
                    >
                      {fb.sentiment}
                    </span>
                    {fb.isToxic && (
                      <span className="px-2 py-0.5 rounded bg-red-800 text-red-100">
                        🚫 Toxic
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500">
                    {new Date(fb.createdAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
