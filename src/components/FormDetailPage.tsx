'use client';
import Link from "next/link";
import { useState } from "react";
import { Trash } from "lucide-react";

type Form = {
  title: string;
  slug: string;
  // Add other fields as needed
};

interface FormDetailsPageProps {
  form: Form;
}

export default function FormDetailsPage({ form }: FormDetailsPageProps) {
  const [title, setTitle] = useState(form.title);
  const handleTitleSave = () => {
    // Call API to save updated title
  };

  // Delete the entire form
  const handleDeleteForm = () => {
    // Confirm and delete form
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

    
    </div>
  );
}
