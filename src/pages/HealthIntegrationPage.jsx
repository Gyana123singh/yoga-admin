import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { api, BACKEND_URL } from '../services/api';
import { SMARTWATCH_USAGE_STATS } from '../constants/mockData';
import { HeartPulse, Watch, RefreshCw, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function HealthIntegrationPage() {
  const hrvData = [
    { time: '08:00', hrv: 62, heartRate: 72 },
    { time: '10:00', hrv: 58, heartRate: 78 },
    { time: '12:00', hrv: 74, heartRate: 65 },
    { time: '14:00', hrv: 81, heartRate: 62 },
    { time: '16:00', hrv: 69, heartRate: 70 },
    { time: '18:00', hrv: 78, heartRate: 64 },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <HeartPulse className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500 shrink-0" /> Apple Health & Wearables Integration
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Real-time biometric telemetry ingestion, OAuth permissions, and device sync diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="primary" icon={RefreshCw} className="w-full sm:w-auto">
            Force Telemetry Resync
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sync Rate Graph */}
        <Card className="lg:col-span-2">
          <CardHeader actions={<Badge variant="emerald">Live Stream Active</Badge>}>
            <CardTitle subtitle="Continuous 24-hour HRV & Resting Heart Rate Telemetry">
              Biometric Ingestion Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hrvData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="hrv" stroke="#10B981" strokeWidth={3} name="HRV (ms)" />
                  <Line type="monotone" dataKey="heartRate" stroke="#EF4444" strokeWidth={2.5} name="Heart Rate (BPM)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Wearables Status */}
        <Card>
          <CardHeader>
            <CardTitle subtitle="HealthKit & Android Health Connect">
              API Integration Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {SMARTWATCH_USAGE_STATS.map((dev, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Watch className="w-4 h-4 text-indigo-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{dev.device}</p>
                    <p className="text-[10px] text-slate-400">{dev.users.toLocaleString()} devices paired</p>
                  </div>
                </div>
                <Badge variant="emerald" size="sm">Connected</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
