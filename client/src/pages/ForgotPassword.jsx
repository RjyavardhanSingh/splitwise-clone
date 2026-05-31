import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword as forgotApi } from '../api/auth.api';
import logoSrc from '../assets/contri-logo.png';
import darkLogoSrc from '../assets/contri-logo-dark-theme.png';
import { useTheme } from '../context/ThemeContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { theme } = useTheme();
  const logoSrcToUse = theme === 'dark' ? darkLogoSrc : logoSrc;
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      setError('Enter your email');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await forgotApi({ email });
      setSent(true);
      setTimeout(() => navigate('/reset-password', { state: { email } }), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f13] flex flex-col">
      <nav className="bg-white dark:bg-[#1a1a23] border-b border-gray-100 dark:border-[#2a2a35]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
          <Link to="/"><img src={logoSrcToUse} alt="CONTRI" className="h-8 w-auto object-contain" /></Link>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#1a1a23] rounded-2xl shadow-sm border dark:border-[#2a2a35] p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#f1f1f1] mb-1">Forgot password</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Enter your email and we'll send you a reset code.
          </p>

          {sent && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm p-3 rounded-lg mb-4">
              If an account exists, a reset code has been sent.
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4">{error}</div>
          )}

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-[#22222e] text-gray-900 dark:text-[#f1f1f1] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 text-sm font-semibold"
            >
              {submitting ? 'Sending...' : 'Send reset code'}
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
