"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setError(null);
    setLoading(true);

    const payload = {
      email: formData.get("email"),
      password: formData.get("password")
    };

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Invalid credentials");
      }

      window.location.href = "/admin";
    } catch (err: any) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-primary">Admin access</p>
          <h1 className="text-3xl font-bold text-gray-900">Sign in</h1>
          <p className="text-sm text-gray-600">Use the admin email + password from environment variables.</p>
        </div>
        <form onSubmit={onSubmit} className="card space-y-4 p-6">
          <label className="text-sm font-medium text-gray-800">
            Email
            <input name="email" type="email" required className="input" placeholder="admin@example.com" />
          </label>
          <label className="text-sm font-medium text-gray-800">
            Password
            <input name="password" type="password" required className="input" placeholder="••••••••" />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
