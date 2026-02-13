import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const db = await getDatabase();
    const body = await request.json();

    const scheduleEntry = {
      facultyId: new ObjectId(body.facultyId),
      schoolId: new ObjectId(body.schoolId),
      grade: body.grade,
      subject: body.subject,
      day: body.day, // e.g., "Monday"
      startTime: body.startTime,
      endTime: body.endTime,
      createdAt: new Date()
    };

    const result = await db.collection('timetable').insertOne(scheduleEntry);
    return NextResponse.json({ _id: result.insertedId, ...scheduleEntry });
  } catch (error) {
    return NextResponse.json({ error: "Failed to schedule session" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const facultyId = searchParams.get('facultyId');
  const db = await getDatabase();

  const query = facultyId ? { facultyId: new ObjectId(facultyId) } : {};
  const schedule = await db.collection('timetable').find(query).toArray();
  
  return NextResponse.json(schedule);
}