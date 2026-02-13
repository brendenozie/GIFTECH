import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    const schools = await db.collection('schools').find().sort({ name: 1 }).toArray();
    return NextResponse.json(schools);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch schools" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    const result = await db.collection('schools').insertOne({
      ...body,
      studentCount: Number(body.studentCount) || 0,
      createdAt: new Date()
    });
    return NextResponse.json({ _id: result.insertedId, ...body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add school" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const db = await getDatabase();
    const { _id, ...updateData } = await request.json();
    await db.collection('schools').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...updateData, studentCount: Number(updateData.studentCount) } }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const db = await getDatabase();
  await db.collection('schools').deleteOne({ _id: new ObjectId(id!) });
  return NextResponse.json({ success: true });
}