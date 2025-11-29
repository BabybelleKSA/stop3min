import { prisma } from "./prisma";

export type AdminStats = {
  totalReports: number;
  totalMerchants: number;
  reportsLast7Days: number;
  reportsLast30Days: number;
  reportsByState: { state: string; count: number }[];
};

const EMPTY_STATS: AdminStats = {
  totalReports: 0,
  totalMerchants: 0,
  reportsLast7Days: 0,
  reportsLast30Days: 0,
  reportsByState: []
};

export async function getAdminStats(): Promise<AdminStats> {
  const now = Date.now();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  try {
    const [totalReports, reportsLast7Days, reportsLast30Days, stateGroups, merchantGroups] = await Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.report.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.report.groupBy({
        by: ["state"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5
      }),
      prisma.report.groupBy({
        by: ["storeName", "addressLine1", "city", "state", "zip", "country"],
        _count: { id: true }
      })
    ]);

    const reportsByState = stateGroups.map((group) => ({
      state: group.state,
      count: group._count.id
    }));

    return {
      totalReports,
      totalMerchants: merchantGroups.length,
      reportsLast7Days,
      reportsLast30Days,
      reportsByState
    };
  } catch (error) {
    console.error("Failed to load admin stats", error);
    return { ...EMPTY_STATS };
  }
}
