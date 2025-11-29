import type { ReportStatus } from "@/lib/constants";
import { CARD_TYPES, REPORT_STATUSES } from "@/lib/constants";
import { enforceApiAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reportsQuerySchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

const normalizeOptionalString = (value: unknown) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as Record<string, unknown>));

  const storeName = normalizeOptionalString(body.storeName);
  const addressLine1 = normalizeOptionalString(body.addressLine1);
  const city = normalizeOptionalString(body.city);
  const stateRaw = normalizeOptionalString(body.state);
  const zip = normalizeOptionalString(body.zip);

  if (!storeName) return NextResponse.json({ error: "Store name is required" }, { status: 400 });
  if (!addressLine1) return NextResponse.json({ error: "Address is required" }, { status: 400 });
  if (!city) return NextResponse.json({ error: "City is required" }, { status: 400 });
  if (!stateRaw || stateRaw.length !== 2)
    return NextResponse.json({ error: "State must be 2 letters" }, { status: 400 });
  if (!zip) return NextResponse.json({ error: "ZIP is required" }, { status: 400 });

  const minAmount = Number(body.minAmount);
  if (!Number.isFinite(minAmount) || minAmount <= 0) {
    return NextResponse.json({ error: "Minimum amount must be greater than 0" }, { status: 400 });
  }

  const visitedAt =
    typeof body.visitedAt === "string" && body.visitedAt.trim()
      ? new Date(body.visitedAt as string)
      : null;
  const visitedDate = visitedAt && !Number.isNaN(visitedAt.getTime()) ? visitedAt : null;

  const cardTypeInput = normalizeOptionalString(body.cardType);
  const cardType = cardTypeInput && CARD_TYPES.includes(cardTypeInput as any) ? cardTypeInput : "UNKNOWN";
  const signText = normalizeOptionalString(body.signText);
  const description = normalizeOptionalString(body.description);
  const addressLine2 = normalizeOptionalString(body.addressLine2);
  const photoUrl = normalizeOptionalString(body.photoUrl);
  const reporterEmail = normalizeOptionalString(body.reporterEmail);
  const reporterHandle = normalizeOptionalString(body.reporterHandle);

  const consentToContact =
    body.consentToContact === true ||
    body.consentToContact === "true" ||
    body.consentToContact === "on" ||
    body.consentToContact === 1;

  const status = "NEW";
  const country = "USA";

  try {
    const report = await prisma.report.create({
      data: {
        storeName,
        addressLine1,
        addressLine2,
        city,
        state: stateRaw.toUpperCase(),
        zip,
        country,
        cardType,
        minAmount,
        signText,
        description,
        visitedAt: visitedDate,
        photoUrl,
        reporterEmail,
        reporterHandle,
        consentToContact,
        status,
        networksReportedTo: null,
        followUpNotes: null
      }
    });

    return NextResponse.json({ ok: true, id: report.id });
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
