'use client';

import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Clock,
  RefreshCw,
  Search,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Phone,
  Mail,
  ShieldAlert,
  Filter,
  MoreVertical,
  Calendar,
  CreditCard,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Note: You would typically import these from your UI library
const TABS = [
  { id: 'all', label: 'All Subscriptions' },
  { id: 'active', label: 'Active' },
  { id: 'expired', label: 'Expired' },
];

export default function SubscriptionManagement({ admin }: { admin: any }) {
  const { toast } = useToast();

  // -------------------- STATE --------------------
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [stats, setStats] = useState({ active: 0, expired: 0, pending: 0, revenue: 0 });
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === subscriptions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(subscriptions.map(s => s._id));
    }
  };

  const authHeaders = useCallback(() => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }), []);

  // -------------------- DATA FETCHING --------------------
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const statusFilter = activeTab === 'all' ? '' : `&status=${activeTab}`;
      const [subRes, revRes, pendRes] = await Promise.all([
        fetch(`/api/admin/subscriptions?page=${currentPage}&limit=10&search=${encodeURIComponent(searchTerm)}${statusFilter}`, { headers: authHeaders() }),
        fetch('/api/admin/revenuev2', { headers: authHeaders() }),
        fetch(`/api/admin/payments/pending?page=${pendingPage}&limit=5`, { headers: authHeaders() })
      ]);

      const subData = await subRes.json();
      const revData = await revRes.json();
      const pendData = await pendRes.json();

      setSubscriptions(subData.subscriptions ?? []);
      setTotalPages(subData.totalPages ?? 1);
      setPendingPayments(pendData.pending ?? []);
      setPendingTotalPages(pendData.totalPages ?? 1);

      setStats({
        active: subData.activeCount ?? 0,
        expired: subData.expiredCount ?? 0,
        pending: pendData.totalCount ?? 0,
        revenue: revData?.revenue?.total ?? 0,
      });
    } catch (err) {
      toast({ title: 'Sync Error', description: 'Could not update dashboard data.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, activeTab, pendingPage, authHeaders, toast]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 400);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handlePaymentAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/payments/action', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ intentId: id, action }),
      });
      if (!res.ok) throw new Error();
      toast({ title: `Successfully ${action}ed` });
      fetchData();
    } catch {
      toast({ title: 'Action failed', variant: 'destructive' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateSubscription = async (id: string, updates: { endDate?: string; status?: string }) => {
  setLoading(true);
  try {
    const res = await fetch('/api/admin/subscriptions/update', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ subscriptionId: id, ...updates }),
    });

    if (!res.ok) throw new Error();

    toast({ title: 'Success', description: 'User status updated.' });
    fetchData(); // Refresh the table
  } catch (err) {
    toast({ title: 'Error', description: 'Failed to update subscription.', variant: 'destructive' });
  } finally {
    setLoading(false);
  }
};

// Example usage for an "Extend 7 Days" button:
const extendSevenDays = (sub: any) => {
  const currentEnd = new Date(sub.endDate);
  currentEnd.setDate(currentEnd.getDate() + 7);
  handleUpdateSubscription(sub._id, { endDate: currentEnd.toISOString() });
};

// Example usage for a "Revoke" button:
const revokeAccess = (id: string) => {
  handleUpdateSubscription(id, { status: 'expired' });
};

