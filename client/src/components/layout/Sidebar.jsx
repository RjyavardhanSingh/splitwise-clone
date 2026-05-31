import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoSrc from '../../assets/contri-logo.png';
import darkLogoSrc from '../../assets/contri-logo-dark-theme.png';
import { useTheme } from '../../context/ThemeContext';
import { Lightbulb } from '../ui/Lightbulb';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard', matchExact: true },
  { label: 'Groups', icon: 'Users', path: '/groups', matchStartsWith: true },
  { label: 'Transactions', icon: 'ArrowLeftRight', path: '/transactions', matchStartsWith: true },
  { label: 'Settlements', icon: 'HandCoins', path: '/settlements', matchStartsWith: true },
  { label: 'Analytics', icon: 'BarChart3', path: '/analytics', matchStartsWith: true },
];

const ICONS = {
  LayoutDashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 22V12h6v10" />
    </svg>
  ),
  Users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  ArrowLeftRight: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
  HandCoins: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  BarChart3: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
};

export default function Sidebar({ onSettingsOpen }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const logoSrcToUse = theme === 'dark' ? darkLogoSrc : logoSrc;
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-56'} bg-white dark:bg-[#1a1a23] border-r border-gray-200 dark:border-r-[#2a2a35] flex flex-col h-full transition-all duration-200 shrink-0`}>
      {/* Logo */}
      <div className="h-14 flex items-center justify-center border-b border-gray-100 dark:border-b-[#2a2a35]">
        <Link to="/dashboard" className={`flex items-center ${collapsed ? 'justify-center w-full' : 'px-4'}`}>
          <img
            src={logoSrcToUse}
            alt="CONTRI"
            className={`object-contain ${collapsed ? 'h-8 w-8' : 'h-8'}`}
          />
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.matchExact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#22222e]'
              }`}
            >
              <span className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}>{ICONS[item.icon]}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Lightbulb toggle */}
      <button
        onClick={toggleTheme}
        className="h-10 border-t border-gray-100 dark:border-t-[#2a2a35] flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600"
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <Lightbulb size={18} />
      </button>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-10 border-t border-gray-100 dark:border-t-[#2a2a35] flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600"
      >
        <svg className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
    </aside>
  );
}
