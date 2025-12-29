'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  _id: string;
  plan: string;
  price: number;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  userName?: string;
}

export default function SubscriptionManagement({ admin }: { admin: any }) {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, expired: 0, trial: 0, revenue: 0 });

  useEffect(() => {
    fetchSubscriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/admin/subscriptions', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const subs = data.subscriptions || [];
        setSubscriptions(subs);
        
        // Calculate stats
        const active = subs.filter((s: Subscription) => s.status === 'active').length;
        const expired = subs.filter((s: Subscription) => s.status === 'expired').length;
        const trial = subs.filter((s: Subscription) => s.status === 'trial').length;
        
        // Fetch real revenue from the revenue API
        const revenueResponse = await fetch('/api/admin/revenue', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        let revenue = 0;
        if (revenueResponse.ok) {
          const revenueData = await revenueResponse.json();
          revenue = revenueData.revenue?.total || 0;
        } else {
          // Fallback to subscription prices if revenue API fails
          revenue = subs.reduce((sum: number, s: Subscription) => sum + (s.price || 0), 0);
        }
        
        setStats({ active, expired, trial, revenue });
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscriptions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox title="Active Subscriptions" value={stats.active.toString()} color="bg-green-100" />
        <StatBox title="Expired" value={stats.expired.toString()} color="bg-red-100" />
        <StatBox title="Trial" value={stats.trial.toString()} color="bg-yellow-100" />
        <StatBox title="Total Revenue" value={`KES ${stats.revenue.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} color="bg-blue-100" />
      </div>

      {/* Active Subscriptions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-4">All Subscriptions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">Plan</th>
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">Status</th>
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">Price</th>
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">Start Date</th>
                <th className="px-4 py-2 text-left text-gray-900 font-semibold">End Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscriptions.length > 0 ? (
                subscriptions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {sub.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sub.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : sub.status === 'trial'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">KES {sub.price.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(sub.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(sub.endDate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                    No subscriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatBox({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className={`${color} rounded-lg p-4`}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function PlanCard({ name }: { name: string }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h4 className="font-semibold text-gray-900 mb-3">{name} Plan</h4>
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p>$29.99/month</p>
        <p>Active Users: 234</p>
        <p>Revenue: $7,046</p>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
        <button className="flex-1 text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
      </div>
    </div>
  );
}
