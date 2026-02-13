import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET() {
  const db = await getDatabase();
  const apps = await db.collection('scholarships').find({ status: 'pending' }).toArray();
  return NextResponse.json(apps);
}

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  const db = await getDatabase();
  await db.collection('scholarships').updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: status } }
  );
  return NextResponse.json({ success: true });
}