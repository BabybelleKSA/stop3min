"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

const today = new Date();
const todayInput = today.toISOString().split("T")[0];

export function ReportForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultCountry = useMemo(() => "US", []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setError(null);
    setLoading(true);

    const payload = {
      storeName: formData.get("storeName"),
      addressLine1: formData.get("addressLine1"),
      addressLine2: formData.get("addressLine2") || undefined,
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
      country: formData.get("country") || "US",
      cardType: formData.get("cardType"),
      minAmount: formData.get("minAmount"),
      signText: formData.get("signText"),
      description: formData.get("description"),
      visitedAt: formData.get("visitedAt"),
      photoUrl: formData.get("photoUrl") || undefined,
      reporterEmail: formData.get("reporterEmail") || undefined,
      reporterHandle: formData.get("reporterHandle") || undefined,
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
        throw new Error(data.error || "Could not submit right now.");
      }

      router.push("/thanks");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Store details</h2>
        <p className="text-sm text-gray-600">Tell us where you saw the sign.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-800">
            Store name *
            <input name="storeName" required className="input" placeholder="Example Market" />
          </label>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-800">
            Address line 1 *
            <input name="addressLine1" required className="input" placeholder="123 Main St" />
          </label>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-800">
            Address line 2
            <input name="addressLine2" className="input" placeholder="Suite, floor, etc." />
          </label>
        </div>
        <label className="text-sm font-medium text-gray-800">
          City *
          <input name="city" required className="input" placeholder="Brooklyn" />
        </label>
        <label className="text-sm font-medium text-gray-800">
          State (2-letter) *
          <input name="state" required maxLength={2} className="input uppercase" placeholder="NY" />
        </label>
        <label className="text-sm font-medium text-gray-800">
          ZIP *
          <input name="zip" required className="input" placeholder="11201" />
        </label>
          <label className="text-sm font-medium text-gray-800">
            Country
          <input name="country" defaultValue={defaultCountry} className="input" />
        </label>
      </div>

      <div className="pt-2">
        <h2 className="text-xl font-semibold text-gray-900">Violation details</h2>
        <p className="text-sm text-gray-600">What was the minimum, and what type of card?</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-800">Card type *</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { label: "Debit", value: "DEBIT" },
              { label: "Credit", value: "CREDIT" },
              { label: "Both", value: "BOTH" },
              { label: "Not sure", value: "UNKNOWN" }
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2 rounded-lg border border-gray-200 p-2">
                <input type="radio" name="cardType" value={option.value} required />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        <label className="text-sm font-medium text-gray-800">
          Minimum amount *
          <input
            name="minAmount"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={3}
            className="input"
          />
        </label>
        <label className="md:col-span-2 text-sm font-medium text-gray-800">
          What does the sign say?
          <textarea name="signText" rows={2} className="input" placeholder='e.g. "$3 minimum on debit cards"' />
        </label>
        <label className="md:col-span-2 text-sm font-medium text-gray-800">
          What happened? (optional)
          <textarea
            name="description"
            rows={3}
            className="input"
            placeholder="Share any context, how the staff responded, etc."
          />
        </label>
        <label className="text-sm font-medium text-gray-800">
          Date you visited
          <input name="visitedAt" type="date" defaultValue={todayInput} className="input" />
        </label>
      </div>

      <div className="pt-2 space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Evidence</h2>
        <p className="text-sm text-gray-600">
          Upload your photo somewhere (Google Photos, iCloud, etc.) and paste the public share link.
        </p>
        <label className="text-sm font-medium text-gray-800">
          Photo URL
          <input name="photoUrl" type="url" className="input" placeholder="https://..." />
        </label>
      </div>

      <div className="pt-2 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your info (optional)</h2>
        <label className="text-sm font-medium text-gray-800">
          Email
          <input name="reporterEmail" type="email" className="input" placeholder="you@example.com" />
        </label>
        <label className="text-sm font-medium text-gray-800">
          Social handle
          <input name="reporterHandle" className="input" placeholder="@yourhandle" />
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="consentToContact" />
          You can contact me about this report.
        </label>
      </div>

      <div className="space-y-3">
        <label className="inline-flex items-center gap-2 text-sm text-gray-800 font-medium">
          <input type="checkbox" name="consentConfirmed" required />
          I confirm this information is accurate to the best of my knowledge.
        </label>
        <p className="text-xs text-gray-600">
          We may use anonymous, aggregated data from reports to push for policy changes and enforce card network rules.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px] disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit report"}
        </button>
        <p className="text-sm text-gray-600">Takes ~1 minute. Thank you.</p>
      </div>
    </form>
  );
}
