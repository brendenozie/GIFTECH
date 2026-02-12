"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, MapPin, Fingerprint, Download, Map as MapIcon, 
  RefreshCcw, AlertCircle, ShieldCheck, UserCheck, Search,
  Loader2,
  Clock
} from "lucide-react";

export default function AttendanceAdminDashboard() {
  const [activeTab, setActiveTab] = useState("Live Attendance");
  const [viewMode, setViewMode] = useState("list"); 
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Nairobi Hub Center Point
  const HUB_COORDS = { lat: -1.286389, lng: 36.817223 };

  const fetchLiveLogs = async () => {
    try {
      setIsSyncing(true);
      // Ensure this endpoint matches your route path exactly
      const res = await fetch("/api/attendance/student-in");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      
      const formattedData = data.map((item: any) => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        name: item.name,
        email: item.email,
        time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "Active", 
        location: "Main Campus", 
        lat: item.location.lat,
        lng: item.location.lng,
        verified: true 
      }));

      setAttendanceLogs(formattedData);
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  useEffect(() => {
    fetchLiveLogs();
    const interval = setInterval(fetchLiveLogs, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = useMemo(() => {
    return attendanceLogs.filter((log: any) => 
      log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, attendanceLogs]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col hidden lg:flex">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Fingerprint className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">
            Campus<span className="text-indigo-600">Sync</span>
          </span>
        </div>

        <nav className="flex-grow space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Operations</p>
          {[
            { label: "Live Attendance", icon: Activity },
            { label: "Staff Directory", icon: ShieldCheck },
            { label: "Geofence Zones", icon: MapPin },
          ].map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.label ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "hover:bg-slate-50 text-slate-500"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow overflow-y-auto p-4 lg:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{activeTab}</h1>
              {isSyncing && <RefreshCcw className="w-5 h-5 text-indigo-500 animate-spin" />}
            </div>
            <p className="text-slate-500 text-sm font-medium">Monitoring active school perimeter</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-grow">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                type="text" 
                placeholder="Search students..." 
                className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm w-full focus:ring-2 ring-indigo-500/20 outline-none"
                onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
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
                <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-dashed border-slate-300">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                  <p className="text-slate-400 text-sm font-medium">Syncing live database...</p>
                </div>
              ) : (
                <div className="rounded-[2rem] bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {filteredLogs.length > 0 ? filteredLogs.map((log: any) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={log.id} 
                          className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:border-indigo-200 hover:bg-white transition-all shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-inner">
                              {log.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{log.name}</p>
                              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {log.time} • Arrived
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                               <p className="text-[10px] font-black text-slate-400 uppercase">Status</p>
                               <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                                 <UserCheck className="w-3 h-3" /> IN ZONE
                               </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                               <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                          </div>
                        </motion.div>
                      )) : (
                        <div className="text-center py-20">
                          <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                          <p className="text-slate-500 font-bold">No students currently in the compound.</p>
                          <p className="text-slate-400 text-xs mt-1">Check back once the morning session starts.</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            {/* SIDE STATS */}
            <div className="space-y-6">
              <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl relative overflow-hidden">
                 <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
                 <h3 className="text-lg font-black mb-6 flex items-center gap-2 relative z-10">
                    <Activity className="w-5 h-5 text-indigo-400" /> Attendance Overview
                 </h3>
                 <div className="space-y-4 relative z-10">
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                       <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Logged Students</p>
                       <div className="flex items-baseline gap-2">
                         <p className="text-5xl font-black">{attendanceLogs.length}</p>
                         <p className="text-indigo-400 font-bold text-sm">active</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-[10px] font-bold text-slate-400">On Time</p>
                          <p className="text-xl font-black text-emerald-400">92%</p>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-[10px] font-bold text-slate-400">Total Alerts</p>
                          <p className="text-xl font-black text-amber-400">0</p>
                       </div>
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