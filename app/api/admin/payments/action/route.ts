import { verifyToken } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { PLANS } from "@/lib/plans";

export async function PATCH(req: Request) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const decoded = verifyToken(token!);

    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { intentId, action } = await req.json();
    const db = await getDatabase();

    const intent = await db.collection("payment_intents").findOne({
      _id: new ObjectId(intentId),
    });

    if (!intent) {
      return NextResponse.json({ error: "Intent not found" }, { status: 404 });
    }

    const userId = intent.userId;

    /* ------------------------------------
       REJECT FLOW
    ------------------------------------ */
    if (action === "reject") {
      await db.collection("payment_intents").updateMany(
        { userId, status: { $ne: "success" } },
        {
          $set: {
            status: "declined",
            processedAt: new Date(),
          },
        }
      );

      return NextResponse.json({
        message: "All user payment intents rejected",
      });
    }

    /* ------------------------------------
       APPROVE FLOW
    ------------------------------------ */
    if (action === "approve") {
      const plan = PLANS.find((p) => p.id === intent.planId);
      if (!plan) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      }

      const durationDays = plan.duration;

      // 1️⃣ Reject ALL other intents for this user
      await db.collection("payment_intents").updateMany(
        {
          userId,
          _id: { $ne: new ObjectId(intentId) },
        },
        {
          $set: {
            status: "declined",
            processedAt: new Date(),
          },
        }
      );

      // 2️⃣ Approve selected intent
      await db.collection("payment_intents").updateOne(
        { _id: new ObjectId(intentId) },
        {
          $set: {
            status: "success",
            processedAt: new Date(),
          },
        }
      );

      // 3️⃣ Handle subscription stacking
      const existingSub = await db.collection("subscriptions").findOne({
        userId,
        status: "active",
      });

      let startDate = new Date();
      if (existingSub && existingSub.endDate > startDate) {
        startDate = new Date(existingSub.endDate);
      }

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + durationDays);

      // 4️⃣ Upsert subscription
      await db.collection("subscriptions").updateOne(
        { userId },
        {
          $set: {
            userId,
            planId: intent.planId,
            amount: intent.amount,
            status: "active",
            startDate,
            endDate,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      // 5️⃣ Update user profile
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            subscriptionStatus: "active",
            subscriptionType: intent.planId,
            subscriptionEndDate: endDate,
          },
        }
      );

      return NextResponse.json({
        message: "Payment approved, subscription stacked correctly",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

// import { verifyToken } from '@/lib/auth';
// import { getDatabase } from '@/lib/mongodb';
// import { NextResponse } from 'next/server';
// import { ObjectId } from 'mongodb';
// import { PLANS } from '@/lib/plans';

// export async function PATCH(req: Request) {
//   try {
//     const token = req.headers.get("authorization")?.replace("Bearer ", "");
//     const decoded = verifyToken(token!);

//     if (!decoded || !decoded.isAdmin) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { intentId, action } = await req.json();
//     const db = await getDatabase();

//     // 1. Find the intent
//     const intent = await db.collection("payment_intents").findOne({ _id: new ObjectId(intentId) });
//     if (!intent) return NextResponse.json({ error: "Intent not found" }, { status: 404 });

//     if (action === "reject") {
//       await db.collection("payment_intents").updateOne(
//         { _id: new ObjectId(intentId) },
//         { $set: { status: "declined", processedAt: new Date() } }
//       );
//       return NextResponse.json({ message: "Payment declined" });
//     }

//     if (action === "approve") {
//       const plan = PLANS.find(p => p.id === intent.planId);
//       const durationDays = plan?.duration || 30;

//       // 2. Update Intent Status
//       await db.collection("payment_intents").updateOne(
//         { _id: new ObjectId(intentId) },
//         { $set: { status: "success", processedAt: new Date() } }
//       );

//       // 3. Upsert Subscription
//       const endDate = new Date();
//       endDate.setDate(endDate.getDate() + durationDays);

//       await db.collection("subscriptions").updateOne(
//         { userId: intent.userId },
//         {
//           $set: {
//             userId: intent.userId,
//             planId: intent.planId,
//             amount: intent.amount,
//             status: "active",
//             startDate: new Date(),
//             endDate: endDate,
//             updatedAt: new Date()
//           }
//         },
//         { upsert: true }
//       );

//       // 4. Update User Profile Status
//       await db.collection("users").updateOne(
//         { _id: new ObjectId(intent.userId) },
//         { 
//           $set: { 
//             subscriptionStatus: "active",
//             subscriptionType: intent.planId,
//             subscriptionEndDate: endDate
//           } 
//         }
//       );

//       return NextResponse.json({ message: "Payment verified and subscription activated" });
//     }
//   } catch (error) {
//     return NextResponse.json({ error: "Internal Error" }, { status: 500 });
//   }
// }