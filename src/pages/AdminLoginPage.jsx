import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Flower2, Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button';

export function AdminLoginPage() {
  const { loginAdmin, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.adminLogin({ email, password });
      
      if (response && response.success) {
        loginAdmin(response.data);
        showToast('Welcome back! Admin Portal unlocked.', 'success');
      } else {
        const errorMsg = response?.message || 'Invalid admin credentials or unauthorized account.';
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      showToast('Authentication failed. Please check server connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Glow Circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 sm:space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl gradient-bg-primary text-white shadow-glow-primary mb-2">
            <Flower2 className="w-9 h-9 animate-pulse-slow" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" /> AURA Admin Portal
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Executive Portal Sign In
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Enter your admin credentials to manage yoga sequences, telemetry, and customer accounts.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="glass-card-dark p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aura.io"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-semibold transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" /> Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-semibold transition-all"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full py-3.5 text-sm font-bold shadow-glow-primary"
            >
              Sign In to Admin Portal <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Encrypted 256-Bit SSL Admin Session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
