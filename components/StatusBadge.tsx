import { ReportStatus } from "@prisma/client";
import { statusLabels } from "../lib/utils";

const colorMap: Record<ReportStatus, string> = {
  NEW: "bg-blue-100 text-blue-800",
  IN_REVIEW: "bg-amber-100 text-amber-800",
  COMPLAINT_FILED: "bg-purple-100 text-purple-800",
  RESOLVED: "bg-green-100 text-green-800",
  DISMISSED: "bg-gray-200 text-gray-800"
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colorMap[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
