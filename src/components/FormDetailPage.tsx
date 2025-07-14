'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Share, ArrowLeft, RotateCcw, ShieldAlert } from "lucide-react";
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
  const [editingTitle, setEditingTitle] = useState(false);
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
    } finally {
      setEditingTitle(false);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <Link
          href="/dashboard"
          className="text-gray-400 hover:text-white"
          title="Back to Forms"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-4">
          <a
            href={`/f/${form.slug}`}
            target="_blank"
            title="View Public Link"
            className="text-gray-400 hover:text-white"
          >
            <Share className="w-5 h-5" />
          </a>

          <button
            onClick={handleDeleteForm}
            title="Delete Form"
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        {editingTitle ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            autoFocus
            className="bg-transparent border-b border-gray-600 text-xl font-semibold focus:outline-none"
          />
        ) : (
          <h1
            onClick={() => setEditingTitle(true)}
            className="text-xl font-semibold cursor-pointer hover:underline"
          >
            {title}
          </h1>
        )}
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
                  <p className="text-gray-500 flex items-center gap-1">
                    {new Date(fb.createdAt).toLocaleString()}
                    {fb.isToxic && (
                      <ShieldAlert
                        className="w-4 h-4 text-red-600"
                      />
                    )}
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
