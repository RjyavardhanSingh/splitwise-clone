import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi, googleAuth as googleAuthApi } from '../api/auth.api';
import logoSrc from '../assets/contri-logo.png';
import darkLogoSrc from '../assets/contri-logo-dark-theme.png';
import loginImageSrc from '../assets/login-signup.png';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { theme } = useTheme();
  const logoSrcToUse = theme === 'dark' ? darkLogoSrc : logoSrc;
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (!window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
    if (googleBtnRef.current) {
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: 'standard',
        shape: 'rectangular',
        theme: 'outline',
        text: 'signin_with',
        size: 'large',
        width: '100%',
      });
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const { token, user } = await googleAuthApi({ idToken: response.credential });
      loginUser(token, user);
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.error || 'Google sign in failed');
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const { token, user } = await loginApi({ email, password });
      loginUser(token, user);
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
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

          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#f1f1f1]">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Log in to your account</p>

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
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-[#22222e] text-gray-900 dark:text-[#f1f1f1] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 text-sm font-semibold"
            >
              {submitting ? 'Logging in...' : 'Log in'}
            </button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-[#2a2a35]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-[#0f0f13] px-3 text-xs text-gray-400">or continue with</span>
              </div>
            </div>

            <div ref={googleBtnRef} className="flex justify-center" />

            <div className="text-center">
              <Link to="/register" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                Don't have an account? Create one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
