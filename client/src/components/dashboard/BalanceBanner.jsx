import formatINR from '../../utils/formatCurrency';

export default function BalanceBanner({ netBalance, statsOnly }) {
  const isNegative = netBalance < -0.01;
  const isPositive = netBalance > 0.01;
  const isSettled = !isNegative && !isPositive;

  let text;
  let colorClass;
  let bgClass;
  if (isSettled) {
    text = 'All settled up';
    colorClass = 'text-gray-900 dark:text-[#f1f1f1]';
    bgClass = 'from-gray-50 dark:from-[#22222e] to-white dark:to-[#1a1a23] border-gray-200 dark:border-[#2a2a35]';
  } else if (isNegative) {
    text = `You owe ${formatINR(Math.abs(netBalance))}`;
    colorClass = 'text-red-700';
    bgClass = 'from-red-50 to-white dark:to-[#1a1a23] border-red-100';
  } else {
    text = `You are owed ${formatINR(netBalance)}`;
    colorClass = 'text-emerald-700';
    bgClass = 'from-emerald-50 to-white dark:to-[#1a1a23] border-emerald-100';
  }

  if (statsOnly) {
    return (
      <div className={`bg-gradient-to-br ${bgClass} border rounded-xl px-5 py-4`}>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Overall Balance</p>
        <p className={`text-xl font-bold ${colorClass}`}>{text}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a1a23] rounded-xl shadow-sm border border-gray-200 dark:border-[#2a2a35] p-6 text-center">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Overall Balance</p>
      <p className={`text-3xl font-extrabold tracking-tight ${colorClass}`}>{text}</p>
      {!isSettled && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Across all groups</p>
      )}
    </div>
  );
}
