import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb'; 

// --- GET: Fetch Faculty List + Statistics ---
export async function GET() {
  try {
    const db = await getDatabase();

    // 1. Fetch all faculty members (sorted by newest first)
    const faculty = await db.collection('faculty')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    // 2. Aggregate Stats for the dashboard cards
    const statsArray = await db.collection('faculty').aggregate([
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          activeGrants: [
            { $match: { status: "Active" } },
            { $count: "count" }
          ],
          // Example calculation: average progress across all members
          avgProgress: [
            { $group: { _id: null, avg: { $avg: "$progress" } } }
          ]
        }
      }
    ]).toArray();

    const stats = {
      totalFaculty: statsArray[0].totalCount[0]?.count || 0,
      activeGrants: statsArray[0].activeGrants[0]?.count || 0,
      researchGrowth: Math.round(statsArray[0].avgProgress[0]?.avg || 0)
    };

    return NextResponse.json({ faculty, stats });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch faculty" }, { status: 500 });
  }
}

// --- POST: Add a New Faculty Member ---
export async function POST(request: Request) {
  try {
    const db = await getDatabase();
    const body = await request.json();

    // Prepare the document with a timestamp
    const newDoc = {
      ...body,
      progress: Number(body.progress) || 0,
      createdAt: new Date(),
    };

    const result = await db.collection('faculty').insertOne(newDoc);

    // Return the created document including the new MongoDB _id
    return NextResponse.json({
      _id: result.insertedId,
      ...newDoc
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to save faculty member" }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const result = await db.collection('faculty').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    // Clean up the data: Ensure progress is a number
    if (updateData.progress) updateData.progress = Number(updateData.progress);

    const result = await db.collection('faculty').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error: any) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}