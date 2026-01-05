// /api/admin/dashboard/recent-users/route.ts
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

    const users = await db.collection("users").aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "userId",
          as: "subscription"
        }
      },
      { $unwind: { path: "$subscription", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          userName: {
            $concat: ["$firstName", " ", "$lastName"]
          },
          userEmail: "$email",
          planType: { $ifNull: ["$subscription.planId", "Free Trial"] },
          joinedDate: "$createdAt"
        }
      }
    ]).toArray();

    return NextResponse.json({ users });
  } catch (err) {
    console.error("Recent users error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
