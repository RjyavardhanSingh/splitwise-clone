import { useState } from 'react';
import { settleUp } from '../../api/settlements.api';
import formatINR from '../../utils/formatCurrency';

export default function SettleUpModal({ groupId, balance, members, onClose, onSettled }) {
  const [amount, setAmount] = useState(balance.amount);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const payer = balance.from;
  const payee = balance.to;

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await settleUp(groupId, {
        payerId: payer.id,
        payeeId: payee.id,
        amount: parseFloat(amount),
      });
      onSettled();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to settle up');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1a23] rounded-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-[#f1f1f1]">Settle Up</h2>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {payer.name} will pay {payee.name}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="relative">
          <span className="absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-400">₹</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border dark:border-[#2a2a35] rounded-lg pl-8 pr-3 py-2 text-sm bg-white dark:bg-[#1a1a23] text-gray-900 dark:text-[#f1f1f1]"
          />
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Suggested amount: {formatINR(balance.amount)}
        </p>

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
            className="flex-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? 'Processing...' : `Pay ${formatINR(amount)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
