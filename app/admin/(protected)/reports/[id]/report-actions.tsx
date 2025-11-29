"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ReportStatus } from "@prisma/client";

type Props = {
  id: number;
  status: ReportStatus;
  followUpNotes: string;
  networksReportedTo: string;
};

export function ReportActions({ id, status, followUpNotes, networksReportedTo }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      status: formData.get("status"),
      followUpNotes: formData.get("followUpNotes"),
      networksReportedTo: formData.get("networksReportedTo")
    };

    try {
      setLoading(true);
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Update failed");
      }

      setLoading(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Update failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-3">
      <div>
        <label className="text-xs font-semibold text-gray-700">Status</label>
        <select name="status" defaultValue={status} className="input">
          {Object.values(ReportStatus).map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ").toLowerCase()}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="text-xs font-semibold text-gray-700">Networks reported to</label>
        <input
          name="networksReportedTo"
          defaultValue={networksReportedTo}
          className="input"
          placeholder="Visa, Mastercard..."
        />
      </div>
      <div className="md:col-span-3">
        <label className="text-xs font-semibold text-gray-700">Follow up notes</label>
        <textarea
          name="followUpNotes"
          defaultValue={followUpNotes}
          className="input"
          rows={3}
          placeholder="Document outreach, AG complaints, media follow-up..."
        />
      </div>
      {error && <p className="text-sm text-red-600 md:col-span-3">{error}</p>}
      <div className="md:col-span-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px] disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
