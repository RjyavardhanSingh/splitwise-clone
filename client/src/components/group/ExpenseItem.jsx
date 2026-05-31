import formatINR from '../../utils/formatCurrency';
import formatRelative from '../../utils/formatDate';
import mealIcon from '../../assets/mealIcon.png';
import stayIcon from '../../assets/stayIcon.png';
import transportIcon from '../../assets/transportIcon.png';
import travelIcon from '../../assets/travelIcon.png';
import outingIcon from '../../assets/outingIcon.png';
import shoppingIcon from '../../assets/shoppingIcon.png';
import settlementIcon from '../../assets/settlementIcon.png';
import otherIcon from '../../assets/otherIcon.png';

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

const TAG_COLORS = [
  'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-800',
  'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-800',
  'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-800',
  'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/10 dark:text-pink-300 dark:border-pink-800',
  'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-800',
];

export default function ExpenseItem({ expense, currentUserId, onDelete, index = 0 }) {
  const isSettlement = expense.isSettlement;
  const iconSrc = isSettlement ? settlementIcon : getIconSrc(expense.title);
  const tagColor = TAG_COLORS[index % TAG_COLORS.length];

  const splitInfo = expense.splits
    .filter((s) => s.user.id !== currentUserId)
    .slice(0, 3)
    .map((s) => s.user.name.split(' ')[0]);

  const moreCount = expense.splits.length - splitInfo.length - (expense.splits.find((s) => s.user.id === currentUserId) ? 1 : 0);

  return (
    <div className="flex items-center gap-4 py-3.5 px-4 hover:bg-gray-50 dark:hover:bg-[#22222e] transition-colors group">
      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#22222e] flex items-center justify-center shrink-0">
        <img src={iconSrc} alt="" className="w-10 h-10 object-contain" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900 dark:text-[#f1f1f1] truncate">{expense.title}</p>
          {isSettlement && (
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${tagColor}`}>
              Settlement
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {expense.paidBy.name} paid
          {splitInfo.length > 0 && ` · ${splitInfo.join(', ')}${moreCount > 0 ? ` +${moreCount}` : ''}`}
        </p>
      </div>

      <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block whitespace-nowrap">
        {formatRelative(expense.createdAt)}
      </span>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-gray-900 dark:text-[#f1f1f1]">{formatINR(expense.amount)}</p>
      </div>

      {expense.createdById === currentUserId && onDelete && (
        <button
          onClick={() => onDelete(expense.id)}
          className="text-gray-300 dark:text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
}
