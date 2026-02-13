import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await getDatabase();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const sixtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    const stats = await db.collection('faculty').aggregate([
      {
        $facet: {
          // 1. Total Faculty Count
          "totalFaculty": [{ $count: "count" }],

          // 2. Active Grants (Status is 'Grant Phase' or 'Active')
          "activeGrants": [
            { $match: { status: { $in: ["Grant Phase", "Active"] } } },
            { $count: "count" }
          ],

          // 3. Research Output Growth calculation
          "currentPeriod": [
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            { $count: "count" }
          ],
          "previousPeriod": [
            { $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
            { $count: "count" }
          ],

          // 4. Average Lab Completion/Progress
          "avgProgress": [
            { $group: { _id: null, avg: { $avg: "$progress" } } }
          ]
        }
      }
    ]).toArray();

    const data = stats[0];
    
    // Calculate Growth Percentage
    const current = data.currentPeriod[0]?.count || 0;
    const previous = data.previousPeriod[0]?.count || 0;
    const growth = previous === 0 ? 0 : ((current - previous) / previous) * 100;

    return NextResponse.json({
      totalFaculty: data.totalFaculty[0]?.count || 0,
      activeGrants: data.activeGrants[0]?.count || 0,
      researchGrowth: growth.toFixed(1),
      avgProgress: data.avgProgress[0]?.avg?.toFixed(1) || 0
    });
  } catch (error) {
    return NextResponse.json({ error: "Aggregation failed" }, { status: 500 });
  }
}