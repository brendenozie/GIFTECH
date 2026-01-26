import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { PLANS } from "@/lib/plans";
// import { grantTradingViewAccess } from "@/lib/tradingview-private";

// import { grantTradingViewAccess } from "@/lib/tradingview-service";


/* ------------------------------------
   SUCCESS EVENTS (normalized lowercase)
------------------------------------ */
const SUCCESS_EVENTS = new Set([
  // Membership
  "membership.went_active",
  "membership.activated",
  "membership.reactivated",

  // Subscription
  "subscription.went_active",
  "subscription.activated",
  "subscription.completed",
  "subscription.renewed",
  "subscription.reactivated",

  // Payment
  "payment.succeeded",
  "payment.completed",
  "payment.paid",
  "payment.processed",

  // Order
  "order.completed",
  "order.paid",
  "order.succeeded",
]);

export async function POST(req: NextRequest) {
  const db = await getDatabase();
  const receivedAt = new Date();

  let body: any = null;
  let event = "unknown";
  let reference: string | undefined;

  try {
    /* ------------------------------------
       1️⃣ Parse webhook body
    ------------------------------------ */
    body = await req.json();

    // Whop v2 uses `action`, fallback to legacy `event`
    const rawEvent = body?.action || body?.event || "unknown";
    event = String(rawEvent).toLowerCase();

    // Extract internal reference (custom_id)
    reference =
      body?.data?.membership_metadata?.custom_id ||
      body?.data?.membership?.metadata?.custom_id ||
      body?.data?.metadata?.custom_id;

    /* ------------------------------------
       2️⃣ Log webhook attempt FIRST (always)
    ------------------------------------ */
    const { insertedId: attemptId } =
      await db.collection("whop_webhook_attempts").insertOne({
        event,
        reference,
        payload: body,
        headers: Object.fromEntries(req.headers.entries()),
        processed: false,
        createdAt: receivedAt,
      });

    /* ------------------------------------
       3️⃣ Ignore non-success events
    ------------------------------------ */
    if (!SUCCESS_EVENTS.has(event)) {
      await db.collection("whop_webhook_attempts").updateOne(
        { _id: attemptId },
        {
          $set: {
            processed: true,
            ignored: true,
            ignoreReason: "Non-success event",
            processedAt: new Date(),
          },
        }
      );

      return NextResponse.json({ ignored: true, event }, { status: 200 });
    }

    /* ------------------------------------
       4️⃣ Validate reference
    ------------------------------------ */
    if (!reference) {
      throw new Error("Missing custom_id reference");
    }

    /* ------------------------------------
       5️⃣ Locate payment intent (idempotent)
    ------------------------------------ */
    const intent = await db.collection("payment_intents").findOne({
      reference,
      status: { $in: ["pending", "initiated"] },
    });

    if (!intent) {
      await db.collection("whop_webhook_attempts").updateOne(
        { _id: attemptId },
        {
          $set: {
            processed: true,
            note: "Intent not found or already processed",
            processedAt: new Date(),
          },
        }
      );

      return NextResponse.json({ ok: true }, { status: 200 });
    }

    /* ------------------------------------
       6️⃣ Resolve plan
    ------------------------------------ */
    const plan = PLANS.find((p) => p.id === intent.planId);
    if (!plan) {
      throw new Error("Invalid plan configuration");
    }

    const durationDays = plan.duration;
    const userId = intent.userId;

    /* ------------------------------------
       7️⃣ Decline other pending intents
    ------------------------------------ */
    await db.collection("payment_intents").updateMany(
      {
        userId,
        _id: { $ne: intent._id },
        status: { $ne: "success" },
      },
      {
        $set: {
          status: "declined",
          processedAt: new Date(),
        },
      }
    );

    /* ------------------------------------
       8️⃣ Approve this intent
    ------------------------------------ */
    await db.collection("payment_intents").updateOne(
      { _id: intent._id },
      {
        $set: {
          status: "success",
          processedAt: new Date(),
        },
      }
    );

    /* ------------------------------------
       9️⃣ Subscription stacking logic
    ------------------------------------ */
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

    /* ------------------------------------
       🔟 Update user record
    ------------------------------------ */
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

    /* ------------------------------------
       1️⃣1️⃣ Mark webhook processed
    ------------------------------------ */
    await db.collection("whop_webhook_attempts").updateOne(
      { _id: attemptId },
      {
        $set: {
          processed: true,
          processedAt: new Date(),
        },
      }
    );

    /* ------------------------------------
      🔟.5️⃣ Grant TradingView access
    ------------------------------------ */
    // const user = await db.collection("users").findOne({
    //   _id: new ObjectId(userId),
    // });

    //   if (user?.tradingviewUsername && user.tradingviewAccess !== "granted") {
    //     try {
          
    //       await grantTradingViewAccess(user.tradingviewUsername);
          
    //       await db.collection("users").updateOne(
    //         { _id: new ObjectId(userId) },
    //         {
    //           $set: {
    //             tradingviewAccess: "granted",
    //             tradingviewGrantedAt: new Date(),
    //           },
    //         }
    //       );
    //     } catch (tvError: any) {
    //       console.error("TradingView Grant Failed:", tvError);

    //       await db.collection("users").updateOne(
    //         { _id: new ObjectId(userId) },
    //         {
    //           $set: {
    //             tradingviewAccess: "failed",
    //             tradingviewError: tvError.message,
    //           },
    //         }
    //       );
    //     }
    //   }


    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Whop Webhook Error:", error);

    await db.collection("whop_webhook_attempts").insertOne({
      event,
      reference,
      payload: body,
      error: error.message,
      processed: false,
      failedAt: new Date(),
    });

    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { PLANS } from "@/lib/plans";

// // const SUCCESS_EVENTS = [
// //   "membership.went_active",
// //   "membership.activated",
// //   "payment.succeeded",
// //   "payment.completed",
// //   "subscription.activated",
// //   "subscription.went_active",
// //   "subscription.completed",
// //   "order.completed",
// //   "order.paid",
// //   "subscription.renewed",
// //   "subscription.reactivated",
// //   "membership.reactivated",
// //   "payment.processed",
// //   "order.processed",
// //   "membership.completed",
// //   "subscription.processed",
// //   "order.activated",
// //   "payment.activated",
// //   "membership.paid",
// //   "subscription.paid",
// //   "payment.paid",
// //   "order.succeeded",
// //   "payment.went_active",
// //   "subscription.completed",
// //   "membership.processed",
// //   "order.went_active",
// //   "payment.completed",
// //   "membership.activated",
// // ];

// const SUCCESS_EVENTS = new Set([
//   "membership.went_active",
//   "membership.activated",
//   "membership.reactivated",

//   "subscription.went_active",
//   "subscription.activated",
//   "subscription.completed",
//   "subscription.renewed",
//   "subscription.reactivated",

//   "payment.succeeded",
//   "payment.completed",
//   "payment.paid",
//   "payment.processed",

//   "order.completed",
//   "order.paid",
//   "order.succeeded",
// ]);


// export async function POST(req: NextRequest) {
//   const db = await getDatabase();
//   const receivedAt = new Date();

//   let body: any = null;
//   let event = "unknown";
//   let reference: string | undefined;

//   try {
//     body = await req.json();

//     event = body?.event ?? "unknown";
//     event = String(event || "unknown").toLowerCase();

//     reference = body?.data?.custom_id;

//     /* ------------------------------------
//        1️⃣ Log webhook attempt FIRST
//     ------------------------------------ */
//     const attemptId = await db.collection("whop_webhook_attempts").insertOne({
//       event,
//       reference,
//       payload: body,
//       headers: Object.fromEntries(req.headers.entries()),
//       processed: false,
//       createdAt: receivedAt,
//     });

//     /* ------------------------------------
//        2️⃣ Ignore non-success events
//     ------------------------------------ */
//     if (!SUCCESS_EVENTS.has(event)) {
//         await db.collection("whop_webhook_attempts").updateOne(
//           { _id: attemptId.insertedId },
//           {
//             $set: {
//               processed: true,
//               ignored: true,
//               ignoreReason: "Non-success event",
//               event,
//               processedAt: new Date(),
//             },
//           }
//         );

//         return NextResponse.json(
//           { ignored: true, event },
//           { status: 200 }
//         );
//     }

    

//     if (!reference) {
//       throw new Error("Missing data.custom_id");
//     }

//     /* ------------------------------------
//        3️⃣ Find payment intent
//     ------------------------------------ */
//     const intent = await db.collection("payment_intents").findOne({
//       reference,
//       status: { $in: ["pending", "initiated"] },
//     });

//     if (!intent) {
//       // Idempotent exit (already processed or invalid)
//       await db.collection("whop_webhook_attempts").updateOne(
//         { _id: attemptId.insertedId },
//         { $set: { processed: true, note: "Intent not found or already handled" } }
//       );

//       return NextResponse.json({ ok: true }, { status: 200 });
//     }

//     const plan = PLANS.find(p => p.id === intent.planId);
//     if (!plan) {
//       throw new Error("Invalid plan configuration");
//     }

//     /* ------------------------------------
//        4️⃣ Mirror admin approve logic
//     ------------------------------------ */
//     const durationDays = plan.duration;
//     const userId = intent.userId;

//     // Reject other intents
//     await db.collection("payment_intents").updateMany(
//       {
//         userId,
//         _id: { $ne: intent._id },
//         status: { $ne: "success" },
//       },
//       {
//         $set: {
//           status: "declined",
//           processedAt: new Date(),
//         },
//       }
//     );

//     // Approve intent
//     await db.collection("payment_intents").updateOne(
//       { _id: intent._id },
//       {
//         $set: {
//           status: "success",
//           processedAt: new Date(),
//         },
//       }
//     );

//     // Subscription stacking
//     const existingSub = await db.collection("subscriptions").findOne({
//       userId,
//       status: "active",
//     });

//     let startDate = new Date();
//     if (existingSub && existingSub.endDate > startDate) {
//       startDate = new Date(existingSub.endDate);
//     }

//     const endDate = new Date(startDate);
//     endDate.setDate(endDate.getDate() + durationDays);

//     await db.collection("subscriptions").updateOne(
//       { userId },
//       {
//         $set: {
//           userId,
//           planId: intent.planId,
//           amount: intent.amount,
//           status: "active",
//           startDate,
//           endDate,
//           updatedAt: new Date(),
//         },
//       },
//       { upsert: true }
//     );

//     await db.collection("users").updateOne(
//       { _id: new ObjectId(userId) },
//       {
//         $set: {
//           subscriptionStatus: "active",
//           subscriptionType: intent.planId,
//           subscriptionEndDate: endDate,
//         },
//       }
//     );

//     /* ------------------------------------
//        5️⃣ Mark webhook as processed
//     ------------------------------------ */
//     await db.collection("whop_webhook_attempts").updateOne(
//       { _id: attemptId.insertedId },
//       { $set: { processed: true, processedAt: new Date() } }
//     );

//     // console.log(`✅ Whop webhook processed for user ${userId}`);

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error: any) {
//     console.error("Whop Webhook Error:", error);

//     /* ------------------------------------
//        6️⃣ Store failure reason
//     ------------------------------------ */
//     await db.collection("whop_webhook_attempts").insertOne({
//       event,
//       reference,
//       payload: body,
//       error: error.message,
//       processed: false,
//       failedAt: new Date(),
//     });

//     return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { PLANS } from "@/lib/plans";

// const SUCCESS_EVENTS = [
  // "membership.went_active",
  // "membership.activated",
  // "payment.succeeded",
  // "payment.completed",
  // "subscription.activated",
  // "subscription.went_active",
  // "subscription.completed",
  // "order.completed",
  // "order.paid",
// ];

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { event, data } = body;

//     if (!SUCCESS_EVENTS.includes(event)) {
//       return NextResponse.json({ ignored: true }, { status: 200 });
//     }

//     const reference = data.custom_id;
//     if (!reference) {
//       return NextResponse.json({ error: "Missing custom_id" }, { status: 400 });
//     }

//     const db = await getDatabase();

//     /* ------------------------------------
//        1️⃣ Find pending intent
//     ------------------------------------ */
//     const intent = await db.collection("payment_intents").findOne({
//       reference,
//       status: { $in: ["pending", "initiated"] },
//     });

//     if (!intent) {
//       // Idempotency: already processed
//       return NextResponse.json({ ok: true }, { status: 200 });
//     }

//     const plan = PLANS.find(p => p.id === intent.planId);
//     if (!plan) {
//       throw new Error("Invalid plan");
//     }

//     const durationDays = plan.duration;
//     const userId = intent.userId;

//     /* ------------------------------------
//        2️⃣ Reject ALL other intents
//     ------------------------------------ */
//     await db.collection("payment_intents").updateMany(
//       {
//         userId,
//         _id: { $ne: intent._id },
//         status: { $ne: "success" },
//       },
//       {
//         $set: {
//           status: "declined",
//           processedAt: new Date(),
//         },
//       }
//     );

//     /* ------------------------------------
//        3️⃣ Approve this intent
//     ------------------------------------ */
//     await db.collection("payment_intents").updateOne(
//       { _id: intent._id },
//       {
//         $set: {
//           status: "success",
//           processedAt: new Date(),
//         },
//       }
//     );

//     /* ------------------------------------
//        4️⃣ Subscription stacking logic
//     ------------------------------------ */
//     const existingSub = await db.collection("subscriptions").findOne({
//       userId,
//       status: "active",
//     });

//     let startDate = new Date();
//     if (existingSub && existingSub.endDate > startDate) {
//       startDate = new Date(existingSub.endDate);
//     }

//     const endDate = new Date(startDate);
//     endDate.setDate(endDate.getDate() + durationDays);

//     /* ------------------------------------
//        5️⃣ Upsert subscription
//     ------------------------------------ */
//     await db.collection("subscriptions").updateOne(
//       { userId },
//       {
//         $set: {
//           userId,
//           planId: intent.planId,
//           amount: intent.amount,
//           status: "active",
//           startDate,
//           endDate,
//           updatedAt: new Date(),
//         },
//       },
//       { upsert: true }
//     );

//     /* ------------------------------------
//        6️⃣ Update user profile
//     ------------------------------------ */
//     await db.collection("users").updateOne(
//       { _id: new ObjectId(userId) },
//       {
//         $set: {
//           subscriptionStatus: "active",
//           subscriptionType: intent.planId,
//           subscriptionEndDate: endDate,
//         },
//       }
//     );

//     // console.log(`✅ Whop subscription activated for user ${userId}`);

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error("Whop Webhook Error:", error);
//     return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import { updateUserSubscription } from "@/lib/auth";
// import { PLANS } from "@/lib/plans";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { event, data } = body;

//     // We look for 'payment.succeeded' or 'membership.went_active' or 'membership.activated'
//     // Whop passes our UUID in the 'custom_id' field
//     if (event === "membership.went_active" || event === "payment.succeeded" || event === "membership.activated" || 
//       event === "payment.completed" || event === "subscription.activated" || event === "subscription.went_active" || 
//       event === "subscription.completed" || event === "order.completed" || event === "order.paid"
//     ) {
//       const reference = data.custom_id; 
//       const db = await getDatabase();

//       // 1. Find the pending intent in your DB
//       const intent = await db.collection("payment_intents").findOne({ 
//         reference: reference,
//         status: "pending" 
//       });

//       if (!intent) {
//         return NextResponse.json({ error: "Intent not found" }, { status: 404 });
//       }

//       // 2. Get the plan details to calculate duration
//       const planConfig = PLANS.find(p => p.id === intent.planId);
//       if (!planConfig) throw new Error("Plan config not found");

//       const durationDays = planConfig.duration;
//       const endDate = new Date();
//       endDate.setDate(endDate.getDate() + durationDays);

//       // 3. Update the User in the DB
//       await updateUserSubscription(intent.userId, {
//         subscriptionStatus: "active",
//         subscriptionType: intent.planId as any, // e.g., 'basic', 'premium'
//         subscriptionEndDate: endDate,
//         subscriptionStartDate: new Date(),
//       });

//       // 4. Mark intent as completed
//       await db.collection("payment_intents").updateOne(
//         { reference: reference },
//         { $set: { status: "completed", updatedAt: new Date() } }
//       );

//       // console.log(`✅ Subscription activated for user ${intent.userId}`);
//     }
//     else if (event === "membership.canceled" || event === "subscription.canceled") {
//       const reference = data.custom_id; 
//       const db = await getDatabase();

//       // Find the intent in your DB
//       const intent = await db.collection("payment_intents").findOne({ 
//         reference: reference 
//       });

//       if (!intent) {
//         return NextResponse.json({ error: "Intent not found" }, { status: 404 });
//       }

//       // Update the User in the DB to cancel subscription
//       // await updateUserSubscription(intent.userId, {
//       //   subscriptionStatus: "canceled",
//       //   subscriptionEndDate: new Date(),
//       // });

//       // console.log(`✅ Subscription canceled for user ${intent.userId}`);
//     }


//     return NextResponse.json({ received: true }, { status: 200 });
//   } catch (error) {
//     console.error("Webhook Error:", error);
//     return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
//   }
// }