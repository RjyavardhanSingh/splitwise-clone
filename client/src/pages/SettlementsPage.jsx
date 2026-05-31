import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSettlements } from '../api/misc.api';
import AppLayout from '../components/layout/AppLayout';
import SettingsModal from '../components/modals/SettingsModal';
import formatINR from '../utils/formatCurrency';
import formatRelative from '../utils/formatDate';

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    getSettlements()
      .then(setSettlements)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalSettled = settlements.reduce((s, t) => s + parseFloat(t.amount), 0);

  return (
    <AppLayout onSettingsOpen={() => setShowSettings(true)}>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-[#f1f1f1]">Settlements</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {settlements.length} settlement{settlements.length !== 1 ? 's' : ''} · {formatINR(totalSettled)} settled
          </p>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-[#2a2a35] rounded-2xl" />
            ))}
          </div>
        ) : settlements.length === 0 ? (
          <div className="bg-white dark:bg-[#1a1a23] rounded-2xl border border-gray-100 dark:border-[#2a2a35] p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No settlements yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Settlements appear here when group members settle up</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1a1a23] rounded-2xl border border-gray-100 dark:border-[#2a2a35] overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-[#2a2a35]">
              {settlements.map((s) => (
                <Link
                  key={s.id}
                  to={`/groups/${s.group.id}`}
                  className="flex items-center gap-4 py-3.5 px-4 hover:bg-gray-50 dark:hover:bg-[#22222e] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-lg shrink-0">
                    🔄
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-[#f1f1f1]">{s.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {s.paidBy.name} · {s.group.name} · {formatRelative(s.createdAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-600">{formatINR(s.amount)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </AppLayout>
  );
}
