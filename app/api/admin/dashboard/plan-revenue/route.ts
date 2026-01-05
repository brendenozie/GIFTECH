// /api/admin/dashboard/plan-revenue/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/admin";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    // const decoded = verifyAdminToken(token!);

    // if (!decoded || !decoded.isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const db = await getDatabase();

    const plans = await db.collection("payment_intents").aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: "$planId",
          totalRevenue: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]).toArray();

    const totalRevenue = plans.reduce((s, p) => s + p.totalRevenue, 0);

    const formatted = plans.map(p => ({
      name: p._id || "Unknown",
      revenue: `KES ${p.totalRevenue.toLocaleString()}`,
      percentage: totalRevenue
        ? Math.round((p.totalRevenue / totalRevenue) * 100)
        : 0,
      count: p.count
    }));

    return NextResponse.json({ plans: formatted });
  } catch (err) {
    console.error("Plan revenue error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
