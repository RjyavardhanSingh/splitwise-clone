import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGroup, inviteMember } from '../api/groups.api';
import { getExpenses, deleteExpense } from '../api/expenses.api';
import { getGroupBalances } from '../api/balances.api';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import MemberList from '../components/group/MemberList';
import BalanceSummary from '../components/group/BalanceSummary';
import ActivityFeed from '../components/group/ActivityFeed';
import AddExpenseModal from '../components/modals/AddExpenseModal';
import SettleUpModal from '../components/modals/SettleUpModal';

const COLORS = ['#FEE2E2', '#DBEAFE', '#D1FAE5', '#FEF3C7', '#EDE9FE', '#FCE7F3', '#CFFAFE', '#FFEDD5'];

function getInitials(name) {
  return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

export default function GroupDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [settleBalance, setSettleBalance] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteMsg, setInviteMsg] = useState('');
  const [inviting, setInviting] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showInviteInput, setShowInviteInput] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [groupData, expensesData, balancesData] = await Promise.all([
        getGroup(id),
        getExpenses(id),
        getGroupBalances(id),
      ]);
      setGroup(groupData);
      setExpenses(expensesData);
      setBalances(balancesData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load group');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleDeleteExpense = async (expenseId) => {
    try {
      await deleteExpense(id, expenseId);
      fetchData();
    } catch (err) {}
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteError('');
    setInviteMsg('');
    try {
      await inviteMember(id, inviteEmail.trim());
      setInviteMsg('Invite sent!');
      setInviteEmail('');
    } catch (err) {
      setInviteError(err.response?.data?.error || 'Failed to send invite');
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout onSettingsOpen={() => setSettingsOpen(true)}>
        <div className="p-6 space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 dark:bg-[#2a2a35]" />
          <div className="h-48 bg-gray-200 rounded-2xl dark:bg-[#2a2a35]" />
          <div className="h-64 bg-gray-200 rounded-2xl dark:bg-[#2a2a35]" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout onSettingsOpen={() => setSettingsOpen(true)}>
        <div className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchData} className="text-sm text-[#5B5BF7] hover:underline">Retry</button>
        </div>
      </AppLayout>
    );
  }

  if (!group) return null;

  return (
    <AppLayout onSettingsOpen={() => setSettingsOpen(true)}>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
          <Link to="/dashboard" className="hover:text-gray-600 transition-colors">Dashboard</Link>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-700 font-medium truncate dark:text-[#f1f1f1]">{group.name}</span>
        </div>

        {/* Group Header Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 relative overflow-hidden dark:bg-[#1a1a23] dark:border-[#2a2a35]">
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0"
                style={{ backgroundColor: COLORS[0], color: '#374151' }}
              >
                {getInitials(group.name)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-[#f1f1f1]">{group.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5 dark:text-gray-400">
                  {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                  {group.members.find(m => m.id === user?.id)?.role === 'ADMIN' && ' · Admin'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddExpense(true)}
              className="px-5 py-2.5 bg-[#5B5BF7] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm"
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* Members + Invite */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 dark:bg-[#1a1a23] dark:border-[#2a2a35]">
          <div className="flex items-start justify-between mb-4">
            <MemberList members={group.members} />
            <button
              onClick={() => setShowInviteInput(!showInviteInput)}
              className="text-sm text-[#5B5BF7] font-medium hover:opacity-80 whitespace-nowrap"
            >
              {showInviteInput ? 'Cancel' : '+ Invite'}
            </button>
          </div>

          {showInviteInput && (
            <div className="mt-3 pt-4 border-t border-gray-100 dark:border-[#2a2a35]">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="friend@email.com"
                  value={inviteEmail}
                  onChange={(e) => { setInviteEmail(e.target.value); setInviteMsg(''); setInviteError(''); }}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/20 focus:border-[#5B5BF7] transition-all dark:border-[#2a2a35] dark:bg-[#22222e]"
                />
                <button
                  onClick={handleInvite}
                  disabled={inviting}
                  className="px-5 py-2.5 bg-[#5B5BF7] text-white text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {inviting ? 'Sending...' : 'Invite'}
                </button>
              </div>
              {inviteError && <p className="text-xs text-red-600 mt-2">{inviteError}</p>}
              {inviteMsg && <p className="text-xs text-emerald-600 mt-2">{inviteMsg}</p>}
            </div>
          )}
        </div>

        {/* Balances */}
        <BalanceSummary
          balances={balances}
          groupName={group.name}
          onSettle={(b) => setSettleBalance(b)}
        />

        {/* Activity */}
        <ActivityFeed
          expenses={expenses}
          currentUserId={user?.id}
          onDeleteExpense={handleDeleteExpense}
        />
      </div>

      {showAddExpense && (
        <AddExpenseModal
          groupId={id}
          members={group.members}
          onClose={() => setShowAddExpense(false)}
          onExpenseAdded={fetchData}
        />
      )}

      {settleBalance && (
        <SettleUpModal
          groupId={id}
          balance={settleBalance}
          members={group.members}
          onClose={() => setSettleBalance(null)}
          onSettled={fetchData}
        />
      )}
    </AppLayout>
  );
}
