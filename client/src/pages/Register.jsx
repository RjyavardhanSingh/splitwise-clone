import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../api/auth.api';
import logoSrc from '../assets/contri-logo.png';
import darkLogoSrc from '../assets/contri-logo-dark-theme.png';
import loginImageSrc from '../assets/login-signup.png';
import { useTheme } from '../context/ThemeContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { theme } = useTheme();
  const logoSrcToUse = theme === 'dark' ? darkLogoSrc : logoSrc;
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const { userId } = await registerApi({ name, email, password });
      navigate('/verify-email', { state: { userId } });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f13] flex flex-col lg:flex-row">
      {/* Left — Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src={loginImageSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white">
          <p className="text-3xl font-bold leading-tight">Split expenses,</p>
          <p className="text-3xl font-bold text-indigo-300">not friendships</p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-block mb-8">
            <img src={logoSrcToUse} alt="CONTRI" className="h-8 w-auto object-contain" />
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#f1f1f1]">Get started</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Create your free account</p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4">{error}</div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-[#22222e] text-gray-900 dark:text-[#f1f1f1] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-[#22222e] text-gray-900 dark:text-[#f1f1f1] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-[#22222e] text-gray-900 dark:text-[#f1f1f1] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500">
              A verification code will be sent to your email.
            </p>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 text-sm font-semibold"
            >
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <p className="text-sm text-center mt-6 text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
