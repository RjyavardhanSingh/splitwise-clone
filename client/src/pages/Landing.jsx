import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logoSrc from '../assets/contri-logo.png';
import darkLogoSrc from '../assets/contri-logo-dark-theme.png';
import heroImageSrc from '../assets/heroImage.png';
import heroLeftSrc from '../assets/landingimg1.png';
import manageIconSrc from '../assets/hero-left-src-1.png';

export default function Landing() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const logoSrcToUse = theme === 'dark' ? darkLogoSrc : logoSrc;

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-white dark:bg-[#1a1a23]">
      {/* Nav */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 dark:bg-[#1a1a23]/80 dark:border-[#2a2a35]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/">
            <img src={logoSrcToUse} alt="CONTRI" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-500 hover:text-gray-800 px-3 py-2 font-medium dark:text-gray-400 dark:hover:text-gray-200">
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-white dark:from-[#1a1a2e] dark:via-[#1a1a23] dark:to-[#1a1a23]" />
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.08] tracking-tight dark:text-[#f1f1f1]">
                Split expenses,{' '}
                <span className="text-indigo-600 dark:text-indigo-400">not friendships</span>
              </h1>
              <p className="mt-5 text-lg text-gray-500 leading-relaxed dark:text-gray-400">
                Track shared expenses with friends, roommates, and travel buddies. Clear balances, no awkward conversations.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="px-7 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold text-sm shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
                >
                  Start tracking free
                </Link>
                <Link
                  to="/login"
                  className="px-7 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold text-sm dark:border-[#2a2a35] dark:text-[#f1f1f1] dark:hover:bg-[#22222e]"
                >
                  Log in
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full max-w-lg">
              <img
                src={heroImageSrc}
                alt="CONTRI app"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-lg mx-auto">
            <p className="text-sm font-semibold text-indigo-600 mb-3 dark:text-indigo-400">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-[#f1f1f1]">
              Three steps to stress-free sharing
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                step: '01',
                title: 'Create a group',
                desc: 'Name your group and add members by email. A trip, flat, or dinner — anything works.',
                color: 'bg-indigo-50 text-indigo-600 dark:bg-[#1a1a2e] dark:text-indigo-400',
              },
              {
                step: '02',
                title: 'Add expenses',
                desc: 'Log who paid and who shared. The split is automatic and rounding is handled for you.',
                color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
              },
              {
                step: '03',
                title: 'Settle up',
                desc: 'See who owes whom and record payments. Everyone walks away settled.',
                color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-lg font-bold mx-auto`}>
                  {item.step}
                </div>
                <h3 className="mt-6 font-semibold text-gray-900 text-lg dark:text-[#f1f1f1]">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xs mx-auto dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32 bg-gray-50 dark:bg-[#0f0f13]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <p className="text-sm font-semibold text-indigo-600 mb-3 dark:text-indigo-400">Why CONTRI</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-[#f1f1f1]">
                Built for real life
              </h2>
              <p className="text-gray-500 mt-3 max-w-md dark:text-gray-400">
                Every feature is designed to reduce friction, not add complexity.
              </p>
              <div className="mt-10 space-y-8">
                {[
                  { title: 'Real-time balances', desc: 'Every expense updates instantly. No spreadsheet, no waiting.' },
                  { title: 'Equal split, done right', desc: 'Handles rounding automatically — the odd paisa goes to the payer.' },
                  { title: 'Works everywhere', desc: 'Responsive design works on your phone, tablet, or laptop.' },
                ].map((f) => (
                  <div key={f.title} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-[#f1f1f1]">{f.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <img
                src={heroLeftSrc}
                alt="Team sharing expenses"
                className="w-full rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Visual section */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-2xl border border-gray-100 p-8 md:p-12 shadow-sm dark:bg-[#1a1a23] dark:border-[#2a2a35]">
            <div className="flex-1">
              <img
                src={manageIconSrc}
                alt="Money management"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
            <div className="flex-1 max-w-md">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-[#f1f1f1]">
                Stop doing mental math
              </h3>
              <p className="text-gray-500 mt-3 leading-relaxed dark:text-gray-400">
                CONTRI does all the calculations. Add an expense and instantly see who owes whom. No spreadsheets, no calculators, no confusion.
              </p>
              <Link
                to="/register"
                className="mt-6 inline-flex px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold text-sm"
              >
                Get started free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20 md:py-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Ready to stop chasing people for money?
          </h2>
          <p className="mt-4 text-indigo-200 max-w-md mx-auto">
            Join thousands who use CONTRI to keep their friendships money-free.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex px-8 py-3 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 font-semibold text-sm dark:bg-[#1a1a23] dark:text-indigo-400 dark:hover:bg-[#1a1a2e]"
          >
            Create your free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white dark:border-[#2a2a35] dark:bg-[#1a1a23]">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <img src={logoSrcToUse} alt="CONTRI" className="h-8 w-auto object-contain mb-4" />
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs dark:text-gray-400">
                Split expenses, not friendships. Track shared costs with ease.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4 dark:text-[#f1f1f1]">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors dark:text-gray-400 dark:hover:text-gray-200">Features</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors dark:text-gray-400 dark:hover:text-gray-200">Pricing</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors dark:text-gray-400 dark:hover:text-gray-200">Integrations</a></li>
                <li><Link to="/register" className="text-sm text-gray-500 hover:text-gray-800 transition-colors dark:text-gray-400 dark:hover:text-gray-200">Sign up</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4 dark:text-[#f1f1f1]">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors dark:text-gray-400 dark:hover:text-gray-200">About</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors dark:text-gray-400 dark:hover:text-gray-200">Blog</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors dark:text-gray-400 dark:hover:text-gray-200">Careers</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors dark:text-gray-400 dark:hover:text-gray-200">Contact</a></li>
              </ul>
            </div>

            {/* Legal & Social */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4 dark:text-[#f1f1f1]">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors dark:text-gray-400 dark:hover:text-gray-200">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors dark:text-gray-400 dark:hover:text-gray-200">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 dark:border-[#2a2a35]">
          <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              &copy; {new Date().getFullYear()} CONTRI. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Built by Rajyavardhan Singh
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
