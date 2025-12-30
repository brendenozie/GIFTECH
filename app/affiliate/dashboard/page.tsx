"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Copy, Users, MousePointer2, Wallet, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const data = [
  { name: 'Mon', clicks: 40 }, { name: 'Tue', clicks: 30 },
  { name: 'Wed', clicks: 65 }, { name: 'Thu', clicks: 45 },
  { name: 'Fri', clicks: 90 }, { name: 'Sat', clicks: 70 },
  { name: 'Sun', clicks: 85 },
];

export default function AffiliateDashboard() {
  const referralLink = "https://app.com/signup?ref=USER123";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Affiliate Dashboard</h1>
          <p className="text-slate-500">Welcome back! Here&apos;s how your links are performing.</p>
        </div>
        <div className="flex items-center gap-3 p-2 bg-slate-100 rounded-lg border border-slate-200">
          <code className="text-sm font-medium px-2">{referralLink}</code>
          <Button size="sm" onClick={copyToClipboard} variant="secondary">
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Clicks", value: "1,284", icon: MousePointer2, color: "text-blue-600" },
          { label: "Conversions", value: "42", icon: Users, color: "text-purple-600" },
          { label: "Total Earned", value: "$840.00", icon: Wallet, color: "text-green-600" },
          { label: "Conv. Rate", value: "3.2%", icon: TrendingUp, color: "text-orange-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-slate-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.label}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Card className="border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle>Clicks Overview (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                />
                <Line type="monotone" dataKey="clicks" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}