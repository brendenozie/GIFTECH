'use client';

import React, { useEffect, useState } from "react";
import { 
  Check, X, Search, Globe, Mail, Calendar, Building2, Users, 
  Clock, TrendingUp, Edit2, Save, Percent, Award, ChevronDown, ChevronUp,
  ShieldCheck, MapPin, RefreshCcw, MoreHorizontal, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ... Interfaces remain the same ...


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
    website?: string;
    location?: string;
  };
  affiliateProfile?: {
    commissionRate: number;
    isActive: boolean;
    appliedAt: string;
    source?: string;
  };
}

type FilterStatus = "pending" | "approved";


export default function PartnersManagement({ admin }: { admin: any }) {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterStatus>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    revenueShare: '', tier: '', commissionRate: '', companyName: '', 
    website: '', location: '', source: ''
  });

  useEffect(() => { fetchApplications(); }, [activeTab]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/applications?status=${activeTab}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setUsers(data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  

  const handleAction = async (userId: string, role: string, action: "approve" | "reject" | "update") => {
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

      toast({ 
        title: action === "update" ? "Profile Updated" : "Status Changed", 
        description: `Successfully processed the request.` 
      });
      setEditingId(null);
      fetchApplications();
    } catch {
      toast({ title: "Action Failed", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Header Section */}
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="rounded-md border-primary/20 bg-primary/5 text-primary px-2 py-0.5 font-bold tracking-wider">
              ADMINISTRATOR
            </Badge>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Partner Ecosystem</h1>
            <p className="text-muted-foreground">Manage revenue shares, tiers, and partner authorizations.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search partners..." 
                className="pl-10 h-11 bg-card border-border rounded-xl shadow-sm focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={fetchApplications} variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-card">
              <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterStatus)} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="pending" className="rounded-lg font-semibold data-[state=active]:shadow-sm">
              Pending Review
            </TabsTrigger>
            <TabsTrigger value="approved" className="rounded-lg font-semibold data-[state=active]:shadow-sm">
              Active Partners
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Content Area */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredUsers.length < 1 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* Desktop Table Header - Hidden on Mobile */}
            <div className="hidden lg:grid grid-cols-12 px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50">
              <div className="col-span-4">Partner</div>
              <div className="col-span-3">Role & Timeline</div>
              <div className="col-span-3">Economic Terms</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Partner Rows / Cards */}
            {filteredUsers.map((user) => (
              <PartnerItem 
                key={user._id} 
                user={user} 
                activeTab={activeTab}
                isExpanded={expandedId === user._id}
                isEditing={editingId === user._id}
                onToggle={() => setExpandedId(expandedId === user._id ? null : user._id)}
                onEditStart={() => {
                   setEditingId(user._id);
                   setEditForm({
                      revenueShare: user.partnerProfile?.revenueShare?.toString() || '0',
                      tier: user.partnerProfile?.tier || 'silver',
                      commissionRate: user.affiliateProfile?.commissionRate?.toString() || '0',
                      companyName: user.partnerProfile?.companyName || '',
                      website: user.partnerProfile?.website || '',
                      location: user.partnerProfile?.location || '',
                      source: user.affiliateProfile?.source || ''
                   });
                }}
                onEditCancel={() => setEditingId(null)}
                editForm={editForm}
                setEditForm={setEditForm}
                handleAction={handleAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PartnerItem({ user, isExpanded, isEditing, onToggle, onEditStart, onEditCancel, editForm, setEditForm, handleAction, activeTab }: any) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 border-border/50 hover:border-primary/30 shadow-sm",
      isExpanded ? "ring-2 ring-primary/20 shadow-md" : "hover:shadow"
    )}>
      {/* Main Row */}
      <div 
        className="p-4 md:p-6 cursor-pointer lg:grid lg:grid-cols-12 flex flex-col gap-4 items-start lg:items-center"
        onClick={onToggle}
      >
        {/* User Identity */}
        <div className="col-span-4 flex items-center gap-4">
          <Avatar className="h-12 w-12 rounded-xl ring-2 ring-background border border-border/50">
            <AvatarFallback className="bg-gradient-to-br from-primary to-indigo-600 text-primary-foreground font-bold">
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <h3 className="font-bold text-base leading-tight">{user.firstName} {user.lastName}</h3>
            <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</p>
          </div>
        </div>

        {/* Role & Timeline */}
        <div className="col-span-3 flex flex-row lg:flex-col items-center lg:items-start gap-2 lg:gap-1">
          <Badge variant="secondary" className={cn(
            "text-[10px] uppercase font-bold px-2",
            user.role === 'partner' ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
          )}>
            {user.role}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" /> 
            {new Date(user.partnerProfile?.appliedAt || user.affiliateProfile?.appliedAt || '').toLocaleDateString()}
          </span>
        </div>

        {/* Terms */}
        <div className="col-span-3 flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-1">
          <div className="flex items-center gap-1.5 font-bold text-sm">
            <Percent className="w-4 h-4 text-primary" />
            {user.role === 'partner' 
              ? `${((user.partnerProfile?.revenueShare || 0) * 100).toFixed(0)}% Split`
              : `${((user.affiliateProfile?.commissionRate || 0) * 100).toFixed(0)}% Rate`
            }
          </div>
          {user.role === 'partner' && (
            <Badge variant="outline" className="text-[9px] h-5 bg-background border-border/50">
              <Award className="w-3 h-3 mr-1 text-amber-500" /> {user.partnerProfile?.tier}
            </Badge>
          )}
        </div>

        {/* Actions Button */}
        <div className="col-span-2 w-full lg:w-auto flex justify-end">
          <Button variant="ghost" size="sm" className="hidden lg:flex rounded-lg group">
            Details
            <ChevronDown className={cn("ml-2 w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
          </Button>
          <div className="lg:hidden flex w-full justify-between items-center border-t border-border mt-2 pt-4">
             <span className="text-xs font-bold text-primary flex items-center">
                {isExpanded ? 'Hide Details' : 'View Details'} <ArrowUpRight className="ml-1 w-3 h-3" />
             </span>
             <MoreHorizontal className="text-muted-foreground w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Expanded Sub-Dashboard */}
      {isExpanded && (
        <CardContent className="px-4 pb-6 pt-2 lg:px-6 lg:pb-8 border-t border-border/40 bg-muted/20 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            
            {/* Business Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Business Profile</h4>
              <div className="p-4 rounded-xl bg-card border border-border space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Organization</label>
                  {isEditing ? (
                    <Input value={editForm.companyName} className="h-9" onChange={(e) => setEditForm({...editForm, companyName: e.target.value})} />
                  ) : (
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <Building2 className="w-4 h-4 opacity-50"/> {user.partnerProfile?.companyName || "N/A"}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Website</label>
                  {isEditing ? (
                    <Input value={editForm.website} className="h-9" onChange={(e) => setEditForm({...editForm, website: e.target.value})} />
                  ) : (
                    <a href={user.partnerProfile?.website} target="_blank" className="text-sm font-medium text-primary hover:underline flex items-center gap-2">
                      <Globe className="w-4 h-4 opacity-50"/> {user.partnerProfile?.website || "No link"}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Metrics Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Economics</h4>
              <div className="p-4 rounded-xl bg-card border border-border space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Tier</label>
                      {isEditing && user.role === 'partner' ? (
                        <Select value={editForm.tier} onValueChange={(val) => setEditForm({...editForm, tier: val})}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="silver">Silver</SelectItem>
                            <SelectItem value="gold">Gold</SelectItem>
                            <SelectItem value="platinum">Platinum</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm font-bold capitalize">{user.partnerProfile?.tier || 'N/A'}</p>
                      )}
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Location</label>
                      {isEditing ? (
                        <Input value={editForm.location} className="h-9" onChange={(e) => setEditForm({...editForm, location: e.target.value})} />
                      ) : (
                        <p className="text-sm font-bold flex items-center gap-1 truncate text-muted-foreground">
                          <MapPin className="w-3 h-3"/> {user.partnerProfile?.location || "Remote"}
                        </p>
                      )}
                   </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Commission Share</label>
                  {isEditing ? (
                    <div className="relative">
                      <Input type="number" value={user.role === 'partner' ? editForm.revenueShare : editForm.commissionRate} 
                        onChange={(e) => setEditForm({...editForm, [user.role === 'partner' ? 'revenueShare' : 'commissionRate']: e.target.value})} 
                        className="pr-8" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">%</span>
                    </div>
                  ) : (
                    <p className="text-xl font-black text-foreground">
                      {user.role === 'partner' ? (user.partnerProfile?.revenueShare || 0) * 100 : (user.affiliateProfile?.commissionRate || 0) * 100}%
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Management Column */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Management</h4>
              <div className="flex flex-col gap-3">
                {isEditing ? (
                  <>
                    <Button className="w-full bg-primary font-bold shadow-lg shadow-primary/20" onClick={() => handleAction(user._id, user.role, 'update')}>
                      <Save className="w-4 h-4 mr-2"/> Commit Changes
                    </Button>
                    <Button variant="outline" className="w-full" onClick={onEditCancel}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full bg-foreground text-background hover:opacity-90 font-bold" onClick={(e) => { e.stopPropagation(); onEditStart(); }}>
                      <Edit2 className="w-4 h-4 mr-2"/> Modify Partner Terms
                    </Button>
                    {activeTab === 'pending' && (
                      <div className="grid grid-cols-2 gap-2">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold" onClick={() => handleAction(user._id, user.role, 'approve')}>Approve</Button>
                        <Button variant="destructive" onClick={() => handleAction(user._id, user.role, 'reject')}>Decline</Button>
                      </div>
                    )}
                    <div className="bg-primary/5 p-3 rounded-xl border border-primary/10 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                      <p className="text-[10px] leading-relaxed text-muted-foreground">
                        Actions performed here will trigger automated notification emails to the partner.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </CardContent>
      )}
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
      ))}
    </div>
  );
}

function EmptyState({ tab }: { tab: FilterStatus }) {
  return (
    <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl bg-muted/10">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-background mb-4 shadow-sm border border-border">
        {tab === "pending" ? <TrendingUp className="w-10 h-10 text-primary" /> : <Users className="w-10 h-10 text-primary" />}
      </div>
      <h3 className="text-xl font-bold">No Applications Found</h3>
      <p className="text-muted-foreground max-w-sm mx-auto mt-2">
        {tab === "pending" ? "The queue is currently empty. Great job!" : "Approved partners will appear here once verified."}
      </p>
    </div>
  );
}

// ... EmptyState and LoadingTable functions remain similar to previous but with updated tailwind colors/shadows ...
// 'use client';

// import { useEffect, useState } from "react";
// import { 
//   Check, X, Search, Globe, Mail, Calendar, Building2, Users, 
//   Clock, TrendingUp, Edit2, Save, Percent, Award, ChevronDown, ChevronUp,
//   Link2, ShieldCheck, MapPin
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/hooks/use-toast";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// interface UserApplication {
//   _id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: "partner" | "affiliate";
//   partnerProfile?: {
//     companyName: string;
//     tier: "silver" | "gold" | "platinum";
//     revenueShare: number;
//     isApproved: boolean;
//     appliedAt: string;
//     website?: string; // Added field
//     location?: string; // Added field
//   };
//   affiliateProfile?: {
//     commissionRate: number;
//     isActive: boolean;
//     appliedAt: string;
//     source?: string; // Added field (e.g. YouTube, Blog)
//   };
// }


// type FilterStatus = "pending" | "approved";

// export default function PartnersManagement({admin}: {admin: any}) {
//   const { toast } = useToast();
//   const [users, setUsers] = useState<UserApplication[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [expandedId, setExpandedId] = useState<string | null>(null);
  
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editForm, setEditForm] = useState({ revenueShare: '', tier: '', commissionRate: '' });

//   useEffect(() => { fetchApplications(); }, [activeTab]);

//   const fetchApplications = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/admin/applications?status=${activeTab}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       const data = await res.json();
//       setUsers(data || []);
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to fetch applications", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAction = async (userId: string, role: string, action: "approve" | "reject" | "revoke" | "update") => {
//     try {
//       const res = await fetch(`/api/admin/applications`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ 
//           userId, 
//           role, 
//           status: action === "approve" ? "approved" : action === "reject" ? "declined" : undefined,
//           updates: editForm 
//         }),
//       });

//       if (!res.ok) throw new Error();

//       toast({ title: "Success", description: `Application updated successfully.` });
//       setEditingId(null);
//       fetchApplications();
//     } catch {
//       toast({ title: "Action Failed", variant: "destructive" });
//     }
//   };

//   const filteredUsers = users.filter((u) =>
//     u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="max-w-7xl mx-auto p-6 space-y-8 bg-slate-50/50 min-h-screen">
//       {/* Header - Styled for clarity */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//         <div>
//           <Badge className="mb-2 bg-indigo-100 text-indigo-700 border-none px-3">ADMIN CONSOLE</Badge>
//           <h1 className="text-4xl font-black tracking-tight text-slate-900">Partner Ecosystem</h1>
//           <p className="text-slate-500 mt-1">Manage high-level partnerships and affiliate growth.</p>
//         </div>
//         <div className="flex gap-2">
//             <Button 
//                 variant={activeTab === 'pending' ? 'default' : 'outline'}
//                 onClick={() => setActiveTab('pending')}
//                 className="rounded-full px-6"
//             >
//                 Pending Review
//             </Button>
//             <Button 
//                 variant={activeTab === 'approved' ? 'default' : 'outline'}
//                 onClick={() => setActiveTab('approved')}
//                 className="rounded-full px-6"
//             >
//                 Verified Members
//             </Button>
//         </div>
//       </div>

//       <Card className="border-none shadow-xl shadow-slate-200/60 bg-white overflow-hidden">
//         <CardContent className="p-0">
//           {loading ? (
//             <LoadingTable />
//           ) : (
//           filteredUsers.length < 1 ? (
//           <EmptyState tab={activeTab} />
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="text-[11px] uppercase tracking-[0.1em] text-slate-400 bg-slate-50/80 font-bold border-b border-slate-100">
//                   <th className="px-6 py-4">User & Contact</th>
//                   <th className="px-6 py-4">Status & Role</th>
//                   <th className="px-6 py-4">Earnings Configuration</th>
//                   <th className="px-6 py-4 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {filteredUsers.map((user) => (
//                   <>
//                     <tr 
//                       key={user._id} 
//                       className={cn(
//                         "hover:bg-slate-50/50 transition-all cursor-pointer group",
//                         expandedId === user._id && "bg-blue-50/30"
//                       )}
//                       onClick={() => setExpandedId(expandedId === user._id ? null : user._id)}
//                     >
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
//                             <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 font-bold">
//                               {user.firstName[0]}{user.lastName[0]}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div className="flex flex-col">
//                             <span className="font-bold text-slate-900 flex items-center gap-1">
//                                 {user.firstName} {user.lastName}
//                                 {expandedId === user._id ? <ChevronUp className="w-3 h-3 text-slate-400"/> : <ChevronDown className="w-3 h-3 text-slate-400"/>}
//                             </span>
//                             <span className="text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3"/> {user.email}</span>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex flex-col gap-1">
//                             <Badge className={cn(
//                                 "w-fit text-[10px] font-bold uppercase tracking-wider border-none shadow-none",
//                                 user.role === 'partner' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
//                             )}>
//                                 {user.role}
//                             </Badge>
//                             <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
//                                 <Clock className="w-3 h-3"/> Applied {new Date(user.partnerProfile?.appliedAt || user.affiliateProfile?.appliedAt || '').toLocaleDateString()}
//                             </span>
//                         </div>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <div className="flex flex-col">
//                             <div className="flex items-center gap-2 font-bold text-slate-700">
//                                 <Percent className="w-3.5 h-3.5 text-indigo-500" />
//                                 {user.role === 'partner' 
//                                     ? `${((user.partnerProfile?.revenueShare || 0) * 100).toFixed(0)}% Share`
//                                     : `${((user.affiliateProfile?.commissionRate || 0) * 100).toFixed(0)}% Rate`
//                                 }
//                             </div>
//                             {user.role === 'partner' && (
//                                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1">
//                                     <Award className="w-3 h-3 text-amber-500"/> {user.partnerProfile?.tier} Tier
//                                 </span>
//                             )}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 text-right">
//                          <Button variant="ghost" size="sm" className="rounded-full hover:bg-white shadow-sm border border-transparent hover:border-slate-200">
//                             Details
//                          </Button>
//                       </td>
//                     </tr>
                    
//                     {/* EXPANDED DETAIL PANEL */}
//                     {expandedId === user._id && (
//                       <tr className="bg-slate-50/50">
//                         <td colSpan={4} className="px-8 py-6">
//                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-top-2 duration-300">
//                                 {/* Profile Details */}
//                                 <div className="space-y-3">
//                                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Identity</h4>
//                                     <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
//                                         <div className="flex items-center gap-2 text-sm text-slate-600">
//                                             <Building2 className="w-4 h-4 text-slate-400"/>
//                                             <span className="font-semibold text-slate-900">{user.partnerProfile?.companyName || "Independent Contractor"}</span>
//                                         </div>
//                                         <div className="flex items-center gap-2 text-sm text-slate-600">
//                                             <Globe className="w-4 h-4 text-slate-400"/>
//                                             <a href="#" className="text-blue-500 hover:underline">{user.partnerProfile?.website || "No website provided"}</a>
//                                         </div>
//                                         <div className="flex items-center gap-2 text-sm text-slate-600">
//                                             <MapPin className="w-4 h-4 text-slate-400"/>
//                                             <span>{user.partnerProfile?.location || "Global / Remote"}</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Status & Metrics */}
//                                 <div className="space-y-3">
//                                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Status</h4>
//                                     <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
//                                         <div className="flex justify-between items-center">
//                                             <span className="text-xs text-slate-500">Member Since</span>
//                                             <span className="text-xs font-bold">{new Date().getFullYear()}</span>
//                                         </div>
//                                         <div className="flex justify-between items-center">
//                                             <span className="text-xs text-slate-500">Security Clearance</span>
//                                             <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px]"><ShieldCheck className="w-3 h-3 mr-1"/> Verified</Badge>
//                                         </div>
//                                         <div className="flex justify-between items-center">
//                                             <span className="text-xs text-slate-500">Primary Channel</span>
//                                             <span className="text-xs font-bold capitalize">{user.affiliateProfile?.source || "Direct Search"}</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Quick Controls */}
//                                 <div className="space-y-3">
//                                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Management Actions</h4>
//                                     <div className="flex flex-col gap-2">
//                                         <Button 
//                                             size="sm" 
//                                             className="w-full bg-slate-900"
//                                             onClick={() => {
//                                                 setEditingId(user._id);
//                                                 setEditForm({
//                                                     revenueShare: user.partnerProfile?.revenueShare.toString() || '',
//                                                     tier: user.partnerProfile?.tier || '',
//                                                     commissionRate: user.affiliateProfile?.commissionRate.toString() || ''
//                                                 });
//                                             }}
//                                         >
//                                             <Edit2 className="w-3 h-3 mr-2"/> Edit Terms
//                                         </Button>
//                                         {activeTab === 'pending' && (
//                                             <div className="flex gap-2">
//                                                 <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAction(user._id, user.role, 'approve')}>Approve</Button>
//                                                 <Button variant="outline" className="flex-1 text-rose-500 border-rose-100 hover:bg-rose-50" onClick={() => handleAction(user._id, user.role, 'reject')}>Decline</Button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                            </div>
//                         </td>
//                       </tr>
//                     )}
//                   </>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ))}</CardContent>
//       </Card>
//     </div>
//   );
// }

