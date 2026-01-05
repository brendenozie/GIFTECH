// /api/admin/dashboard/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, findAdminById } from "@/lib/admin";
import { getDatabase } from "@/lib/mongodb";

async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;

  const decoded = verifyAdminToken(token);
  if (!decoded) return null;

  const admin = await findAdminById(decoded.adminId);
  if (!admin || !admin.isActive || !admin.isAdmin) return null;

  return admin;
}

export async function GET(req: NextRequest) {
  try {
    // const admin = await verifyAdmin(req);
    // if (!admin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const db = await getDatabase();

    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const revenueAgg = await db.collection("payment_intents").aggregate([
      { $match: { status: "success" } },
      {
        $facet: {
          total: [
            { $group: { _id: null, sum: { $sum: "$amount" } } }
          ],
          daily: [
            { $match: { createdAt: { $gte: dayAgo } } },
            { $group: { _id: null, sum: { $sum: "$amount" } } }
          ],
          weekly: [
            { $match: { createdAt: { $gte: weekAgo } } },
            { $group: { _id: null, sum: { $sum: "$amount" } } }
          ]
        }
      }
    ]).toArray();

    const revenue = revenueAgg[0];

    const [
      totalUsers,
      active,
      expired,
      trial,
      pending,
      toolAccessMetrics
    ] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("subscriptions").countDocuments({ status: "active" }),
      db.collection("subscriptions").countDocuments({ status: "expired" }),
      db.collection("subscriptions").countDocuments({ status: "trial" }),
      db.collection("payment_intents").countDocuments({ status: "pending" }),
      db.collection("tools").countDocuments({ isActive: true })
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        active,
        expired,
        trial,
        pending,
        systemUptime: "99.9%",
        toolAccessMetrics,
        revenue: {
          total: revenue.total[0]?.sum || 0,
          daily: revenue.daily[0]?.sum || 0,
          weekly: revenue.weekly[0]?.sum || 0
        }
      }
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
