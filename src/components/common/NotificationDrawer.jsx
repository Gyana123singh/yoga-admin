import React from 'react';
import { Drawer } from './Drawer';
import { MOCK_RECENT_NOTIFICATIONS } from '../../constants/mockData';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle, ShieldAlert, Sparkles, CreditCard, Activity } from 'lucide-react';
import { Button } from './Button';

export function NotificationDrawer() {
  const { isNotificationsOpen, setIsNotificationsOpen } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case 'system': return Sparkles;
      case 'health': return Activity;
      case 'revenue': return CreditCard;
      case 'alert': return ShieldAlert;
      default: return Bell;
    }
  };

  return (
    <Drawer
      isOpen={isNotificationsOpen}
      onClose={() => setIsNotificationsOpen(false)}
      title="Notifications & Alerts"
      subtitle="Real-time telemetry and system updates"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Recent System Logs
          </span>
          <Button variant="ghost" size="sm">
            Mark all read
          </Button>
        </div>

        <div className="space-y-3">
          {MOCK_RECENT_NOTIFICATIONS.map((item) => {
            const Icon = getIcon(item.type);
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl glass-card-light dark:glass-card-dark border border-slate-200/60 dark:border-slate-800 hover:border-indigo-500/40 transition-colors flex items-start gap-3"
              >
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-medium text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Drawer>
  );
}
