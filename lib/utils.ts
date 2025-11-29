import { CardType, ReportStatus } from "@prisma/client";

export function formatDate(date?: Date | string | null) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString();
}

export function formatMoney(value?: number | null) {
  if (value === undefined || value === null) return "—";
  return `$${value.toFixed(2)}`;
}

export const cardTypeLabels: Record<CardType, string> = {
  DEBIT: "Debit",
  CREDIT: "Credit",
  BOTH: "Both",
  UNKNOWN: "Not sure"
};

export const statusLabels: Record<ReportStatus, string> = {
  NEW: "New",
  IN_REVIEW: "In review",
  COMPLAINT_FILED: "Complaint filed",
  RESOLVED: "Resolved",
  DISMISSED: "Dismissed"
};
