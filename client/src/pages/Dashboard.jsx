import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../api/balances.api';
import { getGroups } from '../api/groups.api';
import { getPendingInvites, acceptInvite } from '../api/groups.api';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import BalanceBanner from '../components/dashboard/BalanceBanner';
import GroupCard from '../components/dashboard/GroupCard';
import SettingsModal from '../components/modals/SettingsModal';
import formatINR from '../utils/formatCurrency';
import dashboardImg from '../assets/dashboardimg.png';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [groupsData, dashData, invitesData] = await Promise.all([
        getGroups(),
        getDashboard(),
        getPendingInvites(),
      ]);
      setGroups(groupsData);
      setDashboardData(dashData);
      setInvites(invitesData);
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAcceptInvite = async (token) => {
    try {
      await acceptInvite(token);
      fetchData();
    } catch (err) {}
  };

  const netBalance = dashboardData?.netBalance ?? 0;
  const youOwe = groups.reduce((s, g) => s + (g.userNetBalance < 0 ? Math.abs(g.userNetBalance) : 0), 0);
  const youAreOwed = groups.reduce((s, g) => s + (g.userNetBalance > 0 ? g.userNetBalance : 0), 0);

  if (loading) {
    return (
      <AppLayout onSettingsOpen={() => setShowSettings(true)}>
        <div className="p-6 animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-[#2a2a35] rounded w-1/3" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 dark:bg-[#2a2a35] rounded-xl" />
            <div className="h-24 bg-gray-200 dark:bg-[#2a2a35] rounded-xl" />
            <div className="h-24 bg-gray-200 dark:bg-[#2a2a35] rounded-xl" />
          </div>
          <div className="h-16 bg-gray-200 dark:bg-[#2a2a35] rounded-xl" />
          <div className="h-16 bg-gray-200 dark:bg-[#2a2a35] rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout onSettingsOpen={() => setShowSettings(true)}>
        <div className="p-6 text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchData} className="text-sm font-medium text-[#5B5BF7] hover:underline">
            Retry
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout onSettingsOpen={() => setShowSettings(true)}>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Greeting */}
        <div className="bg-white dark:bg-[#1a1a23] rounded-2xl border border-gray-100 dark:border-[#2a2a35] overflow-hidden mb-6">
          <div className="flex items-stretch">
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-[#f1f1f1]">
                    {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Here's your financial snapshot</p>
                </div>
                <Link
                  to="/groups/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5B5BF7] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Group
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-[#22222e] rounded-xl p-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">You Owe</p>
                  <p className="text-lg font-bold text-red-600 mt-0.5">{formatINR(youOwe)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#22222e] rounded-xl p-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">You Are Owed</p>
                  <p className="text-lg font-bold text-emerald-600 mt-0.5">{formatINR(youAreOwed)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#22222e] rounded-xl p-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Groups</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-[#f1f1f1] mt-0.5">{groups.length}</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block w-48 shrink-0 bg-indigo-50 dark:bg-[#1a1a2e] relative overflow-hidden">
              <img src={dashboardImg} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Balance */}
        {dashboardData && (
          <div className="mb-6">
            <BalanceBanner netBalance={netBalance} statsOnly />
          </div>
        )}

        {/* Pending Invites */}
        {invites.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 dark:text-[#f1f1f1] mb-3">Pending Invites</h2>
            <div className="space-y-2">
              {invites.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      You've been invited to <strong>{inv.groupName}</strong>
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Invited {new Date(inv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAcceptInvite(inv.token)}
                    className="px-4 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Groups */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900 dark:text-[#f1f1f1]">
            {groups.length > 0 ? `Your Groups (${groups.length})` : 'Your Groups'}
          </h2>
        </div>

        {groups.length === 0 ? (
          <div className="bg-white dark:bg-[#1a1a23] rounded-2xl border border-gray-100 dark:border-[#2a2a35] p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-[#22222e] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-900 dark:text-[#f1f1f1] font-semibold mb-1">No groups yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Create a group to start tracking shared expenses</p>
            <Link
              to="/groups/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#5B5BF7] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create your first group
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {groups.map((g, i) => (
              <GroupCard key={g.id} group={g} index={i} />
            ))}
          </div>
        )}
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </AppLayout>
  );
}
