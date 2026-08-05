import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ModernTable } from '../components/common/ModernTable';
import { CreateCouponModal } from '../components/modals/CreateCouponModal';
import { api, BACKEND_URL } from '../services/api';
import { CreditCard, Plus } from 'lucide-react';

export function SubscriptionsPage() {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  const plans = [
    { name: 'Starter Free', price: '$0', users: '99,610 members', features: 'Basic Asana library, Standard 3m Breathing' },
    { name: 'Monthly Pro', price: '$14.99/mo', users: '34,200 members', features: 'Unlimited AI Flow generator, Watch telemetry' },
    { name: 'Annual Pro', price: '$149/yr', users: '14,710 members', features: 'Save 20%, Live Stream Masterclasses, Family sharing' },
  ];

  const invoices = [
    { id: 'INV-9021', user: 'Elena Rostova', plan: 'Annual Pro', amount: '$149.00', status: 'Paid', date: '2024-06-01' },
    { id: 'INV-9022', user: 'Marcus Vance', plan: 'Monthly Pro', amount: '$14.99', status: 'Paid', date: '2024-06-01' },
    { id: 'INV-9023', user: 'Dr. Liam Thorne', plan: 'Pro Lifetime', amount: '$499.00', status: 'Paid', date: '2024-05-28' },
  ];

  const invoiceColumns = [
    { header: 'Invoice ID', accessor: 'id', cell: (r) => <span className="font-mono font-bold text-xs">{r.id}</span> },
    { header: 'Member', accessor: 'user', cell: (r) => <span className="font-bold text-xs">{r.user}</span> },
    { header: 'Plan Tier', accessor: 'plan', cell: (r) => <Badge variant="indigo">{r.plan}</Badge> },
    { header: 'Amount', accessor: 'amount', cell: (r) => <span className="font-extrabold text-xs text-emerald-500">{r.amount}</span> },
    { header: 'Status', accessor: 'status', cell: (r) => <Badge variant="emerald" size="sm">{r.status}</Badge> },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-500 shrink-0" /> Subscriptions & Billing
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Manage subscription tiers, MRR analytics, coupon codes, and transaction invoices.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            icon={Plus}
            className="w-full sm:w-auto"
            onClick={() => setIsCouponModalOpen(true)}
          >
            Create New Coupon
          </Button>
        </div>
      </div>

      {/* Plan Tiers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, i) => (
          <Card key={i} gradientBorder={i === 1}>
            <CardHeader actions={<Badge variant={i === 1 ? 'indigo' : 'slate'}>{p.users}</Badge>}>
              <CardTitle subtitle={p.features}>{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{p.price}</h3>
              <Button variant={i === 1 ? 'primary' : 'glass'} className="w-full">
                Edit Tier Pricing
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invoices Table */}
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
      />
    </div>
  );
}
