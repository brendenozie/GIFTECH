"use client";

import React, { useRef, useState, useEffect } from "react";
import { MapPin, ShieldCheck, Loader2, RefreshCcw, CheckCircle2, Camera } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MobileClockIn() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"idle" | "verifying" | "success">("idle");
  const [streamActive, setStreamActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 400, height: 400 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      }
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

   const handleVerify = async () => {
    setStatus("verifying");
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext("2d");
        context?.drawImage(videoRef.current, 0, 0, 400, 400);
        const imageData = canvasRef.current.toDataURL("image/jpeg");

        const res = await fetch("/api/attendance/clock-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image: imageData, // Base64 photo
              coords: { lat: pos.coords.latitude, lng: pos.coords.longitude }, // Geolocation
              userDetails: { name: "Alex Johnson", email: "alex.johnson@example.com" },
              action: "clock-in"
            }),
          });

          const data = await res.json();
          if (res.ok){
             alert("Identity & Location Verified!");
             //naviagete to dashboard or show success state
              //actual navigation logic (e.g., using Next.js router)
              //close camera stream
              if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
              }
              router.push("/tutordashboard");
                          
            }else{
               alert(`Failed: ${data.error}`);
               setStatus("idle");
              }
      }
    }, (err) => {
        setStatus("idle");
        alert("Please enable location services.");
    });
  };


  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-100 rounded-full blur-[120px] opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-emerald-100 rounded-full blur-[120px] opacity-60" />

      <div className="w-full max-w-sm z-10">
        {/* Header Section */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Morning, <span className="text-blue-600">Alex</span>
          </h1>
          <p className="text-slate-500 font-medium">Position your face within the frame</p>
        </div>

        {/* Biometric Scanning Container */}
        <div className="relative flex justify-center">
          
          {/* Outer Glow Ring */}
          <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 scale-110 ${
            status === 'success' ? 'bg-emerald-400/30' : 'bg-blue-400/20'
          } ${status === 'verifying' ? 'animate-pulse' : ''}`} />
          
          <div className={`relative w-72 h-72 rounded-full p-2 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 ${
            status === 'success' ? 'ring-4 ring-emerald-500' : 'ring-1 ring-slate-200'
          }`}>
            
            <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-50 group">
              {!streamActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 z-20 bg-slate-50">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">Initializing...</span>
                </div>
              )}
              
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className={`w-full h-full object-cover grayscale-[20%] transition-all duration-700 ${
                    status === 'success' ? 'scale-110 opacity-50 blur-sm' : 'scale-100'
                }`}
              />
              
              <canvas ref={canvasRef} width="400" height="400" className="hidden" />

              {/* Viewfinder Brackets */}
              <div className="absolute inset-8 border-2 border-white/30 rounded-3xl pointer-events-none">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500" />
              </div>

              {/* Scanning Line Animation */}
              {status === 'verifying' && (
                <div className="absolute inset-0 z-10 overflow-hidden">
                  <div className="w-full h-[2px] bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-scan-move" />
                </div>
              )}

              {/* Success Content */}
              {status === 'success' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-50/40 backdrop-blur-[2px] z-30">
                  <div className="bg-white p-4 rounded-full shadow-lg">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
                  </div>
                  <span className="mt-4 font-bold text-emerald-700">Verified</span>
                </div>
              )}
            </div>
          </div>

          {/* Location Badge - Glassmorphism style */}
          <div className="absolute -bottom-4 bg-white/80 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xl border border-white flex items-center gap-2.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-700 tracking-tight">HQ • ZONE A</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-16 space-y-4">
          <button
            onClick={handleVerify}
            disabled={status !== "idle" || !streamActive}
            className={`w-full py-5 rounded-[24px] font-bold text-[17px] transition-all duration-300 transform active:scale-[0.97] flex items-center justify-center gap-3 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.15)] ${
              status === 'success' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-200'
            }`}
          >
            {status === "verifying" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying Identity...
              </>
            ) : status === "success" ? (
                "Redirecting..."
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Clock In Now
              </>
            )}
          </button>

          <button 
            onClick={() => window.location.reload()}
            className="w-full py-2 flex items-center justify-center gap-2 text-slate-400 text-sm font-semibold hover:text-blue-500 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset Camera
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(288px); }
        }
        .animate-scan-move {
          animation: scan-move 2s linear infinite;
        }
      `}</style>
    </div>
  );
}