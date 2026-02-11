"use client";

import React, { useRef, useState, useEffect } from "react";
import { MapPin, ShieldCheck, Loader2, RefreshCcw, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MobileClockIn() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"idle" | "verifying" | "success">("idle");
  const [streamActive, setStreamActive] = useState(false);
  const router = useRouter(); 

  // Auto-start camera on mount for better mobile UX
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

  //navigate to dashboard
  // useEffect(() => {
  //   if (status === "success") {
  //     const timer = setTimeout(() => {
  //       //actual navigation logic (e.g., using Next.js router)
  //       router.push("/staffadmindashboard");
        
  //     }, 2000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [status]);

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
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-sm mx-auto p-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Morning, Alex</h1>
        <p className="text-slate-500 text-sm font-medium">Ready to start your shift?</p>
      </div>

      {/* Biometric Scanning Circle */}
      <div className="relative group">
        {/* Animated Outer Ring */}
        <div className={`absolute -inset-4 rounded-full opacity-20 blur-lg transition-colors duration-500 ${
          status === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
        } ${status === 'verifying' ? 'animate-pulse' : ''}`} />
        
        <div className={`relative w-64 h-64 rounded-full border-4 overflow-hidden bg-slate-100 transition-all duration-500 ${
          status === 'success' ? 'border-emerald-500' : 'border-white shadow-2xl'
        }`}>
          {!streamActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
            </div>
          )}
          
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className={`w-full h-full object-cover transition-opacity duration-500 ${status === 'success' ? 'opacity-40' : 'opacity-100'}`}
          />
          
          <canvas ref={canvasRef} width="400" height="400" className="hidden" />

          {/* Scanning Animation Overlay */}
          {status === 'verifying' && (
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent animate-scan-line border-t-2 border-blue-400" />
          )}

          {/* Success Overlay */}
          {status === 'success' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-500/10">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 animate-in zoom-in duration-300" />
            </div>
          )}
        </div>

        {/* Floating Location Badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full shadow-lg border border-slate-100 flex items-center gap-2 whitespace-nowrap">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[11px] font-bold text-slate-700 tracking-wide uppercase">HQ Office • Zone A</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 w-full space-y-4">
        <button
          onClick={handleVerify}
          disabled={status !== "idle" || !streamActive}
          className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-xl ${
            status === 'success' 
            ? 'bg-emerald-500' 
            : 'bg-slate-900 hover:bg-black shadow-slate-200'
          }`}
        >
          {status === "verifying" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : status === "success" ? (
            "Clocked In Successfully"
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Confirm Identity
            </>
          )}
        </button>

        <button 
          onClick={() => window.location.reload()}
          className="w-full py-3 flex items-center justify-center gap-2 text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Retry Camera
        </button>
      </div>
    </div>
  );
}