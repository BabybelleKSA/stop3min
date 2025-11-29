import { NextRequest, NextResponse } from "next/server";
import { enforceApiAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reportUpdateSchema } from "@/lib/validators";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = enforceApiAuth(req);
  if (unauthorized) return unauthorized;

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(report);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = enforceApiAuth(req);
  if (unauthorized) return unauthorized;

  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const parsed = reportUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const updated = await prisma.report.update({
      where: { id },
      data: parsed.data
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
