"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users2, 
  GraduationCap, 
  ShieldAlert, 
  Globe, 
  DollarSign, 
  TrendingUp,
  MoreHorizontal,
  Check,
  X
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 font-sans">
      
      {/* --- REFINED ADMIN SIDEBAR --- */}
      <aside className="w-72 bg-[#020617] border-r border-slate-800/50 p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">GIF <span className="text-blue-500">Tech</span></span>
        </div>

        <nav className="flex-grow space-y-1">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Operations</p>
          {[
            { label: "Global Insights", icon: BarChart3, active: true },
            { label: "Scholarship Portal", icon: GraduationCap, count: 12 },
            { label: "Faculty Management", icon: Users2 },
            { label: "Revenue & Billing", icon: DollarSign },
            { label: "System Security", icon: ShieldAlert },
          ].map((item) => (
            <button 
              key={item.label}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                item.active ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "hover:bg-slate-900 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-bold">{item.label}</span>
              </div>
              {item.count && (
                <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-black">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400">SERVER STATUS: OPTIMAL</span>
          </div>
          <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors">
            System Logs
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-grow overflow-y-auto p-10">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Global Operations</h1>
            <p className="text-slate-500 font-medium">Real-time health of the GIFTECH ecosystem.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="h-10 w-10 rounded-full border-4 border-[#020617] bg-slate-800" />
               ))}
             </div>
             <button className="h-12 px-6 rounded-xl bg-white text-slate-950 font-black text-sm hover:bg-blue-500 hover:text-white transition-all">
               Generate Global Report
             </button>
          </div>
        </header>

        {/* High-Level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Active Enrolled", val: "14,208", up: "+12%", color: "text-blue-400" },
            { label: "Total Revenue", val: "$428.5k", up: "+8.4%", color: "text-emerald-400" },
            { label: "Scholarship Burn", val: "$82.1k", up: "-2%", color: "text-rose-400" },
            { label: "Avg. Lab Completion", val: "78.4%", up: "+5%", color: "text-purple-400" },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-[2rem] bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                <TrendingUp className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-3xl font-black text-white mb-1">{stat.val}</p>
              <p className={`text-xs font-bold ${stat.color}`}>{stat.up} <span className="text-slate-600 ml-1">vs last month</span></p>
            </div>
          ))}
        </div>

        {/* Scholarship Approval Queue & Regional Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Scholarship Approval Table */}
          <div className="lg:col-span-2 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/50 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-white">Pending Scholarships</h3>
              <button className="text-xs font-bold text-blue-400 hover:underline">View All Applications</button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Kofi Mensah", region: "Ghana", score: 94, project: "Solar Irrigation" },
                { name: "Amina Juma", region: "Tanzania", score: 88, project: "Smart Grid Hub" },
                { name: "Zaidu Oki", region: "Nigeria", score: 91, project: "Robo-Aide V1" },
              ].map((app, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800/30 group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center font-black text-blue-400 text-xs">
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{app.name}</p>
                      <p className="text-[10px] font-medium text-slate-500">{app.region} • Merit Score: {app.score}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all">
                      <X className="w-4 h-4" />
                    </button>
                    <button className="h-8 w-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Growth / System Load */}
          <div className="rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-900 p-8 text-white">
            <h3 className="text-lg font-black mb-6">Regional Node Health</h3>
            
            <div className="space-y-6 mt-6">
              {[
                { city: "Nairobi Hub", load: "84%", color: "bg-emerald-400" },
                { city: "Lagos Hub", load: "92%", color: "bg-amber-400" },
                { city: "Accra Node", load: "45%", color: "bg-blue-400" },
              ].map((node, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{node.city}</span>
                    <span>{node.load} Capacity</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: node.load }}
                      className={`h-full ${node.color}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}