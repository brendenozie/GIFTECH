"use client";

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
  ExternalLink,
  Activity,
  ChevronRight,
  User, CheckCircle2, 
  Terminal, Zap, MoreHorizontal, Globe,
   Mail, Award, 
  TrendingUp, BookOpen, GraduationCap,
   Send, Paperclip, MoreVertical, 
   CheckCheck, Circle, Phone, 
  Video, Info, FileText, PlayCircle, Archive, 
  Download, Plus, FolderOpen, 
  Cpu, Layout, HardDrive, Share2
} from "lucide-react";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TutorDashboard() {
  const [activeTab, setActiveTab] = useState("Grading Queue");
  const [searchQuery, setSearchQuery] = useState("");
  
    const resources = [
      { id: 1, title: "ESP32 Pinout Guide", type: "PDF", size: "2.4 MB", category: "Hardware", date: "Feb 01, 2026" },
      { id: 2, title: "I2C Communication Protocol", type: "Video", size: "45 MB", category: "Lecture", date: "Jan 28, 2026" },
      { id: 3, title: "Standard Logic Gates Template", type: "Code", size: "12 KB", category: "Firmware", date: "Feb 05, 2026" },
      { id: 4, title: "Lab 05: Servo Calibration", type: "PDF", size: "1.1 MB", category: "Curriculum", date: "Jan 15, 2026" },
      { id: 5, title: "Nairobi Node Firmware v2.1", type: "Zip", size: "8.2 MB", category: "System", date: "Feb 09, 2026" },
    ];
  
    const [events, setEvents] = useState([
      { id: 1, student: "Fatima Zahra", action: "Compiled L3_Logic.ino", status: "success", time: "Just now" },
      { id: 2, student: "David Chen", action: "Serial Monitor Timeout", status: "error", time: "2m ago" },
      { id: 3, student: "Samuel Okon", action: "Uploading to ESP32...", status: "pending", time: "5m ago" },
    ]);

     const students = [
    { 
      id: 1, 
      name: "Fatima Zahra", 
      email: "f.zahra@giftech.edu",
      track: "Embedded Systems", 
      grade: 94, 
      labs: 12, 
      totalLabs: 15,
      performance: "Exceeding",
      status: "Active"
    },
    { 
      id: 2, 
      name: "David Chen", 
      email: "d.chen@giftech.edu",
      track: "Cloud Infrastructure", 
      grade: 88, 
      labs: 10, 
      totalLabs: 15,
      performance: "Consistent",
      status: "Active"
    },
    { 
      id: 3, 
      name: "Samuel Okon", 
      email: "s.okon@giftech.edu",
      track: "Hardware Security", 
      grade: 76, 
      labs: 6, 
      totalLabs: 15,
      performance: "Needs Focus",
      status: "Flagged"
    },
    { 
      id: 4, 
      name: "Amina Juma", 
      email: "a.juma@giftech.edu",
      track: "Robotics & AI", 
      grade: 98, 
      labs: 15, 
      totalLabs: 15,
      performance: "Distinction",
      status: "Active"
    },
  ];
  
    // --- REAL-TIME SIMULATION ---
    // This effect simulates new events popping into the feed
    useEffect(() => {
      const interval = setInterval(() => {
        const newEvent = {
          id: Date.now(),
          student: ["Amina J.", "Kofi M.", "Zaidu O."][Math.floor(Math.random() * 3)],
          action: ["Modified loop()", "Reset Hardware", "Library Sync"][Math.floor(Math.random() * 3)],
          status: Math.random() > 0.3 ? "success" : "pending",
          time: "Just now"
        };
        setEvents(prev => [newEvent, ...prev.slice(0, 5)]);
      }, 8000);
      return () => clearInterval(interval);
    }, []);


    const [message, setMessage] = useState("");
    const [activeChat, setActiveChat] = useState(0);
  
    const contacts = [
      { id: 0, name: "Fatima Zahra", status: "online", lastMsg: "Thanks for the feedback on L3!", time: "2m ago", unread: 0 },
      { id: 1, name: "Samuel Okon", status: "offline", lastMsg: "Stuck on the I2C address again.", time: "1h ago", unread: 2 },
      { id: 2, name: "David Chen", status: "online", lastMsg: "Does the baud rate matter here?", time: "3h ago", unread: 0 },
    ];
  
    const chatHistory = [
      { sender: "tutor", text: "Hey Fatima, I noticed your logic gates in Lab 3 were very efficient. Great work.", time: "10:15 AM" },
      { sender: "student", text: "Thank you! I was trying to minimize the propagation delay.", time: "10:16 AM" },
      { sender: "tutor", text: "It shows. I've approved the submission. Ready for Lab 4?", time: "10:18 AM" },
      { sender: "student", text: "Almost, just reviewing the documentation now. Thanks for the feedback on L3!", time: "10:20 AM" },
    ];

    
  
  return (
    /* Soft slate-50 background for subtle contrast against white cards */
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900">
      
      {/* --- TUTOR SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-100">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tight uppercase">Tutor<span className="text-emerald-600">Hub</span></span>
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
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                item.active 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50" 
                  : "hover:bg-slate-50 text-slate-500 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${item.active ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"}`} />
                <span className="text-sm font-bold">{item.label}</span>
              </div>
              {item.count && (
                <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-black shadow-sm">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Improved Session Card for Light Mode */}
        <div className="mt-auto p-5 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Live Session</p>
          <p className="text-xs font-bold mb-4 leading-tight">Phase 02: Hardware Bridge Protocols</p>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="h-7 w-7 rounded-full border-2 border-slate-900 bg-slate-700 ring-2 ring-emerald-500/20" />
              ))}
            </div>
            <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md tracking-tighter">+14 ONLINE</span>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow overflow-y-auto p-10">
        
        {/* Header with Greeting */}
        
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{activeTab}</h1>
            <div className="flex items-center gap-2 mt-1">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-slate-500 text-sm font-medium">14 Students currently connected to the Hardware Bridge</p>
            </div>
          </div>
          <div className="flex gap-2">
             <button className="h-10 px-4 rounded-xl bg-slate-900 text-white text-xs font-black flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Broadcast to All
             </button>
          </div>
        </header>

        {/* <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">
              &quot;The Lab is Live.&quot;
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                <Clock className="w-3 h-3" /> 8 submissions pending
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1 text-rose-500 text-sm font-bold">
                <AlertCircle className="w-3 h-3" /> 2 students flagged
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-72 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search students or labs..." 
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm" 
              />
            </div>
            <button className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </header> */}

        {activeTab === "Grading Queue" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              
              <div className="lg:col-span-2 space-y-5">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Pending Submissions</h3>
                  <button className="text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-widest">View All</button>
                </div>
                
                {[
                  { name: "Fatima Zahra", lab: "L3: Ultrasonic Mapping", time: "14m ago", urgency: "low", initial: "FZ" },
                  { name: "David Chen", lab: "L5: Servo Synchronization", time: "2h ago", urgency: "medium", initial: "DC" },
                  { name: "Samuel Okon", lab: "L1: GPIO Logic Gates", time: "4h ago", urgency: "high", initial: "SO" },
                ].map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="bg-white p-5 rounded-[2rem] border border-slate-200 flex items-center justify-between hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        {item.initial}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          {item.name}
                          {item.urgency === 'high' && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[8px] font-black uppercase">Priority</span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {item.lab} • <span className="text-emerald-600 font-bold">{item.time}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2">
                        Review <ChevronRight className="w-3 h-3" />
                      </button>
                      <button className="p-2.5 rounded-xl border border-slate-100 text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-5">
                <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] px-2">Live Lab Telemetry</h3>
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white overflow-hidden relative shadow-2xl shadow-slate-300">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 blur-[80px]" />
                  
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active Nodes</p>
                        <p className="text-2xl font-black">148 Units</p>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
                      </div>
                    </div>
                    
                    {/* Visual Telemetry Breakdown */}
                    <div className="space-y-4">
                      {[
                        { label: "Network Stability", val: "99.2%", color: "bg-emerald-500" },
                        { label: "Average Latency", val: "12ms", color: "bg-blue-400" },
                        { label: "Logic Errors", val: "3", color: "bg-rose-500" },
                      ].map((stat, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{stat.label}</span>
                            <span className="text-xs font-bold text-white">{stat.val}</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "80%" }}
                              className={`h-full ${stat.color} rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black transition-all shadow-lg shadow-emerald-900/20 uppercase tracking-[0.2em]">
                      Launch Visual Debugger
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Curriculum Progression</h3>
                  <p className="text-slate-500 text-sm font-medium">Activity density across all active lab modules.</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase mr-2">Intensity</span>
                  <div className="flex gap-1.5">
                    <div className="h-4 w-4 rounded-md bg-slate-200" />
                    <div className="h-4 w-4 rounded-md bg-emerald-200" />
                    <div className="h-4 w-4 rounded-md bg-emerald-400" />
                    <div className="h-4 w-4 rounded-md bg-emerald-600" />
                  </div>
                </div>
              </div>
              
              {/* Heatmap Grid Placeholder */}
              <div className="grid grid-cols-12 gap-2">
                {Array.from({ length: 48 }).map((_, i) => (
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    key={i} 
                    className={`aspect-square rounded-lg border border-slate-50 ${
                      i % 7 === 0 ? 'bg-emerald-600' : 
                      i % 5 === 0 ? 'bg-emerald-400' : 
                      i % 3 === 0 ? 'bg-emerald-200' : 'bg-slate-100'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </>
        )}
          
          {activeTab === "Live Lab Monitor" && (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* LEFT: LIVE ACTIVITY FEED */}
                <div className="xl:col-span-2 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase text-xs tracking-widest">
                        <Activity className="w-4 h-4 text-emerald-600" /> Live Event Stream
                      </h3>
                      <div className="flex gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <AnimatePresence mode="popLayout">
                        {events.map((event) => (
                          <motion.div 
                            layout
                            key={event.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg ${
                                event.status === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                                event.status === 'error' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                              }`}>
                                {event.status === 'success' ? <CheckCircle2 className="w-4 h-4" /> : 
                                event.status === 'error' ? <AlertCircle className="w-4 h-4" /> : <Zap className="w-4 h-4 animate-pulse" />}
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900">{event.student}</p>
                                <p className="text-xs text-slate-500 font-medium">{event.action}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-black text-slate-400 uppercase">{event.time}</span>
                              <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4 text-slate-400" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* LOWER: STUDENT HEALTH GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { name: "Unit 01: Nairobi", load: 65, temp: "24°C" },
                      { name: "Unit 02: Lagos", load: 92, temp: "31°C" },
                    ].map((unit, i) => (
                      <div key={i} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase">{unit.name}</p>
                          <Globe className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-2xl font-black text-slate-900">{unit.load}%</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">System Load</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-emerald-600">{unit.temp}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Node Temp</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: HELP REQUESTS & FLAG SYSTEM */}
                <div className="space-y-6">
                  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl" />
                    <h3 className="font-black text-lg mb-6 flex items-center gap-2 relative z-10">
                      <AlertCircle className="w-5 h-5 text-rose-500" /> Support Queue
                    </h3>
                    
                    <div className="space-y-4 relative z-10">
                      {[
                        { name: "Samuel Okon", msg: "I2C Address not found", severity: "High" },
                        { name: "Amina J.", msg: "Pin 13 remains high", severity: "Medium" },
                      ].map((req, i) => (
                        <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-black">{req.name}</span>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                              req.severity === 'High' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-black'
                            }`}>{req.severity}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium italic">&quot;{req.msg}&quot;</p>
                          <button className="mt-3 w-full py-2 bg-emerald-600 rounded-lg text-[10px] font-black uppercase">Intercept Lab</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* QUICK ANALYTICS */}
                  <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Compiler Health</h4>
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-3xl font-black text-slate-900">94.2%</span>
                        <span className="text-xs font-bold text-emerald-600">+1.2%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Average Success Rate (Global)</p>
                  </div>
                </div>

              </div>
            </>          
        )}

        {activeTab === "Student Directory" && (
          <>
           
            <div className="grid grid-cols-1 gap-6">
              {students.map((student) => (
                <motion.div 
                  whileHover={{ scale: 1.005 }}
                  key={student.id} 
                  className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center justify-between gap-8 group"
                >
                  {/* Left: Avatar & Identity */}
                  <div className="flex items-center gap-6 flex-1">
                    <div className="h-20 w-20 rounded-[2rem] bg-slate-100 flex items-center justify-center text-2xl font-black text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-black text-slate-900">{student.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                          student.status === 'Flagged' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>{student.status}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-500 mb-2">{student.track}</p>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors">
                          <GraduationCap className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Progress Visuals */}
                  <div className="flex items-center gap-12 flex-1 justify-center border-x border-slate-100 px-8">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grade Avg</p>
                      <p className={`text-3xl font-black ${student.grade > 90 ? 'text-emerald-600' : 'text-slate-900'}`}>{student.grade}%</p>
                    </div>
                    <div className="space-y-2 w-full max-w-[140px]">
                      <div className="flex justify-between text-[10px] font-black text-slate-400">
                        <span>LABS</span>
                        <span>{student.labs}/{student.totalLabs}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(student.labs/student.totalLabs) * 100}%` }}
                          className={`h-full rounded-full ${student.grade > 90 ? 'bg-emerald-500' : 'bg-slate-900'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Performance Status & Action */}
                  <div className="flex items-center gap-8 flex-1 justify-end">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Performance</p>
                      <div className="flex items-center gap-2 justify-end">
                        {student.performance === "Exceeding" && <Award className="w-4 h-4 text-amber-500" />}
                        <span className="font-bold text-sm">{student.performance}</span>
                      </div>
                    </div>
                    <button className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-emerald-600 transition-all group/btn">
                      <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-slate-200">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px]" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black tracking-tight">Cohort Mastery Summary</h4>
                    <p className="text-slate-400 text-sm max-w-md">84% of your students are on track for graduation. The &quot;Hardware Security&quot; module is currently the primary bottleneck.</p>
                  </div>
                  <div className="flex gap-10">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Pass Rate</p>
                        <p className="text-4xl font-black">92.4%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Labs Solved</p>
                        <p className="text-4xl font-black">412</p>
                    </div>
                  </div>
              </div>
            </div>
          </>
        )}

        {
          activeTab === "Direct Messages" && (
          <>
            {/* Contact List Pane */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-black mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-xs border-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            {contacts.map((contact, i) => (
              <button 
                key={contact.id}
                onClick={() => setActiveChat(i)}
                className={`w-full p-4 flex gap-3 transition-colors ${activeChat === i ? 'bg-emerald-50/50 border-r-4 border-emerald-600' : 'hover:bg-slate-50'}`}
              >
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                    {contact.name.charAt(0)}
                  </div>
                  {contact.status === "online" && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>
                <div className="flex-grow text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-slate-900">{contact.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{contact.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{contact.lastMsg}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Pane */}
        <div className="flex-grow flex flex-col bg-white">
          {/* Chat Header */}
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                {contacts[activeChat].name.charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-slate-900">{contacts[activeChat].name}</h3>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Active Now</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Phone className="w-4 h-4" /></button>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Video className="w-4 h-4" /></button>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Info className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-slate-50/30">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'tutor' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${
                  msg.sender === 'tutor' 
                  ? 'bg-slate-900 text-white rounded-tr-none shadow-lg shadow-slate-200' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed font-medium">{msg.text}</p>
                  <p className={`text-[9px] mt-2 font-bold uppercase tracking-tighter ${msg.sender === 'tutor' ? 'text-slate-400' : 'text-slate-400'}`}>
                    {msg.time} {msg.sender === 'tutor' && '• Read'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-slate-200">
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Paperclip className="w-5 h-5" /></button>
              <input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text" 
                placeholder="Type feedback or technical advice..." 
                className="flex-grow bg-transparent border-none text-sm focus:ring-0 outline-none"
              />
              <button className="h-10 w-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane: Student Context Context */}
        <div className="w-72 border-l border-slate-200 bg-white p-8 hidden xl:block">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Student Context</h4>
          
          <div className="space-y-8">
            <div className="text-center">
              <div className="h-20 w-20 rounded-[2.5rem] bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-black mx-auto mb-4">
                {contacts[activeChat].name.charAt(0)}
              </div>
              <h5 className="font-black text-slate-900">{contacts[activeChat].name}</h5>
              <p className="text-xs text-slate-500 font-medium italic">Embedded Systems Track</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Current Activity</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold">Lab 4: PWM Control</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Technical Health</p>
                <div className="flex justify-between items-end">
                   <span className="text-2xl font-black">94%</span>
                   <TrendingUp className="w-4 h-4 text-emerald-500 mb-1" />
                </div>
              </div>
            </div>

            <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 hover:border-emerald-200 hover:text-emerald-600 transition-all uppercase">
              View Lab Code
            </button>
          </div>
        </div>
          </>)
        }

        {
          activeTab === "Resource Library" && (
            <>              
                  {/* Quick Access Folders */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                      { label: "Hardware Docs", icon: Cpu, color: "text-blue-600", bg: "bg-blue-50" },
                      { label: "Firmware Binaries", icon: HardDrive, color: "text-purple-600", bg: "bg-purple-50" },
                      { label: "UI Templates", icon: Layout, color: "text-emerald-600", bg: "bg-emerald-50" },
                      { label: "Archived Labs", icon: Archive, color: "text-amber-600", bg: "bg-amber-50" },
                    ].map((folder, i) => (
                      <motion.div 
                        whileHover={{ y: -5 }}
                        key={i} 
                        className="bg-white p-6 rounded-[2rem] border border-slate-200 cursor-pointer group"
                      >
                        <div className={`h-12 w-12 rounded-2xl ${folder.bg} ${folder.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <folder.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-black text-slate-900 text-sm">{folder.label}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">24 Files</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* File Explorer Table */}
                  <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                      <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search files..." 
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <button className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">
                        <Filter className="w-4 h-4" /> Filter By Type
                      </button>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          <th className="px-8 py-4">Resource Name</th>
                          <th className="px-8 py-4">Category</th>
                          <th className="px-8 py-4">Size</th>
                          <th className="px-8 py-4">Uploaded</th>
                          <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {resources.map((file) => (
                          <tr key={file.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                                  file.type === 'PDF' ? 'bg-rose-50 text-rose-600' :
                                  file.type === 'Video' ? 'bg-blue-50 text-blue-600' :
                                  file.type === 'Code' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {file.type === 'PDF' && <FileText className="w-5 h-5" />}
                                  {file.type === 'Video' && <PlayCircle className="w-5 h-5" />}
                                  {file.type === 'Code' && <Code2 className="w-5 h-5" />}
                                  {file.type === 'Zip' && <Archive className="w-5 h-5" />}
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-900">{file.title}</p>
                                  <p className="text-[10px] font-bold text-slate-400">{file.type} File</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className="text-[10px] font-black px-2 py-1 bg-slate-100 rounded text-slate-500 uppercase">{file.category}</span>
                            </td>
                            <td className="px-8 py-5 text-xs font-bold text-slate-500">{file.size}</td>
                            <td className="px-8 py-5 text-xs font-bold text-slate-500">{file.date}</td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-400 hover:text-emerald-600">
                                  <Download className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-400 hover:text-blue-600">
                                  <Share2 className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-900">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

            </>)
        }

      </main>
    </div>
  );
}