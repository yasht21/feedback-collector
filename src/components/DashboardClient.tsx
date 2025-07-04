'use client';
import Link from "next/link";
import { Settings } from "lucide-react";
import { useState } from "react";
import CreateFormModal from "./CreateFormModal";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DashboardClient({ forms }: { forms: any[] }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="max-w-3xl mx-auto p-4">
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        + Create New Form
      </button>

      <CreateFormModal open={showModal} onClose={() => setShowModal(false)} />

      <h1 className="text-xl font-bold mb-4">Your Forms</h1>

        {forms.length === 0 && (
            <div className="p-2 bg-gray-200 text-gray-800 rounded-l shadow-md">
            You have no forms yet. Create one to get started!
            </div>
        )}

    <ul className="space-y-3">
      {forms.map((form) => (
        <li key={form.id} className="border p-3 rounded">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold">{form.title}</div>
              <div className="text-sm text-gray-500">Slug: {form.slug}</div>
              <a
                href={`/f/${form.slug}`}
                target="_blank"
                className="text-blue-600 text-sm underline"
              >
                View Public Link →
              </a>
            </div>

            {/* Manage icon on right */}
            <Link
              href={`/dashboard/forms/${form.id}`}
              className="text-blue-600 hover:text-blue-800"
              title="Manage Form"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </li>
      ))}
    </ul>

    </main>
  );
}
