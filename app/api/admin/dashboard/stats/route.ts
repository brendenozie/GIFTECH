import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, findAdminById } from "@/lib/admin";
import { getDatabase } from "@/lib/mongodb";

async function verifyAdmin(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return { valid: false, error: "No token provided" };

  const decoded = verifyAdminToken(token);
  if (!decoded) return { valid: false, error: "Invalid token" };

  const admin = await findAdminById(decoded.adminId);
  if (!admin || !admin.isActive) return { valid: false, error: "Admin not found or inactive" };

  return { valid: true, admin };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.valid) return NextResponse.json({ error: auth.error }, { status: 401 });

    const db = await getDatabase();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Single Aggregation for all Revenue Metrics
    const revenueData = await db.collection("payments").aggregate([
      { $match: { status: "completed" } },
      {
        $project: {
          createdAt: 1,
          amountInKES: {
            $cond: [
              { $eq: ["$currency", "USD"] },
              { $multiply: [{ $toDouble: "$amount" }, 150] }, // Logic: USD to KES
              { $toDouble: "$amount" }
            ]
          }
        }
      },
      {
        $facet: {
          total: [{ $group: { _id: null, sum: { $sum: "$amountInKES" } } }],
          weekly: [
            { $match: { createdAt: { $gte: weekAgo } } },
            { $group: { _id: null, sum: { $sum: "$amountInKES" } } }
          ],
          daily: [
            { $match: { createdAt: { $gte: dayAgo } } },
            { $group: { _id: null, sum: { $sum: "$amountInKES" } } }
          ]
        }
      }
    ]).toArray();

    // Fetch Counts in Parallel
    const [active, expired, trial, pending, totalUsers] = await Promise.all([
      db.collection("subscriptions").countDocuments({ status: "active" }),
      db.collection("subscriptions").countDocuments({ status: "expired" }),
      db.collection("subscriptions").countDocuments({ status: "trial" }),
      db.collection("payment_intents").countDocuments({ status: "pending" }),
      db.collection("users").countDocuments()
    ]);

    const revenue = revenueData[0];

    const stats = {
      revenue: {
        total: Math.round(revenue.total[0]?.sum || 0),
        weekly: Math.round(revenue.weekly[0]?.sum || 0),
        daily: Math.round(revenue.daily[0]?.sum || 0),
      },
      active,
      expired,
      trial,
      pending, // This is what your frontend "In Queue" stat uses
      totalUsers,
      systemUptime: "99.9%",
      toolAccessMetrics: await db.collection("tools").countDocuments({ isActive: true })
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}