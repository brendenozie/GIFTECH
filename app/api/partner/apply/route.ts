import { verifyToken } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure your email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// /api/partner/apply/route.ts
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const decoded = verifyToken(token!);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { platform, audienceSize, strategy } = await req.json();
    const db = await getDatabase();

    // Use the userId as the unique identifier in the referral link
    const referralCode = decoded.userId; 

    await db.collection("users").updateOne(
      { _id: new ObjectId(decoded.userId) },
      {
        $set: {
          role: "partner", // Update role to partner
          partnerProfile: {
            platform,
            audienceSize,
            strategy,
            commissionRate: 0.2,
            isApproved: false, // Default to false until admin approval
            referralCode,
            appliedAt: new Date(),
          },
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Application failed" }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   const token = req.headers.get("authorization")?.replace("Bearer ", "");
//   const decoded = verifyToken(token!);

//   if (!decoded) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { platform, audienceSize, strategy } = await req.json();
//   const db = await getDatabase();

//   const referralCode = `rp-${decoded.userId.slice(-6)}`;

//   await db.collection("users").updateOne(
//     { _id: new ObjectId(decoded.userId) },
//     {
//       $set: {
//         role: "partner",
//         partnerProfile: {
//           platform,
//           audienceSize,
//           strategy,
//           commissionRate: 0.2,
//           isApproved: false,
//           referralCode,
//           appliedAt: new Date(),
//         },
//       },
//     }
//   );

//   return NextResponse.json({ success: true });
// }

