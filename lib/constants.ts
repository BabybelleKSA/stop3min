export type ReportStatus =
  | "NEW"
  | "IN_REVIEW"
  | "COMPLAINT_FILED"
  | "RESOLVED"
  | "DISMISSED";

export type CardType = "DEBIT" | "CREDIT" | "BOTH" | "UNKNOWN";

export const REPORT_STATUSES: ReportStatus[] = [
  "NEW",
  "IN_REVIEW",
  "COMPLAINT_FILED",
  "RESOLVED",
  "DISMISSED"
];

export const CARD_TYPES: CardType[] = ["DEBIT", "CREDIT", "BOTH", "UNKNOWN"];
