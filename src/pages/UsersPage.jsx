import React, { useState, useEffect } from 'react';
import { ModernTable } from '../components/common/ModernTable';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { AddMemberModal } from '../components/modals/AddMemberModal';
import { useApp } from '../context/AppContext';
import { api, BACKEND_URL } from '../services/api';
import { Users, UserPlus, Flame, Watch, Globe } from 'lucide-react';

export function UsersPage() {
  const { setSelectedUser, showToast } = useApp();
  const [usersList, setUsersList] = useState([]);
  const [filterPlan, setFilterPlan] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadUsers(showLoader = true) {
      if (showLoader) setIsLoading(true);
      const data = await api.getUsers(filterPlan);
      if (isMounted && data) {
        setUsersList(data);
      }
      if (showLoader && isMounted) setIsLoading(false);
    }

    loadUsers(true);

    // Auto-sync polling every 4 seconds to instantly capture new Google customer signups
    const interval = setInterval(() => {
      loadUsers(false);
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [filterPlan]);

  const handleAddMember = async (newMember) => {
    const created = await api.createUser(newMember);
    setUsersList((prev) => [created, ...prev]);
    showToast(`Member ${created.name} successfully added!`, 'success');
  };

  const columns = [
    {
      header: 'Member',
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
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
            />
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{row.name}</p>
              <p className="text-xs text-slate-400">{row.email}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Subscription Plan',
      accessor: 'plan',
      cell: (row) => (
        <div>
          <Badge variant={row.planType === 'Premium' ? 'indigo' : 'slate'}>
            {row.planType}
          </Badge>
          <p className="text-[10px] font-medium text-slate-400 mt-1">{row.plan}</p>
        </div>
      )
    },
    {
      header: 'Streak & Minutes',
      accessor: 'streak',
      cell: (row) => (
        <div>
          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-500">
            <Flame className="w-3.5 h-3.5" /> {row.streak} Days
          </span>
          <p className="text-[10px] text-slate-400">{row.totalMinutes ? row.totalMinutes.toLocaleString() : 0} mins practice</p>
        </div>
      )
    },
    {
      header: 'Connected Wearables',
      accessor: 'devicesConnected',
      cell: (row) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {row.devicesConnected && row.devicesConnected.length > 0 ? (
            row.devicesConnected.map((d, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                <Watch className="w-3 h-3 text-cyan-400" /> {d}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">None</span>
          )}
        </div>
      )
    },
    {
      header: 'Country',
      accessor: 'country',
      cell: (row) => (
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-indigo-400" /> {row.country}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'Active' ? 'emerald' : 'rose'}>
          {row.status}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-500 shrink-0" /> Member Directory
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Manage {usersList.length.toLocaleString()} global yoga, meditation, and breathwork practice members.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            icon={UserPlus}
            className="w-full sm:w-auto"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Member
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 border border-slate-300/50 dark:border-slate-700/60 w-full sm:w-96 max-w-full overflow-hidden shadow-inner">
        {[
          { key: 'All', label: 'All Members' },
          { key: 'Premium', label: 'Premium' },
          { key: 'Free', label: 'Free' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterPlan(tab.key)}
            className={`w-full py-2 px-2 text-xs font-bold rounded-xl transition-all text-center truncate select-none ${
              filterPlan === tab.key
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Table */}
      <ModernTable
        title="Active Users"
        columns={columns}
        data={usersList}
        pageSize={10}
        isLoading={isLoading}
        onRowClick={(row) => setSelectedUser(row)}
      />

      {/* Add New Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMember={handleAddMember}
      />
    </div>
  );
}
