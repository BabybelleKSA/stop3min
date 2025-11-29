import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { enforceApiAuth } from "../../../../lib/auth";
import { ReportStatus } from "@prisma/client";

function escapeCSV(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  const unauthorized = enforceApiAuth(req);
  if (unauthorized) return unauthorized;

  const params = req.nextUrl.searchParams;
  const statusParam = params.get("status") || undefined;
  const status =
    statusParam && Object.values(ReportStatus).includes(statusParam as ReportStatus)
      ? (statusParam as ReportStatus)
      : undefined;
  const state = params.get("state") || undefined;
  const city = params.get("city") || undefined;
  const search = params.get("search") || undefined;

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

  const reports = await prisma.report.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });

  const headers = [
    "id",
    "createdAt",
    "storeName",
    "addressLine1",
    "addressLine2",
    "city",
    "state",
    "zip",
    "country",
    "cardType",
    "minAmount",
    "signText",
    "description",
    "visitedAt",
    "photoUrl",
    "reporterEmail",
    "reporterHandle",
    "consentToContact",
    "status",
    "networksReportedTo",
    "followUpNotes"
  ];

  const rows = reports.map((report) =>
    [
      report.id,
      report.createdAt.toISOString(),
      report.storeName,
      report.addressLine1,
      report.addressLine2,
      report.city,
      report.state,
      report.zip,
      report.country,
      report.cardType,
      report.minAmount,
      report.signText,
      report.description,
      report.visitedAt ? report.visitedAt.toISOString() : "",
      report.photoUrl,
      report.reporterEmail,
      report.reporterHandle,
      report.consentToContact,
      report.status,
      report.networksReportedTo,
      report.followUpNotes
    ]
      .map(escapeCSV)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="reports-${date}.csv"`
    }
  });
}
