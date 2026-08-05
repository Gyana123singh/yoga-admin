import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Tag, Percent, DollarSign, Calendar, Users, Shield, Sparkles, Plus, RefreshCw } from 'lucide-react';

export function CreateCouponModal({ isOpen, onClose, onAddCoupon }) {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    code: 'AURA50OFF',
    discountType: 'percentage', // 'percentage' | 'fixed'
    discountValue: '20',
    appliesTo: 'All Plans',
    maxRedemptions: '500',
    expiryDate: '2024-12-31',
    status: 'Active',
  });

  const generateRandomCode = () => {
    const prefixes = ['AURA', 'MINDFUL', 'YOGA', 'ZEN', 'WELLNESS'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(Math.random() * 90 + 10);
    setFormData((prev) => ({ ...prev, code: `${randomPrefix}${randomNum}` }));
    showToast('Generated fresh coupon code!', 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      showToast('Please enter a valid coupon code', 'warning');
      return;
    }

    const newCoupon = {
      id: `CPN-${Math.floor(Math.random() * 9000 + 1000)}`,
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      appliesTo: formData.appliesTo,
      maxRedemptions: formData.maxRedemptions,
      expiryDate: formData.expiryDate,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (onAddCoupon) {
      onAddCoupon(newCoupon);
    }

    showToast(`Coupon "${newCoupon.code}" created successfully!`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Discount Coupon"
      subtitle="Configure promotional discount codes for subscription billing tiers"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Coupon Code Input with Auto-Generate Button */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-500" /> Coupon Promo Code <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. SUMMER2024"
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold uppercase rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <Button
              variant="secondary"
              size="sm"
              type="button"
              icon={RefreshCw}
              onClick={generateRandomCode}
              className="shrink-0"
            >
              Generate
            </Button>
          </div>
        </div>

        {/* Discount Type & Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-indigo-500" /> Discount Type
            </label>
            <select
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="percentage">Percentage Discount (%)</option>
              <option value="fixed">Fixed Amount Off ($)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Discount Value
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
              placeholder={formData.discountType === 'percentage' ? '20 (%)' : '15 ($)'}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Applies To & Max Redemptions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-500" /> Applies To Plan
            </label>
            <select
              value={formData.appliesTo}
              onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="All Plans">All Subscription Plans</option>
              <option value="Annual Pro ($149/yr)">Annual Pro ($149/yr)</option>
              <option value="Monthly Pro ($14.99/mo)">Monthly Pro ($14.99/mo)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-500" /> Redemption Limit
            </label>
            <input
              type="number"
              min="1"
              value={formData.maxRedemptions}
              onChange={(e) => setFormData({ ...formData, maxRedemptions: e.target.value })}
              placeholder="e.g. 500"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Expiration Date & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Expiration Date
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Initial Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="Active">Active Immediately</option>
              <option value="Scheduled">Scheduled for Later</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Plus}>
            Create Coupon
          </Button>
        </div>
      </form>
    </Modal>
  );
}
