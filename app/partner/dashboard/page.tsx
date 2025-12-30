'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Copy, DollarSign, TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

// Mock Data
const data = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

export default function PartnerDashboard() {
  const referralCode = "trading.app/ref/alex_trader";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral link copied!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-8 space-y-8">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-500">Welcome back, Alex. Here&apos;s what&apos;s happening today.</p>
        </div>
        
        {/* Referral Link Box */}
        <div 
          onClick={copyToClipboard}
          className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-lg cursor-pointer hover:border-blue-400 transition-colors shadow-sm group"
        >
          <span className="font-mono text-sm text-slate-600 group-hover:text-blue-600 transition-colors">
            {referralCode}
          </span>
          <Copy className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="$12,450.00" 
          trend="+12.5%" 
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />} 
          trendColor="text-emerald-600"
        />
        <StatCard 
          title="Active Referrals" 
          value="1,240" 
          trend="+4.3%" 
          icon={<Users className="w-6 h-6 text-blue-600" />} 
          trendColor="text-blue-600"
        />
        <StatCard 
          title="Conversion Rate" 
          value="3.2%" 
          trend="-0.4%" 
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />} 
          trendColor="text-red-500"
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Revenue Overview</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity / Leaderboard */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4">Recent Conversions</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                    U{i}
                  </div>
                  <div>
                    <p className="text-sm font-medium">New User Signup</p>
                    <p className="text-xs text-slate-400">2 minutes ago</p>
                  </div>
                </div>
                <div className="text-emerald-600 font-medium text-sm">+$45.00</div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon, trendColor }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-xl">
          {icon}
        </div>
        <span className={`text-sm font-medium flex items-center gap-1 ${trendColor}`}>
          {trend}
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1 text-slate-900">{value}</p>
      </div>
    </div>
  );
}