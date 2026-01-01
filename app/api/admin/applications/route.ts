import { verifyToken } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// GET: Fetch all pending or active affiliates/partners
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const decoded = verifyToken(token!);
    if (!decoded || !decoded.isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const db = await getDatabase();
    const applications = await db.collection("users").find({
      role: { $in: ["partner", "affiliate"] }
    }).toArray();

    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// PATCH: Update rates, tiers, and approval status
export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const decoded = verifyToken(token!);
    if (!decoded || !decoded.isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { userId, status, updates, role } = await req.json();
    const db = await getDatabase();

    const updateQuery: any = {};
    
    if (role === 'partner') {
      if (status) updateQuery["partnerProfile.isApproved"] = status === 'approved';
      if (updates.revenueShare) updateQuery["partnerProfile.revenueShare"] = parseFloat(updates.revenueShare);
      if (updates.tier) updateQuery["partnerProfile.tier"] = updates.tier;
    } else {
      if (status) updateQuery["affiliateProfile.isActive"] = status === 'approved';
      if (updates.commissionRate) updateQuery["affiliateProfile.commissionRate"] = parseFloat(updates.commissionRate);
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateQuery }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}