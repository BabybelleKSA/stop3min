"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import type { CardType } from "@/lib/constants";
import { CARD_TYPES } from "@/lib/constants";
import { cardTypeLabels } from "@/lib/utils";

export default function ReportSubmissionPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const payload = {
      storeName: (formData.get("storeName") as string) || "",
      addressLine1: (formData.get("addressLine1") as string) || "",
      addressLine2: (formData.get("addressLine2") as string) || undefined,
      city: (formData.get("city") as string) || "",
      state: ((formData.get("state") as string) || "").toUpperCase(),
      zip: (formData.get("zip") as string) || "",
      cardType: (formData.get("cardType") as CardType) || "UNKNOWN",
      minAmount: Number(formData.get("minAmount") || 0),
      signText: (formData.get("signText") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      visitedAt: (formData.get("visitedAt") as string) || undefined,
      photoUrl: (formData.get("photoUrl") as string) || undefined,
      reporterEmail: (formData.get("reporterEmail") as string) || undefined,
      reporterHandle: (formData.get("reporterHandle") as string) || undefined,
      consentToContact: formData.get("consentToContact") === "on",
      consentConfirmed: formData.get("consentConfirmed") === "on"
    };

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit report");
      }

      setSuccess(true);
      e.currentTarget.reset();
    } catch (err: any) {
      setError(err.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-primary">Submit a report</p>
          <h1 className="text-3xl font-bold text-gray-900">Report a card minimum</h1>
          <p className="text-sm text-gray-600">
            Share details about a store requiring a minimum charge to use a card. Your report helps us track and act on
            violations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Store name" name="storeName" required />
            <Field label="Minimum amount ($)" name="minAmount" type="number" min="0" step="0.01" required />
            <Field label="Address line 1" name="addressLine1" required className="md:col-span-2" />
            <Field label="Address line 2" name="addressLine2" className="md:col-span-2" />
            <Field label="City" name="city" required />
            <Field label="State (2-letter)" name="state" maxLength={2} required className="uppercase" />
            <Field label="ZIP" name="zip" required />
            <div>
              <label className="text-xs font-semibold text-gray-700">Card type</label>
              <select name="cardType" defaultValue="UNKNOWN" className="input mt-1" required>
                {CARD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {cardTypeLabels[type]}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Visited date" name="visitedAt" type="date" />
            <Field label="Sign text (optional)" name="signText" className="md:col-span-2" />
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-700">Description</label>
              <textarea
                name="description"
                className="input mt-1"
                rows={3}
                placeholder="Describe what you saw, conversations, signage, etc."
              />
            </div>
            <Field label="Photo URL (optional)" name="photoUrl" type="url" className="md:col-span-2" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Your email (optional)" name="reporterEmail" type="email" />
            <Field label="Your handle (optional)" name="reporterHandle" />
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 text-sm text-gray-800">
              <input type="checkbox" name="consentToContact" className="mt-1 h-4 w-4 rounded border-gray-300" />
              <span>Okay to contact me if more info is needed.</span>
            </label>
            <label className="flex items-start gap-3 text-sm font-semibold text-gray-900">
              <input
                type="checkbox"
                name="consentConfirmed"
                className="mt-1 h-4 w-4 rounded border-gray-300"
                required
              />
              <span>I confirm the information is accurate to the best of my knowledge.</span>
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">Thanks! Your report has been submitted.</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px] disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit report"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  className = "",
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold text-gray-700" htmlFor={name}>
        {label}
      </label>
      <input id={name} name={name} type={type} className="input mt-1" {...rest} />
    </div>
  );
}
