'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  subscriptionGrowth: number;
  revenueGrowth: number;
  churnRate: number;
  retentionRate: number;
  totalUsers: number;
  activeUsers: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
}

export default function Analytics({ admin }: { admin: any }) {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/admin/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Calculate analytics from the stats
        const totalSubs = data.totalSubscriptions || 0;
        const activeSubs = data.activeSubscribers || 0;
        const expiredSubs = data.expiredSubscribers || 0;
        
        // Calculate rates
        const churnRate = totalSubs > 0 ? ((expiredSubs / totalSubs) * 100).toFixed(1) : '0';
        const retentionRate = totalSubs > 0 ? (100 - parseFloat(churnRate as string)).toFixed(1) : '100';
        
        // Estimate growth (simplified - would need historical data for real calculation)
        const subscriptionGrowth = 12; // Placeholder
        const revenueGrowth = 8.5; // Placeholder
        
        setAnalytics({
          subscriptionGrowth,
          revenueGrowth,
          churnRate: parseFloat(churnRate as string),
          retentionRate: parseFloat(retentionRate as string),
          totalUsers: data.totalSubscribers || 0,
          activeUsers: data.activeSubscribers || 0,
          totalSubscriptions: totalSubs,
          activeSubscriptions: activeSubs,
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={analytics.totalUsers.toString()}
          subtitle="All registered users"
          color="text-blue-600"
        />
        <MetricCard
          title="Active Subscriptions"
          value={analytics.activeSubscriptions.toString()}
          subtitle="Currently active"
          color="text-green-600"
        />
        <MetricCard
          title="Churn Rate"
          value={`${analytics.churnRate.toFixed(1)}%`}
          subtitle="Monthly churn"
          color="text-red-600"
        />
        <MetricCard
          title="Retention"
          value={`${analytics.retentionRate.toFixed(1)}%`}
          subtitle="This month"
          color="text-green-600"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Subscription Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Subscriptions:</span>
              <span className="font-semibold text-gray-900">{analytics.totalSubscriptions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Subscriptions:</span>
              <span className="font-semibold text-green-600">{analytics.activeSubscriptions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Churn Rate:</span>
              <span className="font-semibold text-red-600">{analytics.churnRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Retention Rate:</span>
              <span className="font-semibold text-green-600">{analytics.retentionRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">User Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Users:</span>
              <span className="font-semibold text-gray-900">{analytics.totalUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Users:</span>
              <span className="font-semibold text-green-600">{analytics.activeUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Inactive Users:</span>
              <span className="font-semibold text-gray-600">{analytics.totalUsers - analytics.activeUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Rate:</span>
              <span className="font-semibold text-blue-600">
                {analytics.totalUsers > 0 ? ((analytics.activeUsers / analytics.totalUsers) * 100).toFixed(1) : '0'}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}
