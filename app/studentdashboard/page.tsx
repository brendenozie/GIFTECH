"use client";

import { useState } from "react";
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
  ArrowRight,
  TrendingUp,
  Layout,
  Clock,
  Square,
  Save,
  Settings,
  History,
  Info,
  Link as LinkIcon,
  Plus,
  Trash2,
  RotateCcw,
  AlertCircle,
  Activity,
  ChevronRight,
  Maximize2,
  Circle,
  Lock,
  Satellite,
  ChevronDown,
  Globe,
  Star,

  Award,
  ExternalLink,
  ShieldCheck,
  Share2,
  Download,
  Verified,
  QrCode,
  MapPin,


} from "lucide-react";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [code, setCode] = useState(`import machine\nimport time\n\n# Configure Ultrasonic Sensor\ntrigger = machine.Pin(5, machine.Pin.OUT)\necho = machine.Pin(18, machine.Pin.IN)\n\ndef get_distance():\n    # Trigger pulse\n    trigger.off()\n    time.sleep_us(2)\n    trigger.on()\n    time.sleep_us(10)\n    trigger.off()\n    \n    # Wait for echo and calculate...`);
  const [activeConnections, setActiveConnections] = useState([
    { id: 1, component: "HC-SR04 (Ultrasonic)", pin: "GPIO 05", type: "Digital OUT", status: "Active" },
    { id: 2, component: "HC-SR04 (Ultrasonic)", pin: "GPIO 18", type: "Digital IN", status: "Active" },
  ]);
  const [activePhase, setActivePhase] = useState(1);

  const certifications = [
    {
      id: 1,
      title: "Embedded Systems Specialist",
      date: "Feb 08, 2026",
      issuer: "Global Innovation Fund",
      skills: ["GPIO", "PWM", "I2C"],
      color: "from-emerald-500 to-teal-600",
      icon: <Cpu className="w-8 h-8" />
    },
    {
      id: 2,
      title: "Real-Time Sensor Architect",
      date: "Jan 15, 2026",
      issuer: "Nairobi Tech Hub",
      skills: ["Interrupts", "UART", "Analog Logic"],
      color: "from-blue-500 to-indigo-600",
      icon: <Zap className="w-8 h-8" />
    }
  ];

  const phases = [
    {
      id: 0,
      title: "The Hello World of Hardware",
      objective: "Mastering the 'Blinky' and basic PWM logic.",
      status: "completed",
      modules: ["GPIO Architecture", "Resistor Networks", "Pulse Width Modulation"],
      icon: <Zap className="w-5 h-5" />,
    },
    {
      id: 1,
      title: "The Sensor Fusion",
      objective: "Decoding environmental data via I2C and SPI.",
      status: "active",
      modules: ["Ultrasonic Mapping", "DHT11 Thermals", "OLED Buffer Management"],
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "The Cloud Bridge",
      objective: "Establishing TCP/IP sockets and MQTT streams.",
      status: "locked",
      modules: ["WiFi Provisioning", "MQTT Pub/Sub", "Data Encryption"],
      icon: <Wifi className="w-5 h-5" />,
    },
    {
      id: 3,
      title: "IoT Satellite Node",
      objective: "Deploying a remote node with LoRaWAN telemetry.",
      status: "locked",
      modules: ["LoRa Long Range", "Solar Power Management", "Satellite Mesh Sync"],
      icon: <Satellite className="w-5 h-5" />,
    }
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans">

      {/* --- REFINED LIGHT SIDEBAR --- */}
      <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col items-center lg:items-start p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-12 lg:px-2">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-100">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <span className="hidden lg:block text-xl font-black text-slate-900 tracking-tighter uppercase italic">Mission<span className="text-emerald-600">Control</span></span>
        </div>

        <nav className="flex-grow space-y-2 w-full">
          {[
            { label: "Overview", icon: Layout, active: activeTab === "Overview" },
            { label: "Current Lab", icon: Code2, active: activeTab === "Current Lab" },
            { label: "Curriculum", icon: BookOpen, active: activeTab === "Curriculum" },
            { label: "Hardware", icon: Cpu, active: activeTab === "Hardware" },
            { label: "Timeline", icon: Activity, active: activeTab === "Timeline" },
            { label: "Certifications", icon: Award, active: activeTab === "Certifications" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-2xl transition-all group ${item.active
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50"
                  : "hover:bg-slate-50 text-slate-400 hover:text-slate-900"
                }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? "text-emerald-600" : "group-hover:text-emerald-500"}`} />
              <span className="hidden lg:block text-sm font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile Card */}
        <div className="mt-auto w-full lg:p-4 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="hidden lg:block text-[10px] font-black text-emerald-400 uppercase tracking-widest">Operator</span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-700 border border-white/10" />
            <div className="hidden lg:block overflow-hidden">
              <p className="text-xs font-bold truncate">Ibrahim Yusuf</p>
              <p className="text-[10px] text-slate-400">Phase 02 Student</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN DASHBOARD AREA --- */}
      <main className="flex-grow overflow-y-auto p-6 lg:p-10">

        {/* Header Section */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-black uppercase tracking-[0.2em]">
              <Box className="w-4 h-4" />
              Active Deployment
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Phase 02: Hardware Bridge</h1>
            <p className="text-slate-500 font-medium">You are <span className="text-emerald-600 font-bold">65%</span> through this phase. Keep the momentum!</p>
          </div>
          <div className="flex gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Streak</p>
              <p className="text-xl font-black text-slate-900">12 Days 🔥</p>
            </div>
            <button className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-3">
              <Play className="w-4 h-4 fill-current" />
              Resume Lab
            </button>
          </div>
        </header>

        {/* Main Grid */}
        {activeTab === "Overview" && (
            <>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          
              {/* PRIMARY MISSION CARD */}
              <div className="lg:col-span-8 space-y-8">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group relative p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                    <Code2 className="w-48 h-48 text-slate-900" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        Active Lab: L3.4
                      </div>
                      <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <Clock className="w-3 h-3" /> Est. 45 mins remaining
                      </span>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">Interfacing Ultrasonic Sensors <br /> with Python Middleware</h2>
                    <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-xl">
                      Connect your HC-SR04 sensor and write a script to calculate distance using sound-wave timing.
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <TerminalIcon className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-bold text-slate-700">IDE Ready</span>
                      </div>
                      <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <Wifi className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-bold text-slate-700">Bridge Stable</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* CURRICULUM MINI-CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "Upcoming: Logic Gates", status: "locked", icon: Box, color: "text-slate-400" },
                    { title: "Completed: Circuitry 101", status: "done", icon: CheckCircle2, color: "text-emerald-500" },
                  ].map((item, i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-white border border-slate-200 flex items-center justify-between group cursor-pointer hover:border-emerald-200 transition-all shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${item.status === 'done' ? 'bg-emerald-50' : 'bg-slate-50'} ${item.color}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className={`font-bold ${item.status === 'done' ? 'text-slate-900' : 'text-slate-400'}`}>{item.title}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>

              {/* HARDWARE TELEMETRY PANEL */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                  <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-emerald-600" />
                    Hardware Node v2.1
                  </h3>

                  <div className="space-y-6">
                    {/* Visual Representation Placeholder */}
                    <div className="aspect-square rounded-[2rem] bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent opacity-40" />
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="h-20 w-20 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin mb-4" />
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Syncing Data...</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latency</span>
                        <span className="text-xs font-black text-emerald-600">14ms</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} className="h-full bg-emerald-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <p className="text-[9px] font-black text-slate-400 mb-1 uppercase">Voltage</p>
                        <p className="text-sm font-black text-slate-900">5.02V</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <p className="text-[9px] font-black text-slate-400 mb-1 uppercase">Temp</p>
                        <p className="text-sm font-black text-slate-900">32°C</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* HELP CARD */}
                <div className="p-6 rounded-[2rem] bg-blue-600 flex items-center justify-between group cursor-pointer overflow-hidden relative shadow-lg shadow-blue-100">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-blue-100 mb-1 uppercase tracking-widest">Get Support</p>
                    <p className="text-sm font-black text-white">Ask your Mentor</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-all relative z-10">
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-blue-600" />
                  </div>
                  <Zap className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
                </div>
              </div>
            
        </div>
        </>
          )}
        

          {
            activeTab === "Current Lab" && (
              <>

                <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">

                  {/* --- LAB INSTRUCTIONS SIDEBAR (LEFT) --- */}
                  <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase">Lab 3.4</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                      </div>
                      <h2 className="text-xl font-black tracking-tight leading-tight">Ultrasonic Pulse Management</h2>
                    </div>

                    <div className="flex-grow overflow-y-auto p-6 space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Info className="w-3 h-3" /> Objective
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                          Initialize the trigger and echo pins. Use a 10µs pulse to start the distance measurement and calculate the return time.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Tasks</h3>
                        {[
                          { task: "Set Pin 5 as OUTPUT", done: true },
                          { task: "Set Pin 18 as INPUT", done: true },
                          { task: "Implement Trigger Pulse", done: false },
                          { task: "Log distance to Console", done: false },
                        ].map((t, i) => (
                          <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${t.done ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                            <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${t.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                              {t.done && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </div>
                            <span className={`text-xs font-bold ${t.done ? 'text-emerald-700 line-through' : 'text-slate-600'}`}>{t.task}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 border-t border-slate-100">
                      <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">
                        Submit Solution
                      </button>
                    </div>
                  </aside>

                  {/* --- CODE EDITOR AREA (CENTER) --- */}
                  <section className="flex-grow flex flex-col bg-[#1e293b]">
                    {/* Editor Toolbar */}
                    <div className="h-14 bg-slate-900/50 border-b border-white/5 flex items-center justify-between px-6">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">main.py</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          <History className="w-3 h-3" /> Auto-saved 2m ago
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors"><Save className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-400 hover:text-white transition-colors"><Settings className="w-4 h-4" /></button>
                      </div>
                    </div>

                    {/* Mock Editor */}
                    <div className="flex-grow p-6 font-mono text-sm leading-relaxed overflow-hidden">
                      <textarea
                        className="w-full h-full bg-transparent text-emerald-50 border-none focus:ring-0 resize-none outline-none selection:bg-emerald-500/30"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck="false"
                      />
                    </div>

                    {/* Console / Terminal Output */}
                    <div className="h-48 bg-black/40 border-t border-white/5 p-4 overflow-y-auto">
                      <div className="flex items-center gap-2 mb-3">
                        <TerminalIcon className="w-3 h-3 text-emerald-500" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Terminal</span>
                      </div>
                      <p className="text-[11px] font-mono text-emerald-400/80 mb-1 leading-relaxed">
                        [SYS] Initializing ESP32 Bridge... OK<br />
                        [SYS] Bridge Latency: 12ms<br />
                        [LOG] Pin 5 set to HIGH...
                      </p>
                    </div>
                  </section>

                  {/* --- HARDWARE SIMULATION PANE (RIGHT) --- */}
                  <aside className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-emerald-600" /> Hardware Link
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Connected</span>
                      </div>
                    </div>

                    <div className="p-8 space-y-8 flex-grow">
                      {/* Simulated Hardware Interaction */}
                      <div className="relative aspect-square rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />

                        {/* Ultrasonic Visualizer */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="flex gap-4 mb-8">
                            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center border-4 border-slate-300">
                              <div className="h-4 w-4 rounded-full bg-slate-400" />
                            </div>
                            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center border-4 border-slate-300">
                              <div className="h-4 w-4 rounded-full bg-slate-400" />
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-4xl font-black text-slate-900 tracking-tighter">42.5<span className="text-lg text-slate-400">cm</span></p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Real-time Feedback</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500">Signal Strength</span>
                          <span className="text-xs font-black text-emerald-600 tracking-widest uppercase">Excellent</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "95%" }} className="h-full bg-emerald-500" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <button className="flex items-center justify-between p-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                          Run Simulation <Play className="w-4 h-4 fill-current" />
                        </button>
                        <button className="flex items-center justify-between p-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                          Reset Hardware <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Mentor Help Quick Link */}
                    <div className="p-6 bg-blue-50/50 border-t border-blue-100 flex items-center gap-4 group cursor-pointer">
                      <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                        <Wifi className="w-5 h-5" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-[10px] font-black text-blue-600 uppercase">Need help?</p>
                        <p className="text-xs font-bold text-slate-700">Open mentor channel</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </aside>

                </div>
              </>
            )}

          {
            activeTab === "Curriculum" && (
              <>
                <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">

                  {/* --- COMPONENT DRAWER (LEFT) --- */}
                  <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                      <h2 className="text-xl font-black tracking-tight mb-1">Component Lab</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Drag to the Breadboard</p>
                    </div>

                    <div className="p-6 space-y-6 overflow-y-auto">
                      <section>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Sensors</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { name: "Ultrasonic", icon: "📡" },
                            { name: "LDR", icon: "☀️" },
                            { name: "DHT11", icon: "🌡️" },
                            { name: "PIR", icon: "👤" },
                          ].map((comp) => (
                            <div key={comp.name} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center gap-2 cursor-grab hover:border-emerald-300 hover:bg-emerald-50 transition-all group">
                              <span className="text-2xl group-hover:scale-125 transition-transform">{comp.icon}</span>
                              <span className="text-[10px] font-black uppercase text-slate-600">{comp.name}</span>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Actuators</h3>
                        <div className="space-y-3">
                          {[
                            { name: "Servo Motor", pins: 3 },
                            { name: "OLED Display", pins: 4 },
                          ].map((act) => (
                            <div key={act.name} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-shadow cursor-grab">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Box className="w-4 h-4" /></div>
                                <span className="text-xs font-bold text-slate-700">{act.name}</span>
                              </div>
                              <Plus className="w-4 h-4 text-slate-300" />
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  </aside>

                  {/* --- VIRTUAL BREADBOARD (CENTER) --- */}
                  <main className="flex-grow relative bg-[#e2e8f0] flex flex-col">
                    {/* Canvas Toolbar */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/50 shadow-xl">
                      <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><RotateCcw className="w-4 h-4 text-slate-600" /></button>
                      <div className="h-4 w-[1px] bg-slate-200 mx-2" />
                      <button className="flex items-center gap-2 px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg shadow-lg shadow-emerald-200">
                        <Zap className="w-3 h-3 fill-current" /> Auto-Wire
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><Maximize2 className="w-4 h-4 text-slate-600" /></button>
                    </div>

                    {/* The Breadboard Visualizer */}
                    <div className="flex-grow flex items-center justify-center p-20 overflow-hidden">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative bg-white p-12 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white"
                      >
                        {/* ESP32 Chip Graphic */}
                        <div className="w-[400px] h-[200px] bg-slate-900 rounded-3xl relative p-8 flex items-center justify-center">
                          <div className="absolute top-0 bottom-0 left-4 right-4 flex justify-between">
                            {[...Array(10)].map((_, i) => (
                              <div key={i} className="flex flex-col justify-between py-2">
                                <div className="w-2 h-4 bg-slate-700 rounded-sm" />
                                <div className="w-2 h-4 bg-slate-700 rounded-sm" />
                              </div>
                            ))}
                          </div>
                          <div className="text-center">
                            <Cpu className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
                            <p className="text-white text-[10px] font-black tracking-[0.4em] uppercase">ESP-WROOM-32</p>
                          </div>
                        </div>

                        {/* Virtual Jumper Wire Simulation */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <path d="M 300 150 Q 350 250 450 180" stroke="#10b981" strokeWidth="3" fill="none" strokeDasharray="5,5" className="animate-[dash_2s_linear_infinite]" />
                          <path d="M 320 150 Q 380 300 500 200" stroke="#3b82f6" strokeWidth="3" fill="none" />
                        </svg>
                      </motion.div>
                    </div>
                  </main>

                  {/* --- PIN CONFIGURATION & STATUS (RIGHT) --- */}
                  <aside className="w-80 bg-white border-l border-slate-200 flex flex-col">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-xs font-black uppercase tracking-widest">Pin Mapping</h3>
                      </div>
                      <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">{activeConnections.length}</span>
                    </div>

                    <div className="p-6 flex-grow space-y-4 overflow-y-auto">
                      {activeConnections.map((conn) => (
                        <div key={conn.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group">
                          <div className="flex justify-between items-start mb-2">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${conn.pin.includes('05') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                              {conn.pin}
                            </span>
                            <button className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs font-black text-slate-900">{conn.component}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Activity className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{conn.type}</span>
                          </div>
                        </div>
                      ))}

                      <div className="p-4 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center opacity-50">
                        <AlertCircle className="w-5 h-5 text-slate-300 mb-2" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Unassigned Pins: 24</p>
                      </div>
                    </div>

                    <div className="p-8 bg-slate-900 text-white m-4 rounded-3xl shadow-xl shadow-slate-200">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Node Health</p>
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-2xl font-black italic">OPTIMAL</span>
                        <span className="text-xs font-bold opacity-60">No Shorts</span>
                      </div>
                      <button className="w-full py-3 bg-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors">
                        Deploy Configuration <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </aside>

                  <style jsx>{`
        @keyframes dash {
          to { stroke-dashoffset: -10; }
        }
      `}</style>
                </div>
              </>
            )
          }

          {activeTab === "Hardware" && (<>
            <div className="min-h-screen bg-[#f8fafc] p-10 font-sans text-slate-900">

              {/* --- HEADER --- */}
              <header className="max-w-4xl mx-auto mb-16">
                <div className="flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mb-4">
                  <Globe className="w-4 h-4" /> Global Innovation Fund
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-4">
                  The <span className="text-emerald-600">Growth</span> Path
                </h1>
                <p className="text-lg text-slate-500 font-medium max-w-2xl">
                  From a single flashing LED to a distributed satellite node. This is your technical trajectory through the 2026 cohort.
                </p>
              </header>

              {/* --- TIMELINE TRACK --- */}
              <div className="max-w-4xl mx-auto relative">

                {/* Background Trace Line */}
                <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "45%" }}
                    className="w-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  />
                </div>

                <div className="space-y-12">
                  {phases.map((phase, index) => (
                    <div key={phase.id} className="relative pl-20 group">

                      {/* Timeline Indicator */}
                      <div className={`absolute left-0 top-0 h-14 w-14 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 border-4 border-[#f8fafc] ${phase.status === 'completed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-90' :
                          phase.status === 'active' ? 'bg-slate-900 text-white shadow-xl shadow-slate-300 scale-110' :
                            'bg-white text-slate-300 border-slate-200'
                        }`}>
                        {phase.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : phase.icon}
                      </div>

                      {/* Content Card */}
                      <motion.div
                        whileHover={{ x: 10 }}
                        className={`p-8 rounded-[2.5rem] border transition-all ${phase.status === 'active'
                            ? 'bg-white border-emerald-100 shadow-xl shadow-slate-200/50'
                            : 'bg-white/50 border-slate-200'
                          }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phase 0{index + 1}</span>
                            <h3 className={`text-2xl font-black mt-1 ${phase.status === 'locked' ? 'text-slate-400' : 'text-slate-900'}`}>
                              {phase.title}
                            </h3>
                          </div>
                          {phase.status === 'active' && (
                            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                              <Rocket className="w-3 h-3 animate-bounce" /> Current Mission
                            </div>
                          )}
                          {phase.status === 'locked' && (
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                              <Lock className="w-3 h-3" /> Prerequisites Required
                            </div>
                          )}
                        </div>

                        <p className="text-slate-500 font-medium mb-8 leading-relaxed italic">
                          &quot;{phase.objective}&quot;
                        </p>

                        {/* Module Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {phase.modules.map((module, i) => (
                            <div key={i} className={`px-4 py-3 rounded-2xl border text-center transition-all ${phase.status === 'completed' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700' :
                                phase.status === 'active' ? 'bg-slate-50 border-slate-100 text-slate-700' :
                                  'bg-transparent border-slate-100 text-slate-300'
                              }`}>
                              <span className="text-[10px] font-black uppercase tracking-tighter">{module}</span>
                            </div>
                          ))}
                        </div>

                        {phase.status === 'active' && (
                          <button className="mt-8 flex items-center gap-2 text-sm font-black text-emerald-600 hover:gap-4 transition-all">
                            View Course Syllabus <ChevronDown className="w-4 h-4" />
                          </button>
                        )}
                      </motion.div>

                      {/* Status Label for the line */}
                      <div className="absolute left-[-110px] top-6 w-24 text-right hidden lg:block">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${phase.status === 'active' ? 'text-emerald-600' : 'text-slate-400'
                          }`}>
                          {phase.status === 'active' ? 'In Progress' : phase.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final Capstone Tease */}
                <div className="mt-20 p-12 rounded-[3.5rem] bg-slate-900 text-white text-center relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_-20%,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
                  <Star className="w-12 h-12 text-emerald-400 mx-auto mb-6 opacity-80" />
                  <h4 className="text-3xl font-black mb-4">The Capstone Orbit</h4>
                  <p className="text-slate-400 max-w-lg mx-auto mb-8 font-medium">
                    After completing all phases, you will build and deploy a live hardware node that communicates with the Innovation Hub satellite mesh.
                  </p>
                  <button className="px-10 py-4 bg-emerald-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20">
                    Unlock Final Certification
                  </button>
                </div>
              </div>
            </div>
          </>)}

          {activeTab === "Timeline" && (
            <>

              <div className="min-h-screen bg-[#f8fafc] p-10 font-sans text-slate-900">

                {/* --- HEADER --- */}
                <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
                      <ShieldCheck className="w-4 h-4" /> Secure Credential Vault
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900">
                      Professional <span className="text-emerald-600">Proof</span>
                    </h1>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase flex items-center gap-2 hover:bg-slate-50 transition-all">
                      <Share2 className="w-4 h-4" /> Share Profile
                    </button>
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">
                      <Download className="w-4 h-4" /> Export All (PDF)
                    </button>
                  </div>
                </header>

                {/* --- MAIN GRID --- */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

                  {/* LEFT: STUDENT IDENTITY CARD */}
                  <div className="lg:col-span-1">
                    <div className="bg-white border border-slate-200 rounded-[3rem] p-10 sticky top-10 shadow-sm">
                      <div className="relative w-32 h-32 mx-auto mb-8">
                        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-10" />
                        <div className="relative h-full w-full rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-slate-400">
                          IY
                        </div>
                        <div className="absolute bottom-1 right-1 bg-emerald-500 p-1.5 rounded-full border-2 border-white">
                          <Verified className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div className="text-center mb-10">
                        <h2 className="text-2xl font-black text-slate-900">Ibrahim Yusuf</h2>
                        <p className="text-slate-500 font-medium">Nairobi, Kenya</p>
                        <div className="flex items-center justify-center gap-2 mt-2 text-xs font-bold text-slate-400">
                          <MapPin className="w-3 h-3" /> Node ID: GIF-254-089
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rank</p>
                          <p className="text-sm font-black text-slate-900">Lead Systems Operator</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verified Skills</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {["RTOS", "Embedded C", "C++", "IoT"].map(s => (
                              <span key={s} className="px-2 py-1 bg-white rounded text-[9px] font-black text-slate-600 border border-slate-200">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: CERTIFICATE GALLERY */}
                  <div className="lg:col-span-2 space-y-8">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Earned Credentials</h3>

                    {certifications.map((cert) => (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        key={cert.id}
                        className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 items-center shadow-sm relative overflow-hidden"
                      >
                        {/* Badge Visual */}
                        <div className={`h-32 w-32 flex-shrink-0 bg-gradient-to-br ${cert.color} rounded-[2rem] flex items-center justify-center text-white shadow-lg relative z-10`}>
                          <div className="absolute inset-2 border-2 border-white/20 rounded-[1.5rem]" />
                          {cert.icon}
                        </div>

                        {/* Cert Details */}
                        <div className="flex-grow text-center md:text-left">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                            <h4 className="text-xl font-black text-slate-900">{cert.title}</h4>
                            <span className="text-[10px] font-black px-2 py-1 bg-emerald-50 text-emerald-600 rounded uppercase self-center md:self-auto">Verifiable</span>
                          </div>
                          <p className="text-sm text-slate-500 font-medium mb-4">Issued by {cert.issuer} • {cert.date}</p>

                          <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            {cert.skills.map(skill => (
                              <span key={skill} className="text-[10px] font-bold text-slate-400">#{skill}</span>
                            ))}
                          </div>
                        </div>

                        {/* Action */}
                        <div className="flex flex-col gap-2">
                          <button className="p-3 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-2xl transition-all border border-slate-100">
                            <QrCode className="w-5 h-5" />
                          </button>
                          <button className="p-3 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all border border-slate-100">
                            <ExternalLink className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}

                    {/* Locked State Teaser */}
                    <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center gap-4 grayscale opacity-50 bg-slate-50/50">
                      <div className="h-16 w-16 bg-slate-200 rounded-2xl flex items-center justify-center">
                        <Award className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-400 uppercase">Capstone Certification</p>
                        <p className="text-xs font-bold text-slate-400 italic">Complete the &quot;Satellite Node&quot; phase to unlock.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </>
          )}


          {activeTab === "Certifications" && (
            <>
              {/* LEFT: STUDENT IDENTITY CARD */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-slate-200 rounded-[3rem] p-10 sticky top-10 shadow-sm">
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-10" />
                    <div className="relative h-full w-full rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-slate-400">
                      IY
                    </div>
                    <div className="absolute bottom-1 right-1 bg-emerald-500 p-1.5 rounded-full border-2 border-white">
                      <Verified className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-slate-900">Ibrahim Yusuf</h2>
                    <p className="text-slate-500 font-medium">Nairobi, Kenya</p>
                    <div className="flex items-center justify-center gap-2 mt-2 text-xs font-bold text-slate-400">
                      <MapPin className="w-3 h-3" /> Node ID: GIF-254-089
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rank</p>
                      <p className="text-sm font-black text-slate-900">Lead Systems Operator</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verified Skills</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {["RTOS", "Embedded C", "C++", "IoT"].map(s => (
                          <span key={s} className="px-2 py-1 bg-white rounded text-[9px] font-black text-slate-600 border border-slate-200">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: CERTIFICATE GALLERY */}
              <div className="lg:col-span-2 space-y-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Earned Credentials</h3>

                {certifications.map((cert) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    key={cert.id}
                    className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 items-center shadow-sm relative overflow-hidden"
                  >
                    {/* Badge Visual */}
                    <div className={`h-32 w-32 flex-shrink-0 bg-gradient-to-br ${cert.color} rounded-[2rem] flex items-center justify-center text-white shadow-lg relative z-10`}>
                      <div className="absolute inset-2 border-2 border-white/20 rounded-[1.5rem]" />
                      {cert.icon}
                    </div>

                    {/* Cert Details */}
                    <div className="flex-grow text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                        <h4 className="text-xl font-black text-slate-900">{cert.title}</h4>
                        <span className="text-[10px] font-black px-2 py-1 bg-emerald-50 text-emerald-600 rounded uppercase self-center md:self-auto">Verifiable</span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium mb-4">Issued by {cert.issuer} • {cert.date}</p>

                      <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {cert.skills.map(skill => (
                          <span key={skill} className="text-[10px] font-bold text-slate-400">#{skill}</span>
                        ))}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex flex-col gap-2">
                      <button className="p-3 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-2xl transition-all border border-slate-100">
                        <QrCode className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all border border-slate-100">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {/* Locked State Teaser */}
                <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center gap-4 grayscale opacity-50 bg-slate-50/50">
                  <div className="h-16 w-16 bg-slate-200 rounded-2xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-400 uppercase">Capstone Certification</p>
                    <p className="text-xs font-bold text-slate-400 italic">Complete the &quot;Satellite Node&quot; phase to unlock.</p>
                  </div>
                </div>
              </div>
            </>
          )}
      </main>
    </div>
  );
}