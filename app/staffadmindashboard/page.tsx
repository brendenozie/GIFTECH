"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, MapPin, Fingerprint, Download, Map as MapIcon, 
  RefreshCcw, AlertCircle, ShieldCheck
} from "lucide-react";

export default function AttendanceAdminDashboard() {
  const [activeTab, setActiveTab] = useState("Live Attendance");
  const [viewMode, setViewMode] = useState("list"); 
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // --- REAL-TIME DATA STATE ---
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const HUB_COORDS = { lat: -1.286389, lng: 36.817223 };

  // --- API INTEGRATION ---
  const fetchLiveLogs = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/attendance/clock-in");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      
      // We map the API data to match your dashboard's preferred structure
      const formattedData = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "Active", 
        location: "Nairobi Hub", 
        lat: item.location.lat,
        lng: item.location.lng,
        image: item.image, // The actual Base64 selfie
        verified: true // If they made it to the list, they passed geofencing
      }));

      setAttendanceLogs(formattedData);
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsSyncing(false), 1000);
    }
  };

  // Initial fetch and Polling (every 10 seconds)
  useEffect(() => {
    fetchLiveLogs();
    const interval = setInterval(fetchLiveLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = useMemo(() => {
    return attendanceLogs.filter((log: any) => 
      log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, attendanceLogs]);

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
            <Fingerprint className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter uppercase underline decoration-indigo-500 decoration-4">HR <span className="text-indigo-600">Sync</span></span>
        </div>

        <nav className="flex-grow space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Workforce</p>
          {[
            { label: "Live Attendance", icon: Activity },
            { label: "Staff Directory", icon: ShieldCheck },
            { label: "Geofence Zones", icon: MapPin },
          ].map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.label ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "hover:bg-slate-50 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${activeTab === item.label ? "text-indigo-600" : "text-slate-400"}`} />
                <span className="text-sm font-bold">{item.label}</span>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow overflow-y-auto p-10">
        <header className="flex justify-between items-start mb-12">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{activeTab}</h1>
              {isSyncing && <RefreshCcw className="w-5 h-5 text-indigo-500 animate-spin" />}
            </div>
            <p className="text-slate-500 font-medium italic">Nairobi Tech Hub Perimeter Active</p>
          </div>
          
          <div className="flex items-center gap-4">
             <input 
              type="text" 
              placeholder="Search staff..." 
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-indigo-500"
              onChange={(e) => setSearchQuery(e.target.value)}
             />
             <div className="flex bg-slate-200 p-1 rounded-xl">
                <button onClick={() => setViewMode("list")} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "list" ? "bg-white shadow-sm" : "text-slate-500"}`}>List</button>
                <button onClick={() => setViewMode("map")} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "map" ? "bg-white shadow-sm" : "text-slate-500"}`}>Map</button>
             </div>
          </div>
        </header>

        {activeTab === "Live Attendance" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-slate-300">
                  <Activity className="w-8 h-8 text-indigo-200 animate-pulse mb-2" />
                  <p className="text-slate-400 text-sm font-medium">Initialising secure feed...</p>
                </div>
              ) : viewMode === "list" ? (
                <div className="rounded-[2.5rem] bg-white border border-slate-200 p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-black text-slate-900">Recent Verification Logs</h3>
                    <span className="text-[10px] font-black px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg uppercase tracking-wider">Live Feed</span>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredLogs.length > 0 ? filteredLogs.map((log: any) => (
                      <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 group hover:border-indigo-200 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-indigo-50 shadow-sm transition-transform group-hover:scale-105">
                            {/* Rendering the actual Base64 image from the API */}
                            <img src={log.image} alt="Selfie" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{log.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{log.email} • {log.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-900 uppercase">Perimeter</p>
                             <p className="text-[10px] text-emerald-500 font-bold">MATCHED</p>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                             <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12">
                        <AlertCircle className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-slate-400 text-sm font-medium">No active sessions found.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* MAP VIEW - Using the real log coordinates */
                <div className="rounded-[2.5rem] bg-slate-100 border border-slate-200 p-4 h-[600px] relative overflow-hidden shadow-inner">
                  <div className="w-full h-full bg-[#e5e7eb] rounded-[2rem] relative bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/36.8172,-1.2863,13,0/800x600?access_token=MOCK')] bg-cover">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 border-2 border-dashed border-indigo-400 rounded-full animate-pulse" />
                    {filteredLogs.map((log: any) => (
                      <motion.div
                        key={log.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute cursor-pointer group"
                        style={{ 
                          top: `${50 + (log.lat - HUB_COORDS.lat) * 2000}%`, 
                          left: `${50 + (log.lng - HUB_COORDS.lng) * 2000}%` 
                        }}
                      >
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl border-2 border-white shadow-2xl overflow-hidden bg-white group-hover:scale-125 transition-all">
                             <img src={log.image} className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* STATS PANEL */}
            <div className="space-y-6">
              <div className="rounded-[2.5rem] bg-indigo-900 p-8 text-white shadow-xl">
                 <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-400" /> Perimeter Status
                 </h3>
                 <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-black text-indigo-300 uppercase">Live Count</p>
                       <p className="text-3xl font-black">{attendanceLogs.length}</p>
                       <p className="text-[10px] text-indigo-100 mt-2 italic underline underline-offset-4">Verified Personnel In-Zone</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}