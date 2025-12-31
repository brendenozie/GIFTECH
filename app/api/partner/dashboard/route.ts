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

// /api/partner/dashboard/route.ts
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const decoded = verifyToken(token!);
    
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await getDatabase();
    const userId = new ObjectId(decoded.userId);

    // 1. Fetch the user to get their stored referralCode
    const user = await db.collection("users").findOne({ _id: userId });
    
    if (!user || !user.partnerProfile) {
      return NextResponse.json({ error: "Partner profile not found" }, { status: 404 });
    }

    const { referralCode } = user.partnerProfile;

    // 2. Fetch referrals (assumes your 'referrals' collection uses partnerId or referralCode)
    const referrals = await db.collection("referrals")
      .find({ partnerId: userId }) 
      .sort({ createdAt: -1 })
      .toArray();

    // 3. Analytics Calculations
    const totalRevenue = referrals.reduce((sum, r) => sum + (r.revenue || 0), 0);
    
    return NextResponse.json({
      // Combines the base URL with the unique rp-xxxxxx code
      referralCode: `https://readypips.com/ref/${referralCode}`,
      stats: {
        totalRevenue,
        activeReferrals: referrals.length,
        conversionRate: referrals.length > 0 ? "3.2%" : "0%",
      },
      revenueChart: aggregateByDay(referrals),
      recentConversions: referrals.slice(0, 5).map(r => ({
        id: r._id,
        amount: r.revenue,
        createdAt: r.createdAt || r.date,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Dashboard load failed" }, { status: 500 });
  }
}

// function aggregateByDay(referrals: any[]) {
//   const dailyData: { [key: string]: number } = {};

//   referrals.forEach((r) => {
//     // Standardize date format for Recharts (MM/DD)
//     const dateObj = new Date(r.createdAt || r.date);
//     const label = dateObj.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
    
//     dailyData[label] = (dailyData[label] || 0) + (r.revenue || 0);
//   });

//   return Object.keys(dailyData).map(date => ({
//     name: date,
//     revenue: dailyData[date]
//   })).reverse(); // Ensures the chart moves forward in time
// }

/**
 * Aggregates revenue by date for the Recharts component
 * Returns: { name: "MM/DD", revenue: number }[]
 */
function aggregateByDay(referrals: any[]) {
  const dailyMap: { [key: string]: number } = {};

  // Group by local date string
  referrals.forEach((ref) => {
    const date = new Date(ref.createdAt || ref.date);
    const dateKey = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
    
    dailyMap[dateKey] = (dailyMap[dateKey] || 0) + (ref.revenue || 0);
  });

  // Convert map to sorted array for the chart
  return Object.keys(dailyMap)
    .map((date) => ({
      name: date, // "name" maps to XAxis dataKey in the UI
      revenue: dailyMap[date],
    }))
    .reverse(); // Ensure chronological order
}

// export async function GET(req: NextRequest) {
//   const decoded = verifyToken(req.headers.get("authorization")?.replace("Bearer ", "")!);
//   const db = await getDatabase();

//   if (!decoded) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const partnerId = new ObjectId(decoded.userId);

//   const referrals = await db.collection("referrals").find({ partnerId }).toArray();

//   const totalRevenue = referrals.reduce((sum, r) => sum + r.revenue, 0);

//   return NextResponse.json({
//     referralCode: `https://readypips.com/ref/${decoded.userId}`,
//     stats: {
//       totalRevenue,
//       activeReferrals: referrals.length,
//       conversionRate: referrals.length ? "3.2%" : "0%",
//     },
//     revenueChart: aggregateByDay(referrals),
//     recentConversions: referrals.slice(-5),
//   });
// }


// function aggregateByDay(referrals: any[]) {
//   const dailyData: { [key: string]: number } = {};

//   referrals.forEach((referral) => {
//     const dateKey = new Date(referral.date).toISOString().split('T')[0];
//     if (!dailyData[dateKey]) {
//       dailyData[dateKey] = 0;
//     }
//     dailyData[dateKey] += referral.revenue;
//   });

//   const result = Object.keys(dailyData).map((date) => ({
//     date,
//     revenue: dailyData[date],
//   }));

//   return result;
// }