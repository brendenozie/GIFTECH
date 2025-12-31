"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Copy, DollarSign, TrendingUp, Users, ArrowUpRight, Zap, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-context";
import { Navigation } from "@/components/navigation";

export default function PartnerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint = user?.role === "affiliate" ? "/api/affiliate/dashboard" : "/api/partner/dashboard";

        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setDashboard(data);
      } catch (err: any) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboard();
  }, [user]);

  const copyToClipboard = () => {
    if (!dashboard?.referralCode) return;
    navigator.clipboard.writeText(dashboard.referralCode);
    toast.success("Referral link copied!", {
      style: { background: "#18181b", color: "#fff", border: "1px solid #27272a" },
    });
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#09090b] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-zinc-500 text-sm font-medium tracking-widest uppercase">Loading Analytics</p>
      </div>
    );
  }

  // Mapping from your API response
  const { stats, revenueChart, recentConversions, referralCode } = dashboard;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 md:p-10">
      {/* Navigation */}
      <Navigation />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-zinc-500 mt-1 text-sm">
              Overview for <span className="text-indigo-400">{user?.email}</span>
            </p>
          </div>

          <div 
            onClick={copyToClipboard}
            className="flex items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 transition-all px-4 py-2 rounded-xl cursor-pointer group w-full lg:w-auto"
          >
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Your Referral Link</span>
              <span className="text-xs font-mono text-zinc-300 truncate max-w-[200px] md:max-w-xs">
                {referralCode}
              </span>
            </div>
            <Copy className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
            glowColor="bg-emerald-500/10"
          />
          <StatCard
            title="Active Referrals"
            value={stats.activeReferrals}
            icon={<Users className="w-5 h-5 text-blue-400" />}
            glowColor="bg-blue-500/10"
          />
          <StatCard
            title="Conversion Rate"
            value={stats.conversionRate} // API already provides the "%"
            icon={<Zap className="w-5 h-5 text-amber-400" />}
            glowColor="bg-amber-500/10"
          />
        </div>

        {/* Chart & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> 
              Revenue Performance
            </h3>
            
            <div className="h-[300px] w-full flex items-center justify-center">
              {revenueChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChart}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#818cf8" strokeWidth={2} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center space-y-2">
                  <div className="bg-zinc-800/50 p-3 rounded-full inline-block">
                    <Inbox className="w-6 h-6 text-zinc-600" />
                  </div>
                  <p className="text-zinc-500 text-sm">No revenue data available yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Conversions */}
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
            
            <div className="space-y-5">
              {recentConversions.length > 0 ? (
                recentConversions.map((c: any) => (
                  <div key={c.id} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">Sale Confirmed</p>
                        <p className="text-[10px] text-zinc-500">{new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">+${c.amount}</span>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm text-zinc-600">No conversions to show</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, glowColor }: any) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
      <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-20 transition-opacity group-hover:opacity-40 ${glowColor}`} />
      
      <div className="flex flex-col gap-4">
        <div className="w-10 h-10 rounded-xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50">
          {icon}
        </div>
        <div>
          <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
          <p className="text-2xl font-bold mt-1 text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}