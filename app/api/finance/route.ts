import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET() {
  const db = await getDatabase();
  
  // 1. Fetch Recent Transactions
  const transactions = await db.collection('transactions')
    .find().sort({ date: -1 }).limit(10).toArray();

  // 2. Aggregate Revenue for the Bar Chart (Last 6 Months)
  const revenueData = await db.collection('transactions').aggregate([
    { $match: { type: 'Inbound' } },
    { $group: { 
        _id: { $month: "$date" }, 
        amount: { $sum: "$amount" } 
    }},
    { $sort: { "_id": 1 } }
  ]).toArray();

  return NextResponse.json({ transactions, revenueData });
}