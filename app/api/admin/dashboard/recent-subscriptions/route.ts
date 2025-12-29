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

    // Fetch recent subscriptions from database
    const subscriptions = await db.collection("subscriptions")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $limit: 10
        },
        {
          $project: {
            _id: 1,
            userName: {
              $concat: ["$user.firstName", " ", "$user.lastName"]
            },
            userEmail: "$user.email",
            plan: "$plan",
            price: "$price",
            status: "$status",
            startDate: "$startDate",
            endDate: "$endDate",
            createdAt: "$createdAt"
          }
        }
      ])
      .toArray();

    return NextResponse.json({ subscriptions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching recent subscriptions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
