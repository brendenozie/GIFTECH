"use client";
import React, { useState, useEffect } from "react";
import { MapPin, Loader2, CheckCircle2, Clock, Navigation, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MobileClockIn() {
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [secondsInSchool, setSecondsInSchool] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const hasVerified = React.useRef(false);

useEffect(() => {
  if (!hasVerified.current) {
    hasVerified.current = true;
    handleVerify();
  }
}, []);

const handleVerify = async () => {
  try {
    setStatus("verifying");

    if (!("geolocation" in navigator)) {
      throw new Error("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch("/api/attendance/student-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              coords: {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              },
              userDetails: {
                name: "Alex Johnson",
                email: "alex.johnson@example.com",
              },
              action: "clock-in",
            }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Verification failed");
          }

          setStatus("success");
        } catch (err: any) {
          setStatus("error");
          setErrorMsg(err.message || "Server error");
        }
      },
      (err) => {
        setStatus("error");
        setErrorMsg(err.message || "Location denied");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  } catch (err: any) {
    setStatus("error");
    setErrorMsg(err.message);
  }
};

// 2. STAY-TIMER LOGIC
  useEffect(() => {
    let interval: any;
    if (status === "success") {
      interval = setInterval(() => setSecondsInSchool(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (s: number) => new Date(s * 1000).toISOString().substr(11, 8);

  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-white flex flex-col items-center justify-center p-6 text-center">
      
      {/* Visual Radar / Timer Circle */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        
        {/* Background Decorative Rings */}
        <div className="absolute inset-0 border border-slate-800 rounded-full scale-100" />
        <div className="absolute inset-0 border border-slate-800 rounded-full scale-75" />

        {/* Progress Ring */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="128" cy="128" r="110"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-slate-800"
          />
          {status === "success" && (
            <circle
              cx="128" cy="128" r="110"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={691}
              strokeDashoffset={691 - (691 * (secondsInSchool % 60)) / 60}
              className="text-emerald-500 transition-all duration-1000 ease-linear"
            />
          )}
        </svg>

        {/* Center Content */}
        <div className="z-10 flex flex-col items-center">
          {status === "verifying" && (
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
              <Navigation className="w-12 h-12 text-blue-500 animate-pulse" />
            </div>
          )}

          {status === "success" && (
            <>
              <Clock className="w-8 h-8 text-emerald-400 mb-2" />
              <span className="text-4xl font-mono font-bold tabular-nums">
                {formatTime(secondsInSchool)}
              </span>
              <div className="flex items-center gap-1 mt-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                On Campus
              </div>
            </>
          )}

          {status === "error" && (
            <div className="text-red-400">
              <MapPin className="w-10 h-10 mx-auto mb-2" />
              <p className="text-xs font-bold uppercase">Out of Range</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Text Area */}
      <div className="mt-12 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {status === "verifying" && "Scanning Location..."}
          {status === "success" && "Arrival Confirmed"}
          {status === "error" && "Access Denied"}
        </h2>
        <p className="text-slate-400 text-sm max-w-[200px] mx-auto">
          {status === "verifying" && "Syncing with school geofence..."}
          {status === "success" && "SMS sent to parents successfully."}
          {status === "error" && errorMsg}
        </p>
      </div>

      {status === "error" && (
        <button 
          onClick={handleVerify}
          className="mt-8 flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-bold text-sm"
        >
          <RefreshCcw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );
}