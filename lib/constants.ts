export const REPORT_STATUSES = [
  "NEW",
  "IN_REVIEW",
  "COMPLAINT_FILED",
  "RESOLVED",
  "DISMISSED"
] as const;

export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const CARD_TYPES = ["DEBIT", "CREDIT", "BOTH", "UNKNOWN"] as const;

export type CardType = (typeof CARD_TYPES)[number];
