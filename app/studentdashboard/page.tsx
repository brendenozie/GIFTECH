"use client";

import { motion } from "framer-motion";
import { 
  Rocket, 
  Cpu, 
  BookOpen, 
  Play, 
  Code2, 
  Zap, 
  Terminal as TerminalIcon, 
  Wifi, 
  Box, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function StudentDashboard() {
  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 font-sans">
      
      {/* --- MINIMALIST SIDEBAR --- */}
      <aside className="w-20 lg:w-64 bg-[#020617] border-r border-slate-800/50 flex flex-col items-center lg:items-start p-6">
        <div className="flex items-center gap-3 mb-12 lg:px-2">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <span className="hidden lg:block text-xl font-black text-white tracking-tighter italic">MISSION<span className="text-emerald-500">CONTROL</span></span>
        </div>

        <nav className="flex-grow space-y-4 w-full">
          {[
            { label: "Overview", icon: Zap, active: true },
            { label: "Current Lab", icon: Code2 },
            { label: "Curriculum", icon: BookOpen },
            { label: "Hardware", icon: Cpu },
          ].map((item) => (
            <button 
              key={item.label}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-2xl transition-all group ${
                item.active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "hover:bg-slate-900 text-slate-500"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden lg:block text-sm font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto w-full lg:p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
             <span className="hidden lg:block text-[10px] font-black text-slate-500 uppercase">Profile</span>
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-800" />
            <div className="hidden lg:block overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Ibrahim Yusuf</p>
              <p className="text-[10px] text-slate-500">Phase 02 Student</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN DASHBOARD AREA --- */}
      <main className="flex-grow overflow-y-auto p-6 lg:p-10">
        
        {/* Welcome & Progress Overview */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-[0.2em]">
              <Box className="w-4 h-4" />
              Deployment Active
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Phase 02: The Hardware Bridge</h1>
            <p className="text-slate-500 font-medium">You are 65% through this phase. Keep the momentum!</p>
          </div>
          <div className="flex gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-600 uppercase">Current Streak</p>
              <p className="text-xl font-black text-white">12 Days 🔥</p>
            </div>
            <button className="px-8 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              Resume Lab
            </button>
          </div>
        </header>

        {/* Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ACTIVE MISSION CARD (Main Focus) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="group relative p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Code2 className="w-40 h-40 text-white" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                   <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                     Active Lab: L3.4
                   </div>
                   <span className="text-xs text-slate-500 font-medium">Est. completion: 45 mins</span>
                </div>
                
                <h2 className="text-3xl font-black text-white mb-4">Interfacing Ultrasonic Sensors <br /> with Python Middleware</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl">
                  Connect your HC-SR04 sensor and write a script to calculate distance using sound-wave timing.
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <TerminalIcon className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold">IDE Ready</span>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <Wifi className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-bold">Bridge Connected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CURRICULUM TIMELINE (Mini) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Upcoming: Logic Gates", status: "locked", icon: Box },
                { title: "Completed: Circuitry 101", status: "done", icon: CheckCircle2 },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/50 flex items-center justify-between group cursor-pointer hover:bg-slate-900 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${item.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className={`font-bold ${item.status === 'done' ? 'text-slate-400' : 'text-slate-500'}`}>{item.title}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* HARDWARE STATUS (Side Panel) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700">
              <h3 className="font-black text-white mb-6 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                Hardware Node v2.1
              </h3>
              
              <div className="space-y-6">
                {/* Node Image Placeholder */}
                <div className="aspect-square rounded-2xl bg-black/40 flex items-center justify-center border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent opacity-50" />
                  
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Connection</span>
                    <span className="text-xs font-black text-emerald-400 tracking-widest uppercase">Stable (14ms)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "90%" }} className="h-full bg-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                    <p className="text-[10px] font-black text-slate-600 mb-1">VOLTAGE</p>
                    <p className="text-sm font-black text-white">5.02V</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                    <p className="text-[10px] font-black text-slate-600 mb-1">TEMP</p>
                    <p className="text-sm font-black text-white">32°C</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-blue-600 flex items-center justify-between group cursor-pointer overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-white/60 mb-1">HAVE QUESTIONS?</p>
                <p className="text-sm font-black text-white">Ask your Mentor</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
              <Zap className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}