import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const decoded = verifyToken(token || "");

    // if (decoded?.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    // }

    const db = await getDatabase();
    
    // 1. Get the Partner Details
    const partner = await db.collection("users").findOne({ 
      _id: new ObjectId(params.id) 
    });

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    const referralCode = partner.partnerProfile?.referralCode;

    // 2. Find all users referred by this partner
    const referredUsers = await db.collection("users")
      .find({ refereer: referralCode })
      .project({ password: 0 }) // Security: hide passwords
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      partner: {
        email: partner.email,
        referralCode: referralCode,
        role: partner.role
      },
      referrals: referredUsers
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}