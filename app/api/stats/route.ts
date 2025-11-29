import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/stats";

export async function GET() {
  try {
    const stats = await getAdminStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Unexpected error in /api/stats", error);
    return NextResponse.json(
      {
        totalReports: 0,
        totalMerchants: 0,
        reportsLast7Days: 0,
        reportsLast30Days: 0,
        reportsByState: []
      },
      { status: 200 }
    );
  }
}
