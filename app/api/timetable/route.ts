import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  const body = await request.json();
  
  const db = await getDatabase();

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

  // Find any existing entries for this faculty on this day
  const existingSchedules = await db.collection('timetable').find({
    facultyId: scheduleEntry.facultyId,
    day: scheduleEntry.day
  }).toArray();

  const newStart = scheduleEntry.startTime; // "HH:MM"
  const newEnd = scheduleEntry.endTime;

  // Check for overlap using MongoDB logic or JS logic
  const hasConflict = existingSchedules.some(sched => {
    return newStart < sched.endTime && newEnd > sched.startTime;
  });

  if (hasConflict) {
    return NextResponse.json({ error: "Time conflict detected" }, { status: 409 });
  }

  const result = await db.collection('timetable').insertOne({
    ...scheduleEntry
  });

  return NextResponse.json({ _id: result.insertedId, ...scheduleEntry });
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const facultyId = searchParams.get('facultyId');
  const db = await getDatabase();

  const pipeline: any[] = [];

  // 1. Filter by Faculty if ID is provided
  if (facultyId) {
    pipeline.push({ $match: { facultyId: new ObjectId(facultyId) } });
  }

  // 2. Join with Faculty collection
  pipeline.push({
    $lookup: {
      from: 'faculty',
      localField: 'facultyId',
      foreignField: '_id',
      as: 'facultyInfo'
    }
  });

  // 3. Join with Schools collection
  pipeline.push({
    $lookup: {
      from: 'schools',
      localField: 'schoolId',
      foreignField: '_id',
      as: 'schoolInfo'
    }
  });

  // 4. Format the output so it's easy to use on the frontend
  pipeline.push({
    $project: {
      subject: 1,
      day: 1,
      startTime: 1,
      endTime: 1,
      grade: 1,
      facultyName: { $arrayElemAt: ['$facultyInfo.name', 0] },
      schoolName: { $arrayElemAt: ['$schoolInfo.name', 0] },
      facultyId: 1,
      schoolId: 1
    }
  });

  const schedule = await db.collection('timetable').aggregate(pipeline).toArray();
  
  return NextResponse.json(schedule);
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const updates = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const db = await getDatabase();

    // 1. CONFLICT CHECK (Only if day or time is being changed)
    if (updates.day || updates.startTime || updates.endTime) {
      // Get the current record to know which faculty member we are checking for
      const currentEntry = await db.collection('timetable').findOne({ _id: new ObjectId(id) });
      
      if (currentEntry) {
        const facultyId = updates.facultyId || currentEntry.facultyId;
        const day = updates.day || currentEntry.day;
        const start = updates.startTime || currentEntry.startTime;
        const end = updates.endTime || currentEntry.endTime;

        // Find other schedules for this faculty on this day (excluding current record)
        const overlap = await db.collection('timetable').findOne({
          _id: { $ne: new ObjectId(id) }, // Don't check against itself
          facultyId: new ObjectId(facultyId),
          day: day,
          $and: [
            { startTime: { $lt: end } },
            { endTime: { $gt: start } }
          ]
        });

        if (overlap) {
          return NextResponse.json({ 
            error: "Conflict detected", 
            conflictingWith: overlap.subject 
          }, { status: 409 });
        }
      }
    }

    // 2. PREPARE THE DATA
    // Ensure IDs are stored as ObjectIds if they are being updated
    const updateData: any = { ...updates };
    if (updates.facultyId) updateData.facultyId = new ObjectId(updates.facultyId);
    if (updates.schoolId) updateData.schoolId = new ObjectId(updates.schoolId);

    // 3. EXECUTE UPDATE
    const result = await db.collection('timetable').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedFields: updates });

  } catch (error) {
    console.error("Patch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}