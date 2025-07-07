"use client";

import { useState } from "react";

export default function FeedbackFormClient({ slug }: { slug: string }) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch(`/api/form/${slug}/submit`, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error();

      setStatus("success");
      setContent("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your feedback here…"
        className="w-full p-2 border rounded"
        rows={4}
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        disabled={status === "loading"}
      >
        Submit
      </button>

      {status === "success" && (
        <p className="text-green-600">Thank you for your feedback!</p>
      )}
      {status === "error" && (
        <p className="text-red-600">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
