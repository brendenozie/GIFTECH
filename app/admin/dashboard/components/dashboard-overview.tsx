'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalSubscribers: number;
  activeSubscribers: number;
  expiredSubscribers: number;
  trialSubscribers: number;
  totalRevenue: number;
  weeklyRevenue: number;
  dailyRevenue: number;
  toolAccessMetrics: number;
  systemUptime: string;
  supportTickets: number;
}

interface PlanRevenue {
  name: string;
  revenue: string;
  percentage: number;
  count: number;
}

export default function DashboardOverview({ admin }: { admin: any }) {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [planRevenue, setPlanRevenue] = useState<PlanRevenue[]>([]);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const [statsRes, usersRes, planRevenueRes] = await Promise.all([
        fetch('/api/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/dashboard/recent-users', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/dashboard/plan-revenue', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        setRecentUsers(data.users || []);
      }

      if (planRevenueRes.ok) {
        const data = await planRevenueRes.json();
        setPlanRevenue(data.plans || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
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
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Subscribers"
          value={stats?.totalSubscribers || 0}
          icon="Users"
          subtitle={`${stats?.activeSubscribers || 0} active`}
        />
        <MetricCard
          title="Revenue (Monthly)"
          value={`KES ${(stats?.totalRevenue || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon="DollarSign"
          subtitle={`Weekly: KES ${(stats?.weeklyRevenue || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
        <MetricCard
          title="Tool Access"
          value={stats?.toolAccessMetrics || 0}
          icon="Settings"
          subtitle="Active tools"
        />
        <MetricCard
          title="System Status"
          value={stats?.systemUptime || 'N/A'}
          icon="CheckCircle"
          subtitle="Uptime"
        />
      </div>

      {/* Subscription Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Subscription Status</h3>
          <div className="space-y-3">
            <StatusItem
              label="Active"
              count={stats?.activeSubscribers || 0}
              color="bg-green-100 text-green-800"
            />
            <StatusItem
              label="Trial"
              count={stats?.trialSubscribers || 0}
              color="bg-blue-100 text-blue-800"
            />
            <StatusItem
              label="Expired"
              count={stats?.expiredSubscribers || 0}
              color="bg-red-100 text-red-800"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Daily Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Subscriptions</span>
              <span className="font-semibold text-lg">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue Today</span>
              <span className="font-semibold text-lg">
                KES {(stats?.dailyRevenue || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Support Tickets</span>
              <span className="font-semibold text-lg">{stats?.supportTickets || 0}</span>
            </div>
          </div>
        </div>

        {/* Top Plans */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Plans by Revenue</h3>
          <div className="space-y-3">
            {planRevenue.length > 0 ? (
              planRevenue.slice(0, 3).map((plan, index) => (
                <PlanItem 
                  key={index}
                  name={plan.name} 
                  revenue={plan.revenue} 
                  percentage={plan.percentage} 
                />
              ))
            ) : (
              <p className="text-sm text-gray-500">No revenue data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.userName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.userEmail}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {user.planType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No recent users
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

function MetricCard({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: string;
  subtitle: string;
}) {
  const getIconDisplay = (iconName: string) => {
    const icons: { [key: string]: string } = {
      Users: "U",
      DollarSign: "$",
      Settings: "⚙",
      CheckCircle: "✓",
    };
    return icons[iconName] || iconName;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="text-4xl opacity-20 text-gray-400 font-bold">{getIconDisplay(icon)}</div>
      </div>
    </div>
  );
}

function StatusItem({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}</span>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>{count}</span>
    </div>
  );
}

function PlanItem({
  name,
  revenue,
  percentage,
}: {
  name: string;
  revenue: string;
  percentage: number;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-900">{name}</span>
        <span className="text-sm font-semibold text-gray-900">{revenue}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