const handleBulkAction = async (updates: { status?: string; extendDays?: number }) => {
  setLoading(true);
  try {
    const res = await fetch('/api/admin/subscriptions/bulk', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        ids: selectedIds, // The array of IDs from your state
        ...updates,
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Bulk update failed');

    toast({
      title: 'Bulk Action Complete',
      description: `Successfully updated ${selectedIds.length} subscriptions.`,
    });

    // Reset selection and refresh data
    setSelectedIds([]);
    fetchData(); 
  } catch (err: any) {
    toast({
      title: 'Error',
      description: err.message,
      variant: 'destructive',
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      
      {/* 1. TOP NAV / HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-600" />
            Subscription Ledger
          </h1>
          <p className="text-slate-500 text-sm mt-1">Real-time financial monitoring and user access control.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-full md:w-80 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              placeholder="Search by name, email, or TV user..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <Button variant="outline" className="shadow-sm border-slate-200" onClick={fetchData}>
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={<TrendingUp />} trend="+12.5%" color="indigo" />
        <StatCard title="Active Users" value={stats.active} icon={<UserCheck />} color="emerald" />
        <StatCard title="Action Required" value={stats.pending} icon={<Clock />} color="amber" />
        <StatCard title="Churned" value={stats.expired} icon={<AlertCircle />} color="slate" />
      </div>

      <div className="gap-10 items-start ">
        {/* grid grid-cols-1 xl:grid-cols-12  */}

        {/* 4. MAIN DATABASE (RIGHT CONTENT) */}
        {/* xl:col-span-8  */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            {/* Table Filters */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex bg-slate-200/50 p-1 rounded-xl">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === tab.id 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="text-slate-500 gap-2">
                <Filter className="w-3.5 h-3.5" />
                Advanced Filters
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100">
                    <th className="px-4 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.length === subscriptions.length}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 accent-indigo-600"
                      />
                    </th>
                    <th className="px-6 py-4 text-left font-bold">Subscriber</th>
                    <th className="px-6 py-4 text-left font-bold">Status</th>
                    <th className="px-6 py-4 text-left font-bold">Timeline</th>
                    <th className="px-6 py-4 text-right font-bold">Investment</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {subscriptions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-4 py-4">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(sub._id)}
                          onChange={() => toggleSelect(sub._id)}
                          className="rounded border-slate-300 accent-indigo-600"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                            {sub.userName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{sub.userName}</div>
                            <div className="text-[10px] text-indigo-600 font-bold uppercase">{sub.plan}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-1.5 text-xs text-slate-600">
                             <Calendar className="w-3 h-3 text-slate-400" />
                             {new Date(sub.endDate).toLocaleDateString()}
                           </div>
                           <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500 w-2/3" /> {/* Example progress */}
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono font-bold text-slate-700">${sub.price}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                          {/* <MoreVertical className="w-4 h-4" /> */}
                          {/* // Add this inside your table row (tr) under the "MoreVertical" button */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => extendSevenDays(sub)}>
                                Extend 7 Days
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => revokeAccess(sub._id)}>
                                Revoke Access
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {selectedIds.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-4 z-50">
                  <span className="text-sm font-bold border-r border-slate-700 pr-6">
                    {selectedIds.length} Selected
                  </span>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleBulkAction({ status: 'active' })}
                    >
                      Activate All
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-white border-slate-700 hover:bg-slate-800"
                      onClick={() => handleBulkAction({ status: 'expired' })}
                    >
                      Expire All
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-white border-slate-700 hover:bg-slate-800"
                      onClick={() => handleBulkAction({ extendDays: 7 })}
                    >
                      +7 Days Access
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-slate-400 hover:text-white"
                      onClick={() => setSelectedIds([])}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Showing <span className="text-slate-900 font-bold">{subscriptions.length}</span> results
              </p>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg h-8 px-2"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center px-3 text-xs font-bold text-slate-600">
                  {currentPage} / {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg h-8 px-2"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

          {/* 3. PENDING ACTIONS (LEFT SIDEBAR) */}
          {/* xl:col-span-4  */}
        <div className="space-y-4 mt-8 ">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" /> 
              Verification Queue
              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px]">{stats.pending}</span>
            </h3>
          </div>

          <div className="space-y-3">
            {pendingPayments.map((pay) => (
              <div key={pay._id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900">{pay.userName || 'Guest'}</h4>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{pay.provider} • {pay.planId}</span>
                  </div>
                  <span className="text-lg font-black">${pay.amount}</span>
                </div>
                
                <div className="text-xs text-slate-500 space-y-1 mb-4">
                  <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {pay.email}</div>
                  {pay.phoneNumber && <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {pay.phoneNumber}</div>}
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handlePaymentAction(pay._id, 'approve')}
                    className="flex-1 bg-slate-900 hover:bg-black text-white rounded-xl h-9 text-xs"
                    disabled={!!processingId}
                  >
                    {processingId === pay._id ? <RefreshCw className="animate-spin w-3 h-3" /> : 'Confirm Payment'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handlePaymentAction(pay._id, 'reject')}
                    className="rounded-xl h-9 px-3 border-slate-200 hover:bg-red-50 hover:text-red-600"
                    disabled={!!processingId}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
            {pendingPayments.length === 0 && (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-sm">
                Queue is empty
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- REFINED SUB COMPONENTS -------------------- */

function StatCard({ title, value, icon, color, trend }: any) {
  const colors: any = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-xl ${colors[color]}`}>{icon}</div>
        {trend && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{title}</p>
        <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    expired: 'bg-red-50 text-red-700 border-red-100',
    trial: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${styles[status] || styles.expired}`}>
      {status}
    </span>
  );
}