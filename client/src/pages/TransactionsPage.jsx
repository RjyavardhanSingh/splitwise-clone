import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTransactions } from '../api/misc.api';
import AppLayout from '../components/layout/AppLayout';
import SettingsModal from '../components/modals/SettingsModal';
import formatINR from '../utils/formatCurrency';
import formatRelative from '../utils/formatDate';
import mealIcon from '../assets/mealIcon.png';
import stayIcon from '../assets/stayIcon.png';
import transportIcon from '../assets/transportIcon.png';
import travelIcon from '../assets/travelIcon.png';
import outingIcon from '../assets/outingIcon.png';
import shoppingIcon from '../assets/shoppingIcon.png';
import settlementIcon from '../assets/settlementIcon.png';
import otherIcon from '../assets/otherIcon.png';

function getIconSrc(title) {
  const t = title.toLowerCase();
  if (/(dinner|food|drink|meal|lunch|breakfast|brunch|snack|coffee|tea|restaurant|cafe)/.test(t)) return mealIcon;
  if (/(hotel|stay|rent|room|apartment|flat|accommodation|lodging)/.test(t)) return stayIcon;
  if (/(taxi|cab|uber|ola|transport|bus|train|flight|fuel|petrol|gas|metro|auto|rickshaw)/.test(t)) return transportIcon;
  if (/(travel|trip|journey|vacation|holiday)/.test(t)) return travelIcon;
  if (/(outing|movie|concert|ticket|event|show|party|club)/.test(t)) return outingIcon;
  if (/(shopping|clothes|mall|grocery|store|market)/.test(t)) return shoppingIcon;
  return otherIcon;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'settlements'
    ? transactions.filter((t) => t.isSettlement)
    : filter === 'expenses'
    ? transactions.filter((t) => !t.isSettlement)
    : transactions;

  const totalAmount = filtered.reduce((s, t) => s + parseFloat(t.amount), 0);

  return (
    <AppLayout onSettingsOpen={() => setShowSettings(true)}>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-[#f1f1f1]">Transactions</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{transactions.length} total transactions</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {['all', 'expenses', 'settlements'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-xl transition-all ${
                filter === f
                  ? 'bg-[#5B5BF7] text-white'
                  : 'bg-white dark:bg-[#1a1a23] border border-gray-200 dark:border-[#2a2a35] text-gray-600 hover:border-gray-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-[#2a2a35] rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-[#1a1a23] rounded-2xl border border-gray-100 dark:border-[#2a2a35] p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-[#22222e] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No transactions found</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1a1a23] rounded-2xl border border-gray-100 dark:border-[#2a2a35] overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-[#2a2a35] flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-[#f1f1f1]">{formatINR(totalAmount)}</span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-[#2a2a35]">
              {filtered.map((t) => {
                const isSettlement = t.isSettlement;
                return (
                  <Link
                    key={t.id}
                    to={`/groups/${t.group.id}`}
                    className="flex items-center gap-4 py-3.5 px-4 hover:bg-gray-50 dark:hover:bg-[#22222e] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#22222e] flex items-center justify-center text-lg shrink-0">
                      <img src={isSettlement ? settlementIcon : getIconSrc(t.title)} alt="" className="w-10 h-10 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-[#f1f1f1] truncate">{t.title}</p>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{t.group.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {t.paidBy.name} paid · {formatRelative(t.createdAt)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-[#f1f1f1]">{formatINR(t.amount)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </AppLayout>
  );
}
