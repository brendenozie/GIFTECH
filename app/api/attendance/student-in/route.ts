import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const SCHOOL_COORDS = {
  lat: 6.5244, 
  lng: 3.3792,
  radius: 200, // meters
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

let activeSessions: any[] = [];

// GET: For the Admin Page to see who is logged in
export async function GET() {
  return NextResponse.json(activeSessions);
}

export async function POST(req: NextRequest) {
  try {
    const { coords, userDetails, action } = await req.json();

    // 1. Check Geofence
    const distance = calculateDistance(coords.lat, coords.lng, SCHOOL_COORDS.lat, SCHOOL_COORDS.lng);
    
    // if (distance > SCHOOL_COORDS.radius) {
    //   return NextResponse.json({ error: "You are outside the school zone." }, { status: 403 });
    // }

    if (action === "clock-in") {
      activeSessions.unshift(userDetails); // Add to top of list
    } else {
      // Logic for clock-out: Remove user or update status
      activeSessions = activeSessions.filter(u => u.email !== userDetails?.email);
    }

    // 2. Trigger Twilio SMS
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    try {
      await client.messages.create({
        body: `[SCHOOL LOG] ${userDetails.name} has arrived at school (${time}). Safe and sound!`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: "+254706448146" // This should be fetched from your DB based on userDetails.email
      });
    } catch (smsErr) {
      console.error("Twilio failed, but logging arrival anyway.");
    }

    // 3. Return Success
    return NextResponse.json({ success: true, arrivedAt: time });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}