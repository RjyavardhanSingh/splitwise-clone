import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnalytics } from '../api/misc.api';
import AppLayout from '../components/layout/AppLayout';
import SettingsModal from '../components/modals/SettingsModal';
import formatINR from '../utils/formatCurrency';

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white dark:bg-[#1a1a23] rounded-2xl border border-gray-100 dark:border-[#2a2a35] p-5">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Bar({ label, amount, maxAmount }) {
  const pct = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-20 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 dark:bg-[#22222e] rounded-full h-2.5 overflow-hidden">
        <div className="bg-[#5B5BF7] h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold text-gray-900 dark:text-[#f1f1f1] w-24 text-right">{formatINR(amount)}</span>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout onSettingsOpen={() => setShowSettings(true)}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 dark:text-[#f1f1f1] mb-6">Analytics</h1>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-[#2a2a35] rounded-2xl" />
            ))}
          </div>
        ) : data ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Spent" value={formatINR(data.totalSpent)} color="text-red-600" />
              <StatCard label="Total Owed" value={formatINR(data.totalOwed)} color="text-emerald-600" />
              <StatCard label="Expenses" value={data.expenseCount} color="text-gray-900 dark:text-[#f1f1f1]" />
              <StatCard label="Settlements" value={data.settlementCount} color="text-gray-900 dark:text-[#f1f1f1]" />
            </div>

            {/* Net Balance */}
            <div className="bg-white dark:bg-[#1a1a23] rounded-2xl border border-gray-100 dark:border-[#2a2a35] p-5 mb-8">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Net Balance</p>
              <p className={`text-3xl font-bold ${data.netBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {data.netBalance >= 0 ? '+' : ''}{formatINR(data.netBalance)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {data.netBalance >= 0
                  ? 'You are owed money overall'
                  : 'You owe money overall'}
              </p>
            </div>

            {/* Group Breakdown */}
            {data.groupBreakdown.length > 0 && (
              <div className="bg-white dark:bg-[#1a1a23] rounded-2xl border border-gray-100 dark:border-[#2a2a35] p-5 mb-8">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-[#f1f1f1] mb-4">Per-Group Breakdown</h2>
                <div className="space-y-3">
                  {data.groupBreakdown.map((g) => (
                    <div key={g.groupId} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <Link to={`/groups/${g.groupId}`} className="text-sm font-medium text-gray-900 dark:text-[#f1f1f1] hover:text-[#5B5BF7]">
                          {g.groupName}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{g.memberCount} members · {g.totalExpenses} expenses</p>
                      </div>
                      <p className={`text-sm font-bold ${g.netBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {g.netBalance >= 0 ? '+' : ''}{formatINR(g.netBalance)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Monthly Top Spend */}
            {data.topMonths.length > 0 && (
              <div className="bg-white dark:bg-[#1a1a23] rounded-2xl border border-gray-100 dark:border-[#2a2a35] p-5">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-[#f1f1f1] mb-4">Top Months by Spend</h2>
                <div className="space-y-3">
                  {data.topMonths.map((m) => (
                    <Bar key={m.month} label={m.month} amount={m.amount} maxAmount={data.topMonths[0].amount} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white dark:bg-[#1a1a23] rounded-2xl border border-gray-100 dark:border-[#2a2a35] p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">Failed to load analytics</p>
          </div>
        )}
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </AppLayout>
  );
}
