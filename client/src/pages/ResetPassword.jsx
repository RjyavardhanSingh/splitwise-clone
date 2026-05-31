import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { resetPassword as resetApi } from '../api/auth.api';
import logoSrc from '../assets/contri-logo.png';
import darkLogoSrc from '../assets/contri-logo-dark-theme.png';
import { useTheme } from '../context/ThemeContext';

export default function ResetPassword() {
  const location = useLocation();
  const email = location.state?.email || '';
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { theme } = useTheme();
  const logoSrcToUse = theme === 'dark' ? darkLogoSrc : logoSrc;

  const handleSubmit = async () => {
    if (!code || code.length !== 6) {
      setError('Enter the 6-digit code');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await resetApi({ email, code, newPassword });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f13] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#1a1a23] rounded-2xl shadow-sm border dark:border-[#2a2a35] p-8 w-full max-w-sm text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No email provided. Please request a reset first.</p>
          <Link to="/forgot-password" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Request reset</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f13] flex flex-col">
      <nav className="bg-white dark:bg-[#1a1a23] border-b border-gray-100 dark:border-[#2a2a35]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
          <Link to="/"><img src={logoSrcToUse} alt="CONTRI" className="h-8 w-auto object-contain" /></Link>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#1a1a23] rounded-2xl shadow-sm border dark:border-[#2a2a35] p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#f1f1f1] mb-1">Reset password</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Enter the code sent to {email} and your new password.
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4">{error}</div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full border border-gray-200 dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm text-center tracking-[6px] font-bold bg-white dark:bg-[#22222e] text-gray-900 dark:text-[#f1f1f1] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="New password (min 6 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-200 dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-[#22222e] text-gray-900 dark:text-[#f1f1f1] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 text-sm font-semibold"
            >
              {submitting ? 'Resetting...' : 'Reset password'}
            </button>
          </div>

          <p className="text-sm text-center mt-6 text-gray-500 dark:text-gray-400">
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
