import { Link } from 'react-router-dom';
import formatINR from '../../utils/formatCurrency';

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const COLORS = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
  'bg-cyan-500', 'bg-violet-500', 'bg-pink-500', 'bg-orange-500',
];

export default function GroupCard({ group, index = 0 }) {
  const balance = group.userNetBalance;
  const isNegative = balance < -0.01;
  const isPositive = balance > 0.01;
  const color = COLORS[index % COLORS.length];

  let text;
  let colorClass;
  if (!isNegative && !isPositive) {
    text = 'Settled up';
    colorClass = 'text-gray-500 dark:text-gray-400';
  } else if (isNegative) {
    text = `You owe ${formatINR(Math.abs(balance))}`;
    colorClass = 'text-red-600';
  } else {
    text = `You are owed ${formatINR(balance)}`;
    colorClass = 'text-emerald-600';
  }

  return (
    <Link
      to={`/groups/${group.id}`}
      className="group block bg-white dark:bg-[#1a1a23] rounded-xl border border-gray-200 dark:border-[#2a2a35] hover:border-indigo-200 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="p-4 flex items-center gap-4">
        <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0`}>
          {getInitials(group.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-[#f1f1f1] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {group.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{group.memberCount} members</p>
        </div>
        <div className="text-right shrink-0">
          <p className={`font-semibold text-sm ${colorClass}`}>{text}</p>
        </div>
      </div>
      <div className={`h-1 ${color} opacity-0 group-hover:opacity-100 transition-opacity`} />
    </Link>
  );
}
