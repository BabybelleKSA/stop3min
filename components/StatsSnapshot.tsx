"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalReports: number;
  totalMerchants: number;
  reportsLast7Days: number;
  reportsLast30Days: number;
  reportsByState: { state: string; count: number }[];
};

export function StatsSnapshot() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("Could not load stats right now.");
      }
    };
    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="card p-6 text-sm text-gray-700">
        <p className="font-semibold text-gray-900">Live Stats Snapshot</p>
        <p className="mt-2 text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-gray-900">Live Stats Snapshot</p>
        {!stats && <span className="text-xs text-gray-500">Loading...</span>}
      </div>
      {!stats ? (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <StatCard label="Total reports" value={stats.totalReports.toLocaleString()} />
          <StatCard label="Reports (last 7 days)" value={stats.reportsLast7Days.toLocaleString()} />
          <StatCard label="Unique merchants" value={stats.totalMerchants.toLocaleString()} />
          <div className="md:col-span-3">
            <p className="text-sm font-semibold text-gray-800 mb-2">Top states</p>
            <div className="flex flex-wrap gap-2">
              {stats.reportsByState.slice(0, 5).map((entry) => (
                <span
                  key={entry.state}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
                >
                  {entry.state} <span className="text-gray-600">{entry.count}</span>
                </span>
              ))}
              {stats.reportsByState.length === 0 && <span className="text-sm text-gray-600">No data yet.</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
