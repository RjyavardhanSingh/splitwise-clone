import { useState } from 'react';
import { addExpense } from '../../api/expenses.api';

export default function AddExpenseModal({ groupId, members, onClose, onExpenseAdded }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState(members[0]?.id || '');
  const [splitAmong, setSplitAmong] = useState(members.map((m) => m.id));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleSplit = (id) => {
    setSplitAmong((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (!title || !amount || !paidById || splitAmong.length === 0) {
      setError('All fields are required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await addExpense(groupId, {
        title,
        amount: parseFloat(amount),
        paidById,
        splitAmong,
      });
      onExpenseAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1a23] rounded-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-[#f1f1f1]">Add Expense</h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border dark:border-[#2a2a35] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#1a1a23] text-gray-900 dark:text-[#f1f1f1]"
          />

          <div className="relative">
            <span className="absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-400">₹</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border dark:border-[#2a2a35] rounded-lg pl-8 pr-3 py-2 text-sm bg-white dark:bg-[#1a1a23] text-gray-900 dark:text-[#f1f1f1]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Paid by</label>
            <select
              value={paidById}
              onChange={(e) => setPaidById(e.target.value)}
              className="w-full border dark:border-[#2a2a35] rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#1a1a23] text-gray-900 dark:text-[#f1f1f1]"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Split among</label>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {members.map((m) => (
                <label key={m.id} className="flex items-center gap-2 text-sm text-gray-900 dark:text-[#f1f1f1]">
                  <input
                    type="checkbox"
                    checked={splitAmong.includes(m.id)}
                    onChange={() => toggleSplit(m.id)}
                    className="rounded"
                  />
                  {m.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm border dark:border-[#2a2a35] rounded-lg hover:bg-gray-50 dark:hover:bg-[#22222e] text-gray-700 dark:text-[#f1f1f1]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </div>
    </div>
  );
}
