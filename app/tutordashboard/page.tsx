"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  Play, 
  Code2,
  Filter,
  Search,
  ExternalLink
} from "lucide-react";

export default function TutorDashboard() {
  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* --- TUTOR SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tight">TUTOR<span className="text-emerald-600">HUB</span></span>
        </div>

        <nav className="flex-grow space-y-1">
          {[
            { label: "Grading Queue", icon: Clock, active: true, count: 8 },
            { label: "Live Lab Monitor", icon: Play },
            { label: "Student Directory", icon: Users },
            { label: "Direct Messages", icon: MessageSquare, count: 3 },
            { label: "Resource Library", icon: Code2 },
          ].map((item) => (
            <button 
              key={item.label}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                item.active ? "bg-emerald-50 text-emerald-700 shadow-sm" : "hover:bg-slate-50 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-bold">{item.label}</span>
              </div>
              {item.count && (
                <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-black">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 rounded-2xl bg-slate-900 text-white">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Session</p>
          <p className="text-xs font-bold mb-4">Phase 02: Hardware Bridge</p>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => <div key={i} className="h-6 w-6 rounded-full border-2 border-slate-900 bg-slate-700" />)}
            </div>
            <span className="text-[10px] font-bold">+14 Online</span>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow overflow-y-auto p-10">
        
        {/* Header with Search */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-black text-slate-900 italic">&quot;The Lab is Live.&quot;</h1>
            <p className="text-slate-500 text-sm font-medium">8 submissions pending review • 2 students flagged for help</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search students..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <button className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50">
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </header>

        {/* Priority Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* GRADING QUEUE */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Pending Submissions</h3>
              <span className="text-[10px] font-bold text-slate-400">Sort by: Oldest First</span>
            </div>
            
            {[
              { name: "Fatima Zahra", lab: "L3: Ultrasonic Mapping", time: "14m ago", status: "submitted", urgency: "low" },
              { name: "David Chen", lab: "L5: Servo Synchronization", time: "2h ago", status: "resubmitted", urgency: "medium" },
              { name: "Samuel Okon", lab: "L1: GPIO Logic Gates", time: "4h ago", status: "flagged", urgency: "high" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      {item.name}
                      {item.urgency === 'high' && <AlertCircle className="w-3 h-3 text-rose-500" />}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">{item.lab} • <span className="text-emerald-600">{item.time}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition-colors">
                    Review Code
                  </button>
                  <button className="p-2 rounded-lg border border-slate-100 text-slate-400 hover:text-slate-600">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* REAL-TIME LAB TELEMETRY */}
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest px-2">Live Lab Telemetry</h3>
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-emerald-400">Active Sensors</p>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                
                {/* Visual Telemetry Chart Placeholder */}
                

                <div className="space-y-3">
                  {[
                    { label: "Active Connections", val: "148" },
                    { label: "Average Latency", val: "12ms" },
                    { label: "Compiler Errors", val: "32" },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs text-slate-400 font-bold">{stat.label}</span>
                      <span className="text-sm font-black text-white">{stat.val}</span>
                    </div>
                  ))}
                </div>
                
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black transition-all border border-white/10 uppercase tracking-widest">
                  Enter Visual Debugger
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Student Progress Heatmap */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-900">Curriculum Progression Heatmap</h3>
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-sm bg-slate-100" />
              <span className="h-3 w-3 rounded-sm bg-emerald-200" />
              <span className="h-3 w-3 rounded-sm bg-emerald-400" />
              <span className="h-3 w-3 rounded-sm bg-emerald-600" />
            </div>
          </div>
          
        </div>

      </main>
    </div>
  );
}