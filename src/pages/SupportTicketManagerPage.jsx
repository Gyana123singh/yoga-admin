import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  LifeBuoy,
  MessageSquare,
  Send,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  ShieldCheck,
  Plus,
  Trash2,
  RefreshCw,
  Radio,
  Sparkles,
  Inbox,
  X
} from 'lucide-react';

export function SupportTicketManagerPage() {
  const { showToast } = useApp();

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // New Ticket Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.sharma@example.com',
    subject: 'Audio buffering issue during practice player session',
    category: 'TECHNICAL_ISSUE',
    priority: 'HIGH',
    initialMessage: 'Whenever I launch the practice session, background ambient music takes 30s to load. Please help!'
  });

  useEffect(() => {
    loadTickets();
  }, [statusFilter]);

  const loadTickets = async () => {
    setIsLoading(true);
    const data = await api.getTickets(statusFilter, searchQuery);
    if (data) {
      setTickets(data);
      if (data.length > 0 && !selectedTicket) {
        setSelectedTicket(data[0]);
      } else if (selectedTicket) {
        const found = data.find((t) => (t._id || t.id) === (selectedTicket._id || selectedTicket.id));
        if (found) setSelectedTicket(found);
      }
    }
    setIsLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadTickets();
  };

  const handleSelectTicket = async (ticket) => {
    const fullTicket = await api.getTicketById(ticket._id || ticket.id);
    setSelectedTicket(fullTicket || ticket);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    setIsSending(true);
    try {
      const updated = await api.replyTicket(selectedTicket._id || selectedTicket.id, {
        sender: 'ADMIN',
        senderName: 'AURA Support Team',
        text: replyText.trim()
      });

      if (updated) {
        setSelectedTicket(updated);
        setReplyText('');
        showToast('⚡ Reply posted live & Socket.io notification sent to Customer!', 'success');
        loadTickets();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
    setIsSending(false);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedTicket) return;
    const updated = await api.updateTicketStatus(selectedTicket._id || selectedTicket.id, newStatus);
    if (updated) {
      setSelectedTicket(updated);
      showToast(`Ticket status updated to ${newStatus}`, 'info');
      loadTickets();
    }
  };

  const handleCreateTicketSubmit = async (e) => {
    e.preventDefault();
    const created = await api.createTicket(newTicketForm);
    if (created) {
      showToast(`Support Ticket ${created.ticketNumber} created!`, 'success');
      setShowCreateModal(false);
      loadTickets();
      setSelectedTicket(created);
    }
  };

  const handleDeleteTicket = async (id, ticketNumber) => {
    await api.deleteTicket(id);
    setTickets((prev) => prev.filter((t) => (t._id || t.id) !== id));
    if (selectedTicket && (selectedTicket._id || selectedTicket.id) === id) {
      setSelectedTicket(null);
    }
    showToast(`Ticket ${ticketNumber} deleted`, 'info');
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'URGENT':
        return <Badge variant="danger" className="font-extrabold uppercase">URGENT</Badge>;
      case 'HIGH':
        return <Badge variant="amber" className="font-extrabold uppercase">HIGH</Badge>;
      case 'MEDIUM':
        return <Badge variant="indigo" className="font-bold uppercase">MEDIUM</Badge>;
      default:
        return <Badge variant="neutral" className="font-bold uppercase">LOW</Badge>;
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'OPEN':
        return <Badge variant="amber" className="font-extrabold">OPEN</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="indigo" className="font-extrabold">IN PROGRESS</Badge>;
      case 'RESOLVED':
        return <Badge variant="emerald" className="font-extrabold">RESOLVED</Badge>;
      default:
        return <Badge variant="neutral">CLOSED</Badge>;
    }
  };

  const openCount = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED').length;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
            <span>Socket.io Live Support Desk Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Customer Support Tickets & Helpdesk
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-threaded support desk connecting mobile app customers with admin support agents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadTickets}>
            Sync Tickets
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowCreateModal(true)}>
            New Ticket
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Tickets</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{tickets.length}</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
          <span className="text-xs font-bold text-amber-500 uppercase">Open Inquiries</span>
          <p className="text-2xl font-extrabold text-amber-500">{openCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
          <span className="text-xs font-bold text-indigo-400 uppercase">In Progress</span>
          <p className="text-2xl font-extrabold text-indigo-400">{inProgressCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
          <span className="text-xs font-bold text-emerald-500 uppercase">Resolved Tickets</span>
          <p className="text-2xl font-extrabold text-emerald-500">{resolvedCount}</p>
        </div>
      </div>

      {/* SPLIT VIEW HELPDESK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: TICKET LIST & FILTERS */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle subtitle="Customer support inbox">Ticket Feed</CardTitle>
                <div className="flex items-center gap-1">
                  {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase transition-colors ${
                        statusFilter === st
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'IN_PROGRESS' ? 'IN PROG' : st}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Search input */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search ticket #, subject or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>

              {/* Tickets Scroll List */}
              <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
                {tickets.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <Inbox className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
                    <p className="text-xs font-bold text-slate-400">No support tickets found.</p>
                  </div>
                ) : (
                  tickets.map((t) => {
                    const isSelected = selectedTicket && (selectedTicket._id || selectedTicket.id) === (t._id || t.id);
                    return (
                      <div
                        key={t._id || t.id}
                        onClick={() => handleSelectTicket(t)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                          isSelected
                            ? 'bg-indigo-50/80 dark:bg-slate-800/90 border-indigo-500 shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-extrabold text-indigo-500">{t.ticketNumber}</span>
                          <div className="flex items-center gap-1.5">
                            {getPriorityBadge(t.priority)}
                            {getStatusBadge(t.status)}
                          </div>
                        </div>

                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-1">
                          {t.subject}
                        </h4>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <span className="font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" /> {t.customerName}
                          </span>
                          <span className="font-mono">
                            {new Date(t.updatedAt || t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL: LIVE THREAD VIEWER & REPLY COMPOSER */}
        <div className="lg:col-span-7 space-y-4">
          {!selectedTicket ? (
            <Card className="h-[600px] flex items-center justify-center text-center">
              <div className="space-y-3 p-6">
                <LifeBuoy className="w-12 h-12 text-indigo-500 mx-auto opacity-50" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Select a Ticket from the Inbox</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click on any customer ticket to inspect full conversation history, issue details, and post real-time replies.
                </p>
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col h-[650px]">
              {/* Ticket Details Bar */}
              <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-t-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs sm:text-sm font-mono font-extrabold text-indigo-500 whitespace-nowrap">{selectedTicket.ticketNumber}</span>
                    <span className="whitespace-nowrap">{getStatusBadge(selectedTicket.status)}</span>
                    <span className="whitespace-nowrap">{getPriorityBadge(selectedTicket.priority)}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug break-words">
                    {selectedTicket.subject}
                  </h3>
                  <p className="text-[11px] sm:text-xs font-medium text-slate-400 truncate">
                    Customer: <strong className="text-slate-700 dark:text-slate-200">{selectedTicket.customerName}</strong> ({selectedTicket.customerEmail})
                  </p>
                </div>

                {/* Quick Status Toggles */}
                <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-1 sm:pt-0">
                  {selectedTicket.status !== 'RESOLVED' && (
                    <Button
                      variant="emerald"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => handleStatusChange('RESOLVED')}
                      className="px-2.5 py-1 text-xs"
                    >
                      Resolve
                    </Button>
                  )}
                  {selectedTicket.status === 'OPEN' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange('IN_PROGRESS')}
                      className="px-2.5 py-1 text-xs"
                    >
                      In Progress
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDeleteTicket(selectedTicket._id || selectedTicket.id, selectedTicket.ticketNumber)}
                    className="px-2 py-1 text-xs"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Conversation Messages Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-100/40 dark:bg-slate-950/40">
                {selectedTicket.messages && selectedTicket.messages.map((msg, idx) => {
                  const isAdmin = msg.sender === 'ADMIN';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-1 px-1">
                        <span>{msg.senderName}</span>
                        <span>•</span>
                        <span className="font-mono">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed font-medium shadow-xs ${
                          isAdmin
                            ? 'bg-indigo-600 text-white rounded-tr-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-tl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-3xl shrink-0 space-y-2">
                <div className="relative">
                  <textarea
                    rows={2}
                    placeholder="Type your response to the customer... (Emits Socket.io real-time event on submit)"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-3 pr-12 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    loading={isSending}
                    icon={Send}
                    className="absolute right-2 bottom-2 py-1.5 px-3"
                  >
                    Send Reply
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>

      {/* CREATE NEW TEST TICKET MODAL */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 relative cursor-default"
          >
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 pr-8">
              <LifeBuoy className="w-6 h-6 text-indigo-500" /> Create New Customer Support Ticket
            </h3>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={newTicketForm.customerName}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Email</label>
                  <input
                    type="email"
                    required
                    value={newTicketForm.customerEmail}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select
                    value={newTicketForm.category}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="TECHNICAL_ISSUE">Technical Issue</option>
                    <option value="SUBSCRIPTION_BILLING">Subscription / Billing</option>
                    <option value="PRACTICE_FEEDBACK">Practice Feedback</option>
                    <option value="GENERAL_INQUIRY">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priority</label>
                  <select
                    value={newTicketForm.priority}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Initial Message</label>
                <textarea
                  rows={3}
                  required
                  value={newTicketForm.initialMessage}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, initialMessage: e.target.value })}
                  className="w-full p-2.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" icon={Plus}>
                  Create Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
