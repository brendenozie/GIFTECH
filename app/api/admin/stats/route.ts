import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET() {
  const db = await getDatabase();
  
  // Example: Summing revenue from a payments collection
  const revenue = await db.collection('transactions').aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]).toArray();

  return NextResponse.json({
    activeEnrolled: 14208, // Replace with dynamic count
    totalRevenue: revenue[0]?.total || 0,
    scholarshipBurn: 82100
  });
}