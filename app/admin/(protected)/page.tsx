import { getAdminStats } from "@/lib/stats";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total reports" value={stats.totalReports} />
        <StatCard label="Reports (last 7 days)" value={stats.reportsLast7Days} />
        <StatCard label="Reports (last 30 days)" value={stats.reportsLast30Days} />
        <StatCard label="Unique merchants" value={stats.totalMerchants} />
      </div>

      <div className="card p-6">
        <p className="text-lg font-semibold text-gray-900">Reports by state (top 5)</p>
        {stats.reportsByState.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {stats.reportsByState.map((row) => (
              <span
                key={row.state}
                className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
              >
                {row.state} <span className="text-gray-600">{row.count}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-600">No reports yet.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
    </div>
  );
}
