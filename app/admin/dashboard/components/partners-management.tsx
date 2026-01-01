'use client';

import { useEffect, useState } from "react";
import { 
  Check, 
  X, 
  Search, 
  ExternalLink, 
  Globe, 
  Mail, 
  Calendar,
  Building2,
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  UserX,
  Edit2,
  Save,
  Percent,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Expanded Interface to handle both types
interface UserApplication {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "partner" | "affiliate";
  partnerProfile?: {
    companyName: string;
    tier: "silver" | "gold" | "platinum";
    revenueShare: number;
    isApproved: boolean;
    appliedAt: string;
  };
  affiliateProfile?: {
    commissionRate: number;
    isActive: boolean;
    appliedAt: string;
  };
}

type FilterStatus = "pending" | "approved";

export default function AdminReviewDashboard() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterStatus>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ revenueShare: '', tier: '', commissionRate: '' });

  useEffect(() => {
    fetchApplications();
  }, [activeTab]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/applications?status=${activeTab}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setUsers(data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch applications", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId: string, role: string, action: "approve" | "reject" | "revoke" | "update") => {
    try {
      const res = await fetch(`/api/admin/applications`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ 
          userId, 
          role, 
          status: action === "approve" ? "approved" : action === "reject" ? "declined" : undefined,
          updates: editForm 
        }),
      });

      if (!res.ok) throw new Error();

      toast({ title: "Success", description: `Application updated successfully.` });
      setEditingId(null);
      fetchApplications();
    } catch {
      toast({ title: "Action Failed", variant: "destructive" });
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-700 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-2 px-3 py-1 text-primary bg-primary/10 border-none uppercase tracking-wider text-[10px] font-bold">
            Network Management
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Review Board</h1>
          <p className="text-slate-500 mt-1">Configure commission rates and approve partner applications.</p>
        </div>
        <Button onClick={fetchApplications} variant="outline" size="sm" className="hidden md:flex items-center gap-2 border-slate-200">
          Refresh Data
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex p-1 bg-slate-200/50 rounded-xl w-full md:w-auto">
          {/* {["pending", "approved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as FilterStatus)}
              className={cn(
                "flex-1 md:flex-none px-8 py-2 text-sm font-bold rounded-lg transition-all capitalize",
                activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab}
            </button>
          ))} */}
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10 bg-white border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table */}
      <Card className="border-none shadow-xl shadow-slate-200/60 bg-white overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <LoadingTable />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50 font-bold border-b border-slate-100">
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Revenue Share / Rate</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/30 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-200">
                            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                              {user.firstName[0]}{user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{user.firstName} {user.lastName}</span>
                            <span className="text-xs text-slate-500">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn(
                          "capitalize font-bold border-none",
                          user.role === 'partner' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {user.role}
                        </Badge>
                        {user.role === 'partner' && (
                          <div className="text-[10px] text-slate-400 mt-1 font-medium italic">
                             {user.partnerProfile?.companyName}
                          </div>
                        )}
                      </td>
                      
                      {/* COMMISSION / RATE EDITING CELL */}
                      <td className="px-6 py-4">
                        {editingId === user._id ? (
                          <div className="flex items-center gap-2 animate-in slide-in-from-left-2">
                            {user.role === 'partner' ? (
                              <>
                                <Input 
                                  className="w-20 h-8 text-xs"
                                  placeholder="Share (0.3)"
                                  value={editForm.revenueShare}
                                  onChange={(e) => setEditForm({...editForm, revenueShare: e.target.value})}
                                />
                                <Select 
                                  value={editForm.tier} 
                                  onValueChange={(v) => setEditForm({...editForm, tier: v})}
                                >
                                  <SelectTrigger className="w-24 h-8 text-xs">
                                    <SelectValue placeholder="Tier" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="silver">Silver</SelectItem>
                                    <SelectItem value="gold">Gold</SelectItem>
                                    <SelectItem value="platinum">Platinum</SelectItem>
                                  </SelectContent>
                                </Select>
                              </>
                            ) : (
                              <Input 
                                className="w-24 h-8 text-xs"
                                placeholder="Rate (0.15)"
                                value={editForm.commissionRate}
                                onChange={(e) => setEditForm({...editForm, commissionRate: e.target.value})}
                              />
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 text-sm font-semibold text-slate-700">
                            <div className="flex items-center gap-1.5">
                              <Percent className="w-3.5 h-3.5 text-slate-400" />
                              {user.role === 'partner' 
                                ? `${((user.partnerProfile?.revenueShare || 0) * 100).toFixed(0)}%`
                                : `${((user.affiliateProfile?.commissionRate || 0) * 100).toFixed(0)}%`
                              }
                            </div>
                            {user.role === 'partner' && (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-[10px] uppercase tracking-tighter">
                                <Award className="w-3 h-3 text-amber-500" />
                                {user.partnerProfile?.tier}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {(user.partnerProfile?.isApproved || user.affiliateProfile?.isActive) ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 shadow-none">Active</Badge>
                        ) : (
                          <Badge className="bg-amber-50 text-amber-700 border-amber-100 shadow-none">Pending</Badge>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {editingId === user._id ? (
                            <Button 
                              size="sm" 
                              className="bg-slate-900 hover:bg-emerald-600"
                              onClick={() => handleAction(user._id, user.role, 'approve')}
                            >
                              <Save className="w-4 h-4 mr-1" /> Save & Approve
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-400 hover:text-primary"
                                onClick={() => {
                                  setEditingId(user._id);
                                  setEditForm({
                                    revenueShare: user.partnerProfile?.revenueShare.toString() || '',
                                    tier: user.partnerProfile?.tier || '',
                                    commissionRate: user.affiliateProfile?.commissionRate.toString() || ''
                                  });
                                }}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              {activeTab === 'pending' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-rose-500 hover:bg-rose-50"
                                  onClick={() => handleAction(user._id, user.role, "reject")}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ... Keep LoadingTable and EmptyState from your previous code

function EmptyState({ tab }: { tab: FilterStatus }) {
  return (
    <div className="py-24 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
        {tab === "pending" ? <TrendingUp className="w-8 h-8" /> : <Users className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-900">
        {tab === "pending" ? "All Caught Up!" : "No Verified Partners"}
      </h3>
      <p className="text-slate-500 max-w-xs mx-auto mt-1">
        {tab === "pending" 
          ? "There are no new applications waiting for review." 
          : "You haven't approved any partners yet."}
      </p>
    </div>
  );
}

function LoadingTable() {
  return (
    <div className="p-6 space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-9 w-32 ml-auto" />
        </div>
      ))}
    </div>
  );
}