import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, findAdminById } from "@/lib/admin";
import { getDatabase } from "@/lib/mongodb";

async function verifyAdmin(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return { valid: false, error: "No token provided" };
  }

  const decoded = verifyAdminToken(token);
  if (!decoded) {
    return { valid: false, error: "Invalid token" };
  }

  const admin = await findAdminById(decoded.adminId);
  if (!admin || !admin.isActive) {
    return { valid: false, error: "Admin not found or inactive" };
  }

  return { valid: true, admin };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const db = await getDatabase();

    // Get revenue breakdown by plan type from payments
    const planRevenue = await db.collection("payments").aggregate([
      {
        $match: {
          status: "completed"
        }
      },
      {
        $group: {
          _id: "$planName",
          totalRevenue: {
            $sum: {
              $toDouble: {
                $replaceAll: {
                  input: { $toString: "$amount" },
                  find: /[^0-9.]/g,
                  replacement: ""
                }
              }
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      }
    ]).toArray();

    // Calculate total revenue for percentage
    const totalRevenue = planRevenue.reduce((sum, plan) => sum + plan.totalRevenue, 0);

    // Format plan revenue with percentages
    const formattedPlans = planRevenue.map((plan) => ({
      name: plan._id || 'Unknown',
      revenue: `$${plan.totalRevenue.toFixed(2)}`,
      percentage: totalRevenue > 0 ? Math.round((plan.totalRevenue / totalRevenue) * 100) : 0,
      count: plan.count
    }));

    return NextResponse.json({ plans: formattedPlans, totalRevenue }, { status: 200 });
  } catch (error) {
    console.error("Error fetching plan revenue:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
