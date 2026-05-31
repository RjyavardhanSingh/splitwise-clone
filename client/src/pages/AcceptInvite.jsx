import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { acceptInvite } from '../api/groups.api';
import Navbar from '../components/layout/Navbar';

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setStatus('invalid');
      return;
    }
    if (!user) {
      setStatus('login');
      return;
    }

    acceptInvite(token)
      .then((res) => {
        setStatus('success');
        setTimeout(() => navigate(`/groups/${res.group.id}`), 2000);
      })
      .catch((err) => {
        setStatus(err.response?.data?.error || 'Failed to accept invite');
      });
  }, [token, user, authLoading, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f13]">
      <Navbar />
      <div className="max-w-sm mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-xl border border-gray-200 p-8 dark:bg-[#1a1a23] dark:border-[#2a2a35]">
          {status === 'loading' && (
            <div className="animate-pulse space-y-3">
              <div className="h-8 bg-gray-200 rounded-full w-16 mx-auto dark:bg-[#2a2a35]" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto dark:bg-[#2a2a35]" />
            </div>
          )}

          {status === 'invalid' && (
            <>
              <p className="text-red-600 font-semibold mb-2 dark:text-red-400">Invalid Invite</p>
              <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">No invite token provided.</p>
              <Link to="/dashboard" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                Go to Dashboard
              </Link>
            </>
          )}

          {status === 'login' && (
            <>
              <p className="text-gray-900 font-semibold mb-2 dark:text-[#f1f1f1]">Sign in to accept invite</p>
              <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">You need to sign in before accepting this invite.</p>
              <Link
                to={`/login?redirect=/invite?token=${token}`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium inline-block hover:bg-indigo-700"
              >
                Sign In
              </Link>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 dark:bg-emerald-500/10">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-900 font-semibold mb-1 dark:text-[#f1f1f1]">You've joined the group!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to group...</p>
            </>
          )}

          {status !== 'loading' && status !== 'success' && status !== 'login' && status !== 'invalid' && (
            <>
              <p className="text-red-600 font-semibold mb-2 dark:text-red-400">Failed to accept invite</p>
              <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">{status}</p>
              <Link to="/dashboard" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                Go to Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
