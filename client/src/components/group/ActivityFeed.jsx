import ExpenseItem from './ExpenseItem';

export default function ActivityFeed({ expenses, currentUserId, onDeleteExpense }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1a1a23] rounded-2xl border border-gray-100 dark:border-[#2a2a35] p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 dark:bg-[#22222e] flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">No expenses yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add your first expense to get started</p>
      </div>
    );
  }

  const totalExpenses = expenses.length;
  const totalAmount = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f1f1]">Activity</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {totalExpenses} expense{totalExpenses !== 1 ? 's' : ''} · ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
        </span>
      </div>
      <div className="bg-white dark:bg-[#1a1a23] rounded-2xl border border-gray-100 dark:border-[#2a2a35] overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-[#2a2a35]">
          {expenses.map((exp, i) => (
            <ExpenseItem
              key={exp.id}
              expense={exp}
              currentUserId={currentUserId}
              onDelete={onDeleteExpense}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
