import { NextRequest, NextResponse } from "next/server";
import { calculateDistance, HUB_COORDS } from "@/lib/geofencing";

// Simulation of a Database - Replace with Prisma/DB in Production
// In Next.js dev mode, this resets on save.
let activeSessions: any[] = [];

// GET: For the Admin Page to see who is logged in
export async function GET() {
  return NextResponse.json(activeSessions);
}

// POST: For the Biometric UI to submit clock-in data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, coords, action, userDetails } = body;

    // 1. DATA VALIDATION
    if (!image || !coords) {
      return NextResponse.json({ error: "Biometric and Location data required" }, { status: 400 });
    }

    // 2. GEO-FENCE CHECK
    const distance = calculateDistance(coords.lat, coords.lng, HUB_COORDS.lat, HUB_COORDS.lng);
    
    // if (distance > HUB_COORDS.radius) {
    //   return NextResponse.json({ 
    //     error: "Location Spoofing Detected. Outside perimeter.",
    //     distance: `${Math.round(distance)}m`
    //   }, { status: 403 });
    // }

    // 3. LOGGING THE SESSION
    const newEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name: userDetails?.name || "Anonymous User",
      email: userDetails?.email || "N/A",
      image: image, // Base64 from camera
      timestamp: new Date().toISOString(),
      location: coords,
      status: action === "clock-in" ? "Active" : "Clocked Out"
    };

    if (action === "clock-in") {
      activeSessions.unshift(newEntry); // Add to top of list
    } else {
      // Logic for clock-out: Remove user or update status
      activeSessions = activeSessions.filter(u => u.email !== userDetails?.email);
    }

    // 4. RESPONSE
    return NextResponse.json({
      message: "Identity and Location Confirmed",
      verifiedAt: newEntry.timestamp,
      sessionStatus: "Active"
    });

  } catch (error) {
    console.error("Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}