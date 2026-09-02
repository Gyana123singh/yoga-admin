import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/common/StatCard';
import { OverviewCharts } from '../components/dashboard/OverviewCharts';
import { ModernTable } from '../components/common/ModernTable';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { api, BACKEND_URL } from '../services/api';
import {
  Users,
  Brain,
  Sparkles,
  Flame,
  Watch,
  DollarSign,
  Video,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const { setSelectedUser } = useApp();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      const res = await api.getDashboardStats();
      setDashboardData(res);
      setIsLoading(false);
    }
    loadDashboard();
  }, []);

  const stats = dashboardData?.stats || {
    totalUsers: 0,
    userGrowth: 0,
    monthlyRevenue: 0,
    mrrGrowth: 0,
    meditationMinutesToday: 0,
    avgMinutesPerUser: 0,
    retentionRate: 0,
    avgStreakDays: 0,
    dailySessions: 0
  };

  const liveClasses = dashboardData?.liveClasses || [];
  const recentUsers = dashboardData?.recentUsers || [];

  const userColumns = [
    {
      header: 'User',
      accessor: 'name',
      cell: (row) => {
        const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || 'User')}&background=6366f1&color=fff&bold=true`;
        return (
          <div className="flex items-center gap-3">
            <img
              src={row.avatar || fallbackAvatar}
              alt={row.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackAvatar;
              }}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/20"
            />
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-xs">{row.name}</p>
              <p className="text-[10px] text-slate-400">{row.email}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Plan',
      accessor: 'planType',
      cell: (row) => (
        <Badge variant={row.planType === 'Premium' ? 'indigo' : 'slate'}>
          {row.planType}
        </Badge>
      )
    },
    {
      header: 'Streak',
      accessor: 'streak',
      cell: (row) => (
        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-500">
          <Flame className="w-3.5 h-3.5" /> {row.streak || 0} Days
        </span>
      )
    },
    {
      header: 'HRV Avg',
      accessor: 'hrvAvg',
      cell: (row) => <span className="font-semibold text-xs text-emerald-500">{row.hrvAvg || '65 ms'}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'Active' ? 'emerald' : 'rose'} size="sm">
          {row.status || 'Active'}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
    

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
        <StatCard
          title="Total Registered Users"
          value={(stats.totalUsers || 0).toLocaleString()}
          change={stats.userGrowth || 0}
          changeType="increase"
          subtitle="Active practice community"
          icon={Users}
          gradient="indigo"
        />

        <StatCard
          title="Monthly Recurring Revenue"
          value={`$${(stats.monthlyRevenue || 0).toLocaleString()}`}
          change={stats.mrrGrowth || 0}
          changeType="increase"
          subtitle={`ARR: $${((stats.monthlyRevenue || 0) * 12).toLocaleString()}`}
          icon={DollarSign}
          gradient="cyan"
        />

        <StatCard
          title="Meditation Minutes Today"
          value={stats.meditationMinutesToday >= 1000 ? `${(stats.meditationMinutesToday / 1000).toFixed(1)}k` : (stats.meditationMinutesToday || 0).toLocaleString()}
          change={stats.userGrowth || 0}
          changeType="increase"
          subtitle={`Avg ${stats.avgMinutesPerUser || 0} mins per user`}
          icon={Brain}
          gradient="emerald"
        />

        <StatCard
          title="Daily Active Streak"
          value={`${stats.retentionRate || (stats.avgStreakDays ? Math.round(stats.avgStreakDays * 10) : 0)}%`}
          change={stats.mrrGrowth || 0}
          changeType="increase"
          subtitle="Consistent daily completion"
          icon={Flame}
          gradient="amber"
        />
      </div>

      {/* Interactive Charts Section */}
      <OverviewCharts
        revenueRetentionSeries={dashboardData?.revenueRetentionSeries}
        dailyPracticeDistribution={dashboardData?.dailyPracticeDistribution}
        countryAnalytics={dashboardData?.countryAnalytics}
        totalSessionsToday={stats.dailySessions}
      />



      {/* Lower Grid: Recent Active Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <ModernTable
            title="Recent Active Members"
            columns={userColumns}
            data={recentUsers}
            pageSize={5}
            isLoading={isLoading}
            onRowClick={(user) => setSelectedUser(user)}
          />
        </div>
      </div>
    </div>
  );
}
