import formatINR from '../../utils/formatCurrency';

export default function BalanceSummary({ balances, onSettle, groupName }) {
  const isSettled = !balances || balances.length === 0;

  if (isSettled) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 dark:from-emerald-500/10 to-white dark:to-[#1a1a23] rounded-2xl border border-emerald-100 dark:border-emerald-800 p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Overall Balance</p>
              <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">
                You are all settled up! 🎉
              </h2>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                No outstanding balances in {groupName || 'this group'}
              </p>
            </div>
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-100/30 dark:bg-emerald-500/10 rounded-full blur-2xl" />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f1f1] mb-3">Balances</h3>
      <div className="space-y-2">
        {balances.map((b, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-white dark:bg-[#1a1a23] rounded-xl border border-gray-100 dark:border-[#2a2a35] p-4 hover:border-gray-200 dark:hover:border-[#2a2a35] hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium text-gray-900 dark:text-[#f1f1f1]">{b.from.name}</span>
                  <span className="text-gray-500 dark:text-gray-400"> owes </span>
                  <span className="font-medium text-gray-900 dark:text-[#f1f1f1]">{b.to.name}</span>
                </p>
                <p className="text-lg font-bold text-red-600">{formatINR(b.amount)}</p>
              </div>
            </div>
            {onSettle && (
              <button
                onClick={() => onSettle(b)}
                className="px-4 py-2 bg-[#5B5BF7] text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all"
              >
                Settle Up
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
