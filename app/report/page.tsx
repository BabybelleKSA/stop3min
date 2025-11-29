import type { CardType, ReportStatus } from "@/lib/constants";
import { CARD_TYPES, REPORT_STATUSES } from "@/lib/constants";
import { StatusBadge } from "@/components/StatusBadge";
import { cardTypeLabels, formatDate, formatMoney, statusLabels } from "@/lib/utils";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReportActions } from "@/app/admin/(protected)/reports/[id]/report-actions";

type Props = {
  params: { id: string };
};

export default async function ReportDetailPage({ params }: Props) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) notFound();

  const status: ReportStatus =
    (REPORT_STATUSES.find((s) => s === report.status) ?? "NEW") as ReportStatus;

  const cardType: CardType =
    (CARD_TYPES.find((c) => c === report.cardType) ?? "UNKNOWN") as CardType;

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-600">Report #{report.id}</p>
          <h1 className="text-3xl font-bold text-gray-900">{report.storeName}</h1>
          <p className="text-sm text-gray-600">
            {report.addressLine1}, {report.city}, {report.state} {report.zip}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <div className="card p-5 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Violation</h2>
          <Detail label="Card type" value={cardTypeLabels[cardType]} />
          <Detail label="Minimum amount" value={formatMoney(report.minAmount)} />
          <Detail label="Visited" value={formatDate(report.visitedAt)} />
          <Detail label="Sign text" value={report.signText || ""} />
          <Detail label="Description" value={report.description || ""} />
          <Detail
            label="Photo URL"
            value={
              report.photoUrl ? (
                <a className="text-primary" href={report.photoUrl} target="_blank" rel="noreferrer">
                  Open link
                </a>
              ) : (
                ""
              )
            }
          />
        </div>

        <div className="card p-5 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Reporter</h2>
          <Detail label="Email" value={report.reporterEmail || ""} />
          <Detail label="Handle" value={report.reporterHandle || ""} />
          <Detail label="Consent to contact" value={report.consentToContact ? "Yes" : "No"} />
          <Detail label="Created" value={formatDate(report.createdAt)} />
          <Detail label="Updated" value={formatDate(report.updatedAt)} />
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Follow-up</h2>
          <p className="text-xs text-gray-500">{statusLabels[status]}</p>
        </div>
        <Detail label="Networks reported to" value={report.networksReportedTo || ""} />
        <Detail label="Notes" value={report.followUpNotes || ""} />
        <ReportActions
          id={report.id}
          status={status}
          followUpNotes={report.followUpNotes || ""}
          networksReportedTo={report.networksReportedTo || ""}
        />
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <div className="text-sm text-gray-800 text-right max-w-md">{value}</div>
    </div>
  );
}
