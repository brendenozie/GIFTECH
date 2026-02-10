"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, Users2, GraduationCap, ShieldAlert, Globe, 
  DollarSign, TrendingUp, MoreHorizontal, Check, X, Search, 
  Loader2, Download, ArrowUpRight, ArrowDownLeft, Filter,
  Activity,
  AlertTriangle,
  Key,
  MapIcon,
  ShieldCheck,
  Terminal,
  Lock,
  Award,
  Star,
  MoreVertical,
  BookOpen,
  Mail,
  Microscope
} from "lucide-react";

export default function AdminDashboard() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("Global Insights");
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState([
    { id: 1, name: "Kofi Mensah", region: "Ghana", score: 94, status: "pending" },
    { id: 2, name: "Amina Juma", region: "Tanzania", score: 88, status: "pending" },
    { id: 3, name: "Zaidu Oki", region: "Nigeria", score: 91, status: "pending" },
    { id: 4, name: "Sara Chen", region: "Kenya", score: 85, status: "pending" },
  ]);
  
  // --- REVENUE DATA ---
  const revenueData = [
    { month: "Jan", amount: 45000 },
    { month: "Feb", amount: 52000 },
    { month: "Mar", amount: 48000 },
    { month: "Apr", amount: 61000 },
    { month: "May", amount: 55000 },
    { month: "Jun", amount: 67000 },
  ];

  const transactions = [
    { id: "TX-9021", entity: "Tech University Ghana", type: "Inbound", amount: 12500, status: "completed", date: "Feb 08, 2026" },
    { id: "TX-9022", entity: "Scholarship Fund", type: "Outbound", amount: 4200, status: "pending", date: "Feb 09, 2026" },
    { id: "TX-9023", entity: "Lagos Innovation Hub", type: "Inbound", amount: 8900, status: "completed", date: "Feb 10, 2026" },
    { id: "TX-9024", entity: "Server Maintenance", type: "Outbound", amount: 1500, status: "completed", date: "Feb 10, 2026" },
  ];

   // --- SECURITY DATA ---
  const securityThreats = [
    { region: "North America", attempts: 12, level: "Low", color: "bg-blue-400" },
    { region: "Europe", attempts: 45, level: "Medium", color: "bg-amber-400" },
    { region: "Asia Pacific", attempts: 89, level: "High", color: "bg-rose-500" },
    { region: "Africa (Internal)", attempts: 4, level: "Secure", color: "bg-emerald-400" },
  ];

  const accessLogs = [
    { id: "LOG-102", user: "admin_root", action: "Database Query", ip: "192.168.1.1", time: "2 mins ago", status: "authorized" },
    { id: "LOG-103", user: "faculty_user_09", action: "Grade Update", ip: "41.210.22.5", time: "14 mins ago", status: "authorized" },
    { id: "LOG-104", user: "unknown_entity", action: "SSH Brute Force", ip: "103.44.11.2", time: "28 mins ago", status: "blocked" },
    { id: "LOG-105", user: "system_cron", action: "Backup Sync", ip: "localhost", time: "1 hour ago", status: "authorized" },
  ];


  const maxRevenue = Math.max(...revenueData.map(d => d.amount));
  // --- ACTIONS ---
  const handleAction = (id : number, newStatus: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    // In a real app, you'd send a PATCH request here
    console.log(`Application ${id} set to ${newStatus}`);
  };

  const generateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert("Global Report for Q1 2026 has been downloaded.");
    }, 2000);
  };

  const filteredApps = useMemo(() => {
    return applications.filter(app => 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.region.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, applications]);

  
  // --- FACULTY DATA ---
  const faculty = [
    { 
      id: 1, 
      name: "Dr. Elena Vance", 
      role: "Lead Researcher", 
      dept: "Quantum Computing", 
      research: "Neural Synapse Mapping", 
      progress: 75, 
      status: "Active",
      image: "EV"
    },
    { 
      id: 2, 
      name: "Prof. Aris Thorne", 
      role: "Senior Lecturer", 
      dept: "Renewable Energy", 
      research: "Solid-State Hydrogen Storage", 
      progress: 40, 
      status: "Sabbatical",
      image: "AT"
    },
    { 
      id: 3, 
      name: "Dr. Marcus Wright", 
      role: "Department Head", 
      dept: "AI Ethics", 
      research: "Autonomous Moral Frameworks", 
      progress: 92, 
      status: "Review",
      image: "MW"
    },
    { 
      id: 4, 
      name: "Prof. Sarah Jenkins", 
      role: "Assistant Professor", 
      dept: "Biotechnology", 
      research: "CRISPR-V3 Implementation", 
      progress: 15, 
      status: "Grant Phase",
      image: "SJ"
    }
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">Gif <span className="text-blue-600">Tech</span></span>
        </div>

        <nav className="flex-grow space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Operations</p>
          {[
            { label: "Global Insights", icon: BarChart3 },
            { label: "Scholarship Portal", icon: GraduationCap, count: applications.length },
            { label: "Faculty Management", icon: Users2 },
            { label: "Revenue & Billing", icon: DollarSign },
            { label: "System Security", icon: ShieldAlert },
          ].map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.label 
                  ? "bg-blue-50 text-blue-600 border border-blue-100" 
                  : "hover:bg-slate-50 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${activeTab === item.label ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                <span className="text-sm font-bold">{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-black">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase">System: Online</span>
          </div>
          <button className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all shadow-sm">
            View Logs
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-grow overflow-y-auto p-10">
        
        {/* Header with Search & Report Action */}
        <header className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{activeTab}</h1>
            <p className="text-slate-500 font-medium">Managing the GIFTECH global infrastructure.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 transition-all"
                />
             </div>
             <button 
              onClick={generateReport}
              disabled={isGenerating}
              className="h-11 px-6 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             >
               {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
               {isGenerating ? "Processing..." : "Export Report"}
             </button>
          </div>
        </header>

        {/* Dynamic View Logic */}
        {(activeTab === "Global Insights" || activeTab === "Scholarship Portal") && (
          <>
            {/* High-Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              {[
                { label: "Active Enrolled", val: "14,208", up: "+12%", color: "text-blue-600" },
                { label: "Total Revenue", val: "$428.5k", up: "+8.4%", color: "text-emerald-600" },
                { label: "Scholarship Burn", val: "$82.1k", up: "-2%", color: "text-rose-600" },
                { label: "Avg. Lab Completion", val: "78.4%", up: "+5%", color: "text-purple-600" },
              ].map((stat, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="p-6 rounded-[2rem] bg-white border border-slate-200 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                    <TrendingUp className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className="text-3xl font-black text-slate-900 mb-1">{stat.val}</p>
                  <p className={`text-xs font-bold ${stat.color}`}>{stat.up} <span className="text-slate-400 ml-1 font-medium">vs last month</span></p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Scholarship Approval Table */}
              <div className="lg:col-span-2 rounded-[2.5rem] bg-white border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-slate-900">Pending Approvals ({filteredApps.length})</h3>
                </div>
                
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {filteredApps.map((app) => (
                      <motion.div 
                        layout
                        key={app.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 group hover:border-blue-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-600 text-xs">
                            {app.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{app.name}</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{app.region} • Score: {app.score}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleAction(app.id, 'approved')}
                            className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleAction(app.id, 'rejected')}
                            className="h-8 w-8 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button className="h-8 w-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    {filteredApps.length === 0 && (
                      <div className="py-12 text-center text-slate-400 font-medium italic">
                        No pending applications found.
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Node Health */}
              <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-xl">
                <h3 className="text-lg font-black mb-6">Live Node Latency</h3>
                <div className="space-y-6 mt-6">
                  {[
                    { city: "Nairobi Hub", load: "84%", color: "bg-emerald-400" },
                    { city: "Lagos Hub", load: "92%", color: "bg-amber-400" },
                    { city: "Accra Node", load: "45%", color: "bg-blue-400" },
                  ].map((node, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span>{node.city}</span>
                        <span className="text-slate-400">{node.load}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: node.load }}
                          transition={{ duration: 1.5 }}
                          className={`h-full ${node.color}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {(activeTab === "Revenue & Billing") && (
          <div className="space-y-8">
            
            {/* Top Row: Chart & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Custom Bar Chart */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="font-black text-slate-900">Revenue Performance</h3>
                  <select className="bg-slate-50 border-none text-xs font-bold rounded-lg px-3 py-2 outline-none">
                    <option>Last 6 Months</option>
                    <option>Year to Date</option>
                  </select>
                </div>
                
                <div className="flex items-end justify-between h-48 gap-2">
                  {revenueData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.amount / maxRevenue) * 100}%` }}
                        className="w-full max-w-[40px] bg-blue-600 rounded-t-lg relative group"
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          ${(d.amount / 1000).toFixed(1)}k
                        </div>
                      </motion.div>
                      <span className="text-[10px] font-black text-slate-400 uppercase">{d.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Summary Cards */}
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem]">
                  <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">Total Monthly Inbound</p>
                  <p className="text-3xl font-black text-emerald-700">$142,800</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-[2rem] text-white">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Outstanding Invoices</p>
                  <p className="text-3xl font-black">$12,400</p>
                  <button className="mt-4 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">Generate Reminders →</button>
                </div>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-slate-900">Recent Transactions</h3>
                <button className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-blue-600 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="pb-4 font-black">Entity / Ref</th>
                      <th className="pb-4 font-black">Type</th>
                      <th className="pb-4 font-black">Amount</th>
                      <th className="pb-4 font-black">Status</th>
                      <th className="pb-4 font-black text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-4">
                          <p className="text-sm font-bold text-slate-900">{tx.entity}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{tx.id}</p>
                        </td>
                        <td className="py-4">
                          <div className={`flex items-center gap-1.5 text-xs font-bold ${tx.type === 'Inbound' ? 'text-emerald-600' : 'text-slate-600'}`}>
                            {tx.type === 'Inbound' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                            {tx.type}
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm font-black text-slate-900">${tx.amount.toLocaleString()}</span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                            tx.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <span className="text-xs font-bold text-slate-500">{tx.date}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {activeTab === "System Security" && (
          <div className="space-y-8">
            
            {/* Top Row: Threat Map & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Visual Threat Origin Block */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="font-black text-slate-900 flex items-center gap-2">
                    <MapIcon className="w-4 h-4 text-blue-600" /> Regional Threat Level
                  </h3>
                  <span className="text-[10px] font-black text-slate-400 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-500" /> LIVE SCANNING
                  </span>
                </div>

                <div className="space-y-4 relative z-10">
                  {securityThreats.map((threat, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className={`h-2 w-2 rounded-full ${threat.color} animate-pulse`} />
                        <span className="text-sm font-bold text-slate-700">{threat.region}</span>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase">Blocked</p>
                          <p className="text-sm font-black text-slate-900">{threat.attempts}</p>
                        </div>
                        <div className="w-20">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                            threat.level === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {threat.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Health Cards */}
              <div className="space-y-6">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between h-full">
                  <div>
                    <Lock className="w-10 h-10 text-blue-500 mb-6" />
                    <h4 className="text-xl font-black mb-2">Encryption: AES-256</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">All outbound data packets are currently utilizing quantum-resistant handshake protocols.</p>
                  </div>
                  <button className="mt-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center justify-center gap-2">
                    <Key className="w-3 h-3" /> Rotate Keys
                  </button>
                </div>
              </div>
            </div>

            {/* Access Logs Table */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-slate-400" /> Live Audit Log
                </h3>
              </div>

              <div className="space-y-3">
                {accessLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border border-slate-50 rounded-2xl hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className={`p-2 rounded-lg ${log.status === 'blocked' ? 'bg-rose-50' : 'bg-slate-100'}`}>
                        {log.status === 'blocked' ? <AlertTriangle className="w-4 h-4 text-rose-600" /> : <ShieldCheck className="w-4 h-4 text-slate-600" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900">{log.user}</span>
                          <span className="text-[10px] font-bold text-slate-400">@{log.ip}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{log.action}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xs font-bold text-slate-400">{log.time}</span>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-blue-600 font-black text-[10px] uppercase">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === "Faculty Management" && (
          <div className="space-y-8">
            
            {/* Faculty Distribution Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Faculty", val: "142", icon: Users2, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Active Grants", val: "38", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Research Output", val: "+24%", icon: Star, color: "text-emerald-600", bg: "bg-emerald-50" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Faculty Directory Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {faculty.map((person) => (
                <motion.div 
                  whileHover={{ y: -5 }}
                  key={person.id} 
                  className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm group transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl">
                        {person.image}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900">{person.name}</h3>
                        <p className="text-sm font-bold text-blue-600">{person.role}</p>
                        <p className="text-xs text-slate-400 font-medium">{person.dept}</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-slate-900">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Microscope className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">Current Research</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 mb-4">{person.research}</p>
                    
                    {/* Research Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-slate-400">
                        <span>PHASE COMPLETION</span>
                        <span>{person.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${person.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-600 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-600 transition-colors">
                        <BookOpen className="w-4 h-4" />
                      </button>
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                      person.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      person.status === 'Sabbatical' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {person.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}