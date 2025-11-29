import type { CardType, ReportStatus } from "@/lib/constants";
import { CARD_TYPES, REPORT_STATUSES } from "@/lib/constants";
import { StatusBadge } from "@/components/StatusBadge";
import { cardTypeLabels, formatDate, formatMoney, statusLabels } from "@/lib/utils";
import Link from "next/link";
import type { Route } from "next";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 20;

type SearchParams = {
  page?: string;
  status?: string;
  state?: string;
  city?: string;
  search?: string;
};

const normalizeStatus = (value?: string | null): ReportStatus | undefined =>
  value ? (REPORT_STATUSES.find((s) => s === value) as ReportStatus | undefined) : undefined;

const normalizeCardType = (value?: string | null): CardType =>
  (value && (CARD_TYPES.find((c) => c === value) as CardType | undefined)) || "UNKNOWN";

export default async function ReportsListPage({ searchParams }: { searchParams: SearchParams }) {
  const page = Math.max(parseInt(searchParams.page || "1", 10), 1);
  const status = normalizeStatus(searchParams.status);
  const state = searchParams.state;
  const city = searchParams.city;
  const search = searchParams.search;

  const where = {
    ...(status ? { status } : {}),
    ...(state ? { state: state.toUpperCase() } : {}),
    ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
    ...(search
      ? {
          OR: [
            { storeName: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    }),
    prisma.report.count({ where })
  ]);

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-sm text-gray-600">Review, filter, and export incoming reports.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/api/reports/export"
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
          >
            Export CSV
          </Link>
        </div>
      </div>

      <Filters initial={{ status, state, city, search }} />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Created</HeaderCell>
              <HeaderCell>Store</HeaderCell>
              <HeaderCell>Location</HeaderCell>
              <HeaderCell>Card</HeaderCell>
              <HeaderCell>Min</HeaderCell>
              <HeaderCell>Status</HeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((report) => {
              const reportStatus = normalizeStatus(report.status) ?? "NEW";
              const cardType = normalizeCardType(report.cardType);

              return (
                <tr key={report.id} className="hover:bg-gray-50">
                  <Cell>
                    <Link href={`/admin/reports/${report.id}`} className="font-semibold text-primary">
                      #{report.id}
                    </Link>
                  </Cell>
                  <Cell>{formatDate(report.createdAt)}</Cell>
                  <Cell className="font-medium text-gray-900">{report.storeName}</Cell>
                  <Cell>
                    {report.city}, {report.state}
                  </Cell>
                  <Cell>{cardTypeLabels[cardType]}</Cell>
                  <Cell>{formatMoney(report.minAmount)}</Cell>
                  <Cell>
                    <StatusBadge status={reportStatus} />
                  </Cell>
                </tr>
              );
            })}
            {reports.length === 0 && (
              <tr>
                <Cell colSpan={7} className="py-8 text-center text-gray-600">
                  No reports found.
                </Cell>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} query={{ status, state, city, search }} />
    </div>
  );
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">{children}</th>;
}

function Cell({ children, className = "", colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) {
  return (
    <td className={`px-3 py-3 align-top text-sm text-gray-800 ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
}

function Filters({
  initial
}: {
  initial: { status?: ReportStatus; state?: string; city?: string; search?: string };
}) {
  return (
    <form className="card grid gap-3 p-4 md:grid-cols-5" action="/admin/reports" method="get">
      <input type="hidden" name="page" value="1" />
      <div className="md:col-span-2">
        <label className="text-xs font-semibold text-gray-700">Search (store/description)</label>
        <input name="search" defaultValue={initial.search || ""} className="input" placeholder="bodega, deli..." />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-700">City</label>
        <input name="city" defaultValue={initial.city || ""} className="input" placeholder="City" />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-700">State</label>
        <input name="state" defaultValue={initial.state || ""} className="input uppercase" maxLength={2} placeholder="NY" />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-700">Status</label>
        <select name="status" defaultValue={initial.status || ""} className="input">
          <option value="">All</option>
          {REPORT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}

function Pagination({
  page,
  totalPages,
  query
}: {
  page: number;
  totalPages: number;
  query: { status?: ReportStatus; state?: string; city?: string; search?: string };
}) {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.state) params.set("state", query.state);
  if (query.city) params.set("city", query.city);
  if (query.search) params.set("search", query.search);

  const makeLink = (nextPage: number): Route => {
    const newParams = new URLSearchParams(params);
    newParams.set("page", nextPage.toString());
    return `/admin/reports?${newParams.toString()}` as Route;
  };

  return (
    <div className="flex items-center justify-between text-sm text-gray-700">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Link
          href={makeLink(Math.max(1, page - 1))}
          className={`rounded-full border px-3 py-2 font-semibold ${
            page <= 1 ? "cursor-not-allowed border-gray-200 text-gray-400" : "border-gray-300 hover:bg-gray-100"
          }`}
          aria-disabled={page <= 1}
        >
          Previous
        </Link>
        <Link
          href={makeLink(Math.min(totalPages, page + 1))}
          className={`rounded-full border px-3 py-2 font-semibold ${
            page >= totalPages
              ? "cursor-not-allowed border-gray-200 text-gray-400"
              : "border-gray-300 hover:bg-gray-100"
          }`}
          aria-disabled={page >= totalPages}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
