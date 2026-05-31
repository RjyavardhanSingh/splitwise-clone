import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createGroup } from '../api/groups.api';
import AppLayout from '../components/layout/AppLayout';

export default function CreateGroup() {
  const [name, setName] = useState('');
  const [emails, setEmails] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name || !emails.trim()) {
      setError('Group name and at least one member email are required');
      return;
    }
    const memberEmails = emails
      .split('\n')
      .flatMap((line) => line.split(','))
      .map((e) => e.trim())
      .filter(Boolean);

    if (memberEmails.length === 0) {
      setError('At least one member email is required');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const group = await createGroup({ name, memberEmails });
      setSuccess({ name: group.name, invites: group.invites?.length || 0 });
      setTimeout(() => navigate(`/dashboard`), 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create group');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto">
        {success ? (
          <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center max-w-md mx-auto mt-8 dark:bg-[#1a1a23] dark:border-emerald-800">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 dark:bg-emerald-500/10">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1 dark:text-[#f1f1f1]">"{success.name}" created!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {success.invites} invite{success.invites !== 1 ? 's' : ''} sent via email.
            </p>
            <p className="text-xs text-gray-400 mt-3 dark:text-gray-500">Redirecting to dashboard...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                &larr; Back to Dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900 mt-1 dark:text-[#f1f1f1]">Create Group</h1>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 dark:bg-red-500/10 dark:text-red-400">{error}</div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 dark:bg-[#1a1a23] dark:border-[#2a2a35]">
              <input
                type="text"
                placeholder="Group name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/20 focus:border-[#5B5BF7] transition-all dark:border-[#2a2a35]"
              />

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5 dark:text-[#f1f1f1]">
                  Member emails
                </label>
                <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">
                  Invites will be sent via email. Recipients must have a CONTRI account.
                </p>
                <textarea
                  placeholder="alice@example.com, bob@example.com"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/20 focus:border-[#5B5BF7] transition-all dark:border-[#2a2a35]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium dark:border-[#2a2a35] dark:hover:bg-[#22222e]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 text-sm bg-[#5B5BF7] text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all font-medium"
                >
                  {submitting ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
