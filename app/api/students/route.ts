import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const schoolId = searchParams.get('schoolId');

  if (!schoolId) return NextResponse.json({ error: "School ID required" }, { status: 400 });

  const db = await getDatabase();
  // Fetch students for this school, grouped by grade
  const students = await db.collection('students')
    .find({ schoolId: new ObjectId(schoolId) })
    .sort({ grade: 1, name: 1 })
    .toArray();

  return NextResponse.json(students);
}

export async function POST(request: Request) {
  const db = await getDatabase();
  const body = await request.json();
  
  const newStudent = {
    ...body,
    schoolId: new ObjectId(body.schoolId), // Linking student to school
    createdAt: new Date()
  };

  const result = await db.collection('students').insertOne(newStudent);
  return NextResponse.json({ _id: result.insertedId, ...newStudent });
}