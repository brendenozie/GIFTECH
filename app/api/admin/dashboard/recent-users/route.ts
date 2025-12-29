import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdminToken } from '@/lib/admin';

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminData = await verifyAdminToken(token);
    if (!adminData) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    // Get 10 most recent users with their subscription info and latest payment
    const recentUsers = await usersCollection
      .aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: 10,
        },
        {
          $lookup: {
            from: 'subscriptions',
            localField: '_id',
            foreignField: 'userId',
            as: 'subscriptions',
          },
        },
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: 'userId',
            as: 'payments',
          },
        },
        {
          $addFields: {
            latestPayment: {
              $arrayElemAt: [
                {
                  $sortArray: {
                    input: '$payments',
                    sortBy: { createdAt: -1 }
                  }
                },
                0
              ]
            }
          }
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            subscriptionType: 1,
            isEmailVerified: 1,
            createdAt: 1,
            subscriptions: {
              $cond: [{ $gt: [{ $size: '$subscriptions' }, 0] }, { $arrayElemAt: ['$subscriptions', 0] }, null],
            },
            latestPayment: 1,
          },
        },
      ])
      .toArray();

    const users = recentUsers.map((user: any) => {
      // Map subscription types to display names
      const planTypeMap: { [key: string]: string } = {
        'free': 'Free Trial',
        'basic': 'Weekly',
        'premium': 'Monthly',
        'pro': '3 Months',
      };

      const subscriptionType = user.subscriptionType?.toLowerCase() || 'free';
      const planName = planTypeMap[subscriptionType] || 'Free Trial';

      return {
        _id: user._id,
        userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
        userEmail: user.email || '',
        planType: planName,
        isVerified: user.isEmailVerified || false,
        joinedDate: user.createdAt,
        subscriptionStatus: user.subscriptions?.status || 'no-subscription',
        lastActive: user.subscriptions?.createdAt || user.createdAt,
        lastPaymentDate: user.latestPayment?.createdAt || null,
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching recent users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent users' },
      { status: 500 }
    );
  }
}
