import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Bell,
  Send,
  Radio,
  Smartphone,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Zap,
  Flame,
  Award,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export function NotificationBroadcastPage() {
  const { showToast } = useApp();

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const [formState, setFormState] = useState({
    title: 'Kapalbhati Practice Reminder',
    body: 'Your 10-minute morning breathwork session is waiting for you. Tap to begin!',
    type: 'PRACTICE_REMINDER',
    recipientType: 'ALL_CUSTOMERS',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    actionRoute: '/practice-player'
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    const data = await api.getNotifications();
    if (data) setNotifications(data);
    setIsLoading(false);
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!formState.title.trim() || !formState.body.trim()) {
      showToast('Please enter both Title and Message Body', 'warning');
      return;
    }

    setIsSending(true);
    try {
      const result = await api.sendRealtimeNotification(formState);
      if (result) {
        showToast(`⚡ Real-Time Notification "${formState.title}" broadcasted via Socket.io!`, 'success');
        loadNotifications();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
    setIsSending(false);
  };

  const handleDelete = async (id, title) => {
    await api.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n._id !== id && n.id !== id));
    showToast(`Notification "${title}" deleted`, 'info');
  };

  const getBadgeForType = (type) => {
    switch (type) {
      case 'PRACTICE_REMINDER':
        return <Badge variant="emerald" className="font-bold">REMINDER</Badge>;
      case 'NEW_PROGRAM':
        return <Badge variant="indigo" className="font-bold">NEW PROGRAM</Badge>;
      case 'ANNOUNCEMENT':
        return <Badge variant="amber" className="font-bold">ANNOUNCEMENT</Badge>;
      case 'GOAL_ACHIEVED':
        return <Badge variant="sky" className="font-bold">GOAL ACHIEVED</Badge>;
      default:
        return <Badge variant="neutral">GENERAL</Badge>;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-500 mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
            <span>Socket.io WebSockets Engine Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Customer Real-Time Notifications
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Broadcast instant push & socket notifications directly to connected Flutter Mobile App users.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadNotifications}>
            Sync History
          </Button>
        </div>
      </div>

      {/* Main Grid: Broadcast Composer & Live Mobile Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COMPOSER FORM */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle subtitle="Sends instant socket event (customer_notification) to mobile apps & saves to notification tray">
                Real-Time Notification Broadcast Composer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendBroadcast} className="space-y-4">
                {/* Notification Type & Audience */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notification Category</label>
                    <select
                      value={formState.type}
                      onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="PRACTICE_REMINDER">🧘 Practice Reminder</option>
                      <option value="NEW_PROGRAM">⭐ New Goal Program</option>
                      <option value="ANNOUNCEMENT">📢 System Announcement</option>
                      <option value="GOAL_ACHIEVED">🏆 Goal Achievement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Audience</label>
                    <select
                      value={formState.recipientType}
                      onChange={(e) => setFormState({ ...formState, recipientType: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="ALL_CUSTOMERS">📱 All Active Mobile App Customers</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notification Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Time for your Kapalbhati Practice!"
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message Body</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter short, engaging message for the user's mobile screen..."
                    value={formState.body}
                    onChange={(e) => setFormState({ ...formState, body: e.target.value })}
                    className="w-full p-3 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Thumbnail Image URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Thumbnail Cover Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formState.imageUrl}
                    onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-mono rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2">
                  <Button variant="emerald" type="submit" icon={Send} loading={isSending} className="w-full py-3">
                    🚀 Broadcast Real-Time Notification Now
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* LIVE MOBILE PREVIEW CARD */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-slate-800 text-white">
            <CardHeader>
              <CardTitle subtitle="Simulated Flutter Mobile Notification Card">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Smartphone className="w-4 h-4" /> Live Mobile App Preview
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Flutter App Notification Banner */}
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl space-y-3 relative overflow-hidden group">
                <div className="flex items-start gap-3">
                  <img
                    src={formState.imageUrl || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop'}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                        <Bell className="w-3 h-3" /> AURA YOGA • NOW
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <h4 className="text-sm font-extrabold text-white truncate mt-0.5">{formState.title || 'Notification Title'}</h4>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1 font-medium">{formState.body || 'Notification message body will appear here...'}</p>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-700/60 font-mono">
                  <span>Socket.io Event: customer_notification</span>
                  <span className="text-emerald-400 font-bold">Ready to Broadcast</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SENT NOTIFICATIONS HISTORY TABLE */}
      <Card>
        <CardHeader
          actions={
            <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadNotifications}>
              Refresh History
            </Button>
          }
        >
          <CardTitle subtitle="Real-time broadcast history stored in MongoDB & delivered via Socket.io WebSockets">
            Sent Notifications History ({notifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <Bell className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No broadcast notifications sent yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-500 uppercase">
                    <th className="py-3 px-4">Notification</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Audience</th>
                    <th className="py-3 px-4">Delivery Engine</th>
                    <th className="py-3 px-4">Sent At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
                  {notifications.map((item) => (
                    <tr key={item._id || item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop'}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <strong className="block text-slate-900 dark:text-white font-bold">{item.title}</strong>
                            <span className="text-slate-400 line-clamp-1">{item.body}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getBadgeForType(item.type)}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-300">{item.recipientType}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-extrabold font-mono text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Socket.io WebSockets
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDelete(item._id || item.id, item.title)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
