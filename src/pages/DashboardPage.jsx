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
    totalUsers: 148520,
    userGrowth: 14.8,
    monthlyRevenue: 348900,
    mrrGrowth: 18.5,
    watchSyncActive: 74.3
  };

  const liveClasses = dashboardData?.liveClasses || [];
  const recentUsers = dashboardData?.recentUsers || [];

  const userColumns = [
    {
      header: 'User',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt={row.name} className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/20" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-xs">{row.name}</p>
            <p className="text-[10px] text-slate-400">{row.email}</p>
          </div>
        </div>
      )
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
          <Flame className="w-3.5 h-3.5" /> {row.streak} Days
        </span>
      )
    },
    {
      header: 'HRV Avg',
      accessor: 'hrvAvg',
      cell: (row) => <span className="font-semibold text-xs text-emerald-500">{row.hrvAvg}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'Active' ? 'emerald' : 'rose'} size="sm">
          {row.status}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="p-4 xs:p-6 sm:p-8 rounded-2xl sm:rounded-3xl gradient-bg-primary text-white shadow-glow-primary relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-bold text-cyan-200">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow shrink-0" />
            <span className="truncate">AURA AI Platform Executive Suite</span>
          </div>
          <h1 className="text-xl xs:text-2xl sm:text-4xl font-extrabold tracking-tight">
            Mindful Wellness Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed font-medium">
            Real-time biometric monitoring, automated recommendation rules, AI practice sequencing, and live global telemetry.
          </p>
        </div>

        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3 relative z-10 w-full md:w-auto">
          <Button
            variant="glass"
            className="bg-white/10 text-white hover:bg-white/20 border-white/30 w-full xs:w-auto"
            icon={Sparkles}
            onClick={() => navigate('/ai-generator')}
          >
            Launch AI Generator
          </Button>
          <Button
            variant="cyan"
            icon={Video}
            className="w-full xs:w-auto"
            onClick={() => navigate('/live-classes')}
          >
            View Live Streams
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
        <StatCard
          title="Total Registered Users"
          value={stats.totalUsers.toLocaleString()}
          change={stats.userGrowth}
          changeType="increase"
          subtitle="Active practice community"
          icon={Users}
          gradient="indigo"
        />

        <StatCard
          title="Monthly Recurring Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          change={stats.mrrGrowth}
          changeType="increase"
          subtitle="ARR: $4.18M"
          icon={DollarSign}
          gradient="cyan"
        />

        <StatCard
          title="Meditation Minutes Today"
          value="894.5k"
          change={12.8}
          changeType="increase"
          subtitle="Avg 26 mins per user"
          icon={Brain}
          gradient="emerald"
        />

        <StatCard
          title="Watch Sync Connectivity"
          value={`${stats.watchSyncActive}%`}
          change={4.1}
          changeType="increase"
          subtitle="Apple Watch & Garmin leading"
          icon={Watch}
          gradient="amber"
        />
      </div>

      {/* Interactive Charts Section */}
      <OverviewCharts />

      {/* Lower Grid: Live Classes & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Live Streams */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-500 shrink-0" /> Today's Live Classes
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/live-classes')}>
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {liveClasses.map((cls) => (
              <div
                key={cls.id || cls._id}
                className="p-3.5 sm:p-4 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/70 dark:border-slate-800 hover:border-indigo-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={cls.status === 'Live Now' ? 'emerald' : 'indigo'}>
                    {cls.status}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-400">{cls.duration}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cls.title}</h4>
                  <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                    <img src={cls.instructorAvatar} alt={cls.instructor} className="w-6 h-6 rounded-full object-cover shrink-0" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">{cls.instructor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800 text-xs font-semibold text-slate-500">
                  <span>{cls.seatsBooked} / {cls.totalSeats} Seats</span>
                  <button
                    onClick={() => navigate('/live-classes')}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500 text-indigo-600 dark:text-indigo-400 hover:text-white transition-all flex items-center gap-1 font-bold"
                  >
                    Join <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="lg:col-span-2">
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
