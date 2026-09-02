import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ModernTable } from '../components/common/ModernTable';
import { CreateCouponModal } from '../components/modals/CreateCouponModal';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  CreditCard,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Tag,
  Trash2,
  Edit3,
  Percent,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export function SubscriptionsPage() {
  const { showToast } = useApp();
  const [summaryData, setSummaryData] = useState(null);
  const [couponsList, setCouponsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planPriceInput, setPlanPriceInput] = useState('');

  // Default plans fallback / state
  const [plans, setPlans] = useState([
    { id: 'starter', name: 'Starter Free', price: '$0', users: '99,610 members', features: 'Basic Asana library, Standard 3m Breathing', period: 'Forever' },
    { id: 'monthly', name: 'Monthly Pro', price: '$14.99/mo', users: '34,200 members', features: 'Unlimited AI Flow generator, Watch telemetry', period: 'Per month' },
    { id: 'annual', name: 'Annual Pro', price: '$149/yr', users: '14,710 members', features: 'Save 20%, Live Stream Masterclasses, Family sharing', period: 'Per year' },
  ]);

  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    async function loadSubscriptionData() {
      setIsLoading(true);
      const [summaryRes, couponsRes, usersRes] = await Promise.all([
        api.getSubscriptionsSummary(),
        api.getCoupons(),
        api.getUsers()
      ]);

      if (summaryRes) {
        setSummaryData(summaryRes);
      }
      if (couponsRes) {
        setCouponsList(couponsRes);
      }
      if (usersRes && usersRes.length > 0) {
        const formattedInvoices = usersRes.map((u, i) => ({
          id: `INV-${1000 + i}`,
          user: u.name || u.email || 'Member User',
          plan: u.plan || (u.planType === 'Premium' ? 'Annual Pro' : 'Starter Free'),
          amount: u.planType === 'Premium' ? '$149.00' : '$0.00',
          status: u.status || 'Paid',
          date: u.joinedDate || new Date().toISOString().split('T')[0]
        }));
        setInvoices(formattedInvoices);
      }
      setIsLoading(false);
    }
    loadSubscriptionData();
  }, []);

  const handleAddCoupon = async (newCoupon) => {
    const created = await api.createCoupon({
      code: newCoupon.code,
      discountPercent: newCoupon.discountValue || 20,
      validUntil: newCoupon.expiryDate || '2026-12-31',
      maxRedemptions: newCoupon.maxRedemptions || 500,
      planTier: newCoupon.appliesTo || 'All Plans'
    });

    setCouponsList((prev) => [created, ...prev]);
    showToast(`Coupon "${created.code}" is live!`, 'success');
  };

  const handleDeleteCoupon = async (codeOrId) => {
    await api.deleteCoupon(codeOrId);
    setCouponsList((prev) => prev.filter((c) => (c.code !== codeOrId && c._id !== codeOrId && c.id !== codeOrId)));
    showToast(`Coupon removed successfully`, 'warning');
  };

  const handleSavePlanPrice = () => {
    if (!editingPlan) return;
    setPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...p, price: planPriceInput } : p));
    showToast(`Updated pricing for ${editingPlan.name} to ${planPriceInput}`, 'success');
    setEditingPlan(null);
  };

  const invoiceColumns = [
    { header: 'Invoice ID', accessor: 'id', cell: (r) => <span className="font-mono font-bold text-xs text-indigo-500">{r.id}</span> },
    { header: 'Member', accessor: 'user', cell: (r) => <span className="font-bold text-xs text-slate-900 dark:text-white">{r.user}</span> },
    { header: 'Plan Tier', accessor: 'plan', cell: (r) => <Badge variant="indigo">{r.plan}</Badge> },
    { header: 'Amount', accessor: 'amount', cell: (r) => <span className="font-extrabold text-xs text-emerald-500">{r.amount}</span> },
    { header: 'Status', accessor: 'status', cell: (r) => <Badge variant={r.status === 'Paid' ? 'emerald' : 'rose'} size="sm">{r.status}</Badge> },
    { header: 'Date', accessor: 'date', cell: (r) => <span className="text-xs text-slate-400 font-medium">{r.date}</span> },
  ];

  const couponColumns = [
    {
      header: 'Promo Code',
      accessor: 'code',
      cell: (r) => (
        <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          {r.code}
        </span>
      )
    },
    {
      header: 'Discount',
      accessor: 'discountPercent',
      cell: (r) => (
        <span className="font-extrabold text-xs text-emerald-500 flex items-center gap-1">
          <Percent className="w-3.5 h-3.5" /> {r.discountPercent || r.discountValue}% OFF
        </span>
      )
    },
    {
      header: 'Applies To',
      accessor: 'planTier',
      cell: (r) => <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{r.planTier || r.appliesTo || 'All Plans'}</span>
    },
    {
      header: 'Redemptions',
      accessor: 'redemptionsCount',
      cell: (r) => (
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
          {r.redemptionsCount || 0} / {r.maxRedemptions || 500}
        </span>
      )
    },
    {
      header: 'Valid Until',
      accessor: 'validUntil',
      cell: (r) => (
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-indigo-400" /> {r.validUntil || r.expiryDate || '2026-12-31'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (r) => (
        <Badge variant={r.status === 'Active' ? 'emerald' : 'slate'} size="sm">
          {r.status || 'Active'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (r) => (
        <button
          onClick={() => handleDeleteCoupon(r.code || r._id || r.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          title="Delete Coupon"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-500 shrink-0" /> Subscriptions & Billing Engine
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Manage MRR analytics, active subscription tiers, discount coupons, and payment invoices.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            icon={Plus}
            className="w-full sm:w-auto shadow-glow-primary"
            onClick={() => setIsCouponModalOpen(true)}
          >
            Create Discount Coupon
          </Button>
        </div>
      </div>

      {/* KPI Overview Summary */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Revenue (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {summaryData?.mrr || '$348,900'}
          </p>
          <p className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.5% from last month
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Annual Run Rate (ARR)</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {summaryData?.arr || '$4.18M'}
          </p>
          <p className="text-[11px] font-semibold text-cyan-400">Projected 2026 ARR target</p>
        </div>

        <div className="p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Paid Members</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {(summaryData?.activeSubscribers || 48910).toLocaleString()}
          </p>
          <p className="text-[11px] font-semibold text-indigo-400">Pro Annual & Monthly Pro</p>
        </div>

        <div className="p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/80 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Churn Rate</span>
            <CheckCircle2 className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {summaryData?.churnRate || '1.4%'}
          </p>
          <p className="text-[11px] font-semibold text-emerald-500">Below industry 2.5% benchmark</p>
        </div>
      </div>

      {/* Subscription Tiers Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-indigo-500" /> Active Plan Tiers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <Card key={p.id} gradientBorder={i === 1}>
              <CardHeader actions={<Badge variant={i === 1 ? 'indigo' : 'slate'}>{p.users}</Badge>}>
                <CardTitle subtitle={p.features}>{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{p.price}</h3>
                  <span className="text-xs font-semibold text-slate-400">/ {p.period}</span>
                </div>
                <Button
                  variant={i === 1 ? 'primary' : 'glass'}
                  className="w-full"
                  icon={Edit3}
                  onClick={() => {
                    setEditingPlan(p);
                    setPlanPriceInput(p.price);
                  }}
                >
                  Edit Tier Pricing
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Discount Coupons Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-indigo-500" /> Active Promotional Coupons ({couponsList.length})
          </h3>
          <Button variant="ghost" size="sm" icon={Plus} onClick={() => setIsCouponModalOpen(true)}>
            Add Coupon
          </Button>
        </div>

        <ModernTable
          columns={couponColumns}
          data={couponsList}
          pageSize={5}
          isLoading={isLoading}
        />
      </div>

      {/* Recent Billing Invoices Table */}
      <ModernTable
        title="Recent Billing Invoices"
        columns={invoiceColumns}
        data={invoices}
        pageSize={5}
      />

      {/* Create New Coupon Modal */}
      <CreateCouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onAddCoupon={handleAddCoupon}
      />

      {/* Edit Tier Pricing Modal */}
      {editingPlan && (
        <Modal
          isOpen={Boolean(editingPlan)}
          onClose={() => setEditingPlan(null)}
          title={`Edit ${editingPlan.name} Tier Pricing`}
          subtitle="Update public display price and billing frequency for this subscription level"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Tier Name
              </label>
              <input
                type="text"
                disabled
                value={editingPlan.name}
                className="w-full px-3.5 py-2.5 text-sm font-bold rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Display Price Tag
              </label>
              <input
                type="text"
                value={planPriceInput}
                onChange={(e) => setPlanPriceInput(e.target.value)}
                placeholder="e.g. $19.99/mo"
                className="w-full px-3.5 py-2.5 text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="ghost" onClick={() => setEditingPlan(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSavePlanPrice}>
                Save Price Tier
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
