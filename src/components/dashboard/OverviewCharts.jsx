import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  REVENUE_RETENTION_SERIES,
  DAILY_PRACTICE_DISTRIBUTION,
  SMARTWATCH_USAGE_STATS,
  COUNTRY_ANALYTICS
} from '../../constants/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';

export function OverviewCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue & MRR Growth Area Chart */}
      <Card className="lg:col-span-2">
        <CardHeader
          actions={
            <div className="flex items-center gap-2">
              <Badge variant="indigo">Monthly MRR</Badge>
              <Badge variant="emerald">+18.5% YoY</Badge>
            </div>
          }
        >
          <CardTitle subtitle="6-Month Subscription Revenue & Retention Performance">
            Revenue & Platform Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56 xs:h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_RETENTION_SERIES} margin={{ top: 10, right: 5, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" name="Total Revenue" />
                <Area type="monotone" dataKey="mrr" stroke="#06B6D4" strokeWidth={2.5} fillOpacity={1} fill="url(#mrrGrad)" name="MRR" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Practice Type Distribution Doughnut Chart */}
      <Card>
        <CardHeader>
          <CardTitle subtitle="Real-time breakdown of practice categories">
            Daily Session Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-44 sm:h-48 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DAILY_PRACTICE_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="percentage"
                >
                  {DAILY_PRACTICE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val) => [`${val}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">68.4k</span>
              <span className="text-[10px] font-semibold text-slate-400">Sessions Today</span>
            </div>
          </div>

          {/* Legend list */}
          <div className="mt-3 space-y-2">
            {DAILY_PRACTICE_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                  <span className="text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                </div>
                <span className="text-slate-500 font-bold shrink-0 ml-2">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Global Country Demographics */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle subtitle="User distribution across major regions">
            Geographic Wellness Footprint
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
            {COUNTRY_ANALYTICS.map((c, idx) => (
              <div key={idx} className="p-3 sm:p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
                <span className="text-xl sm:text-2xl shrink-0">{c.flag}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{c.country}</p>
                  <p className="text-sm font-extrabold text-indigo-500">{c.users}</p>
                  <p className="text-[10px] text-slate-400 truncate">{c.percentage}% global traffic</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
