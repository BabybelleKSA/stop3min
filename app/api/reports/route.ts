import type { ReportStatus } from "@/lib/constants";
import { REPORT_STATUSES } from "@/lib/constants";
import { enforceApiAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reportCreateSchema, reportsQuerySchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = reportCreateSchema.safeParse(body);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Invalid data";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { consentConfirmed, ...data } = parsed.data;

  try {
    await prisma.report.create({
      data: {
        ...data,
        visitedAt: data.visitedAt ? new Date(data.visitedAt) : undefined
      }
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const unauthorized = enforceApiAuth(req);
  if (unauthorized) return unauthorized;

  const queryObj: Record<string, string | undefined> = {};
  req.nextUrl.searchParams.forEach((value, key) => {
    queryObj[key] = value;
  });

  const parsed = reportsQuerySchema.safeParse(queryObj);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query params" }, { status: 400 });
  }

  const { page, limit, status: statusParam, state, city, search } = parsed.data;
  const status: ReportStatus | undefined = statusParam
    ? REPORT_STATUSES.find((s) => s === statusParam)
    : undefined;
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
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.report.count({ where })
  ]);

  return NextResponse.json({ data: reports, total, page, limit });
}
