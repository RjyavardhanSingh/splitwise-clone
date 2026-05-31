import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getGroups } from '../../api/groups.api';
import { getTransactions } from '../../api/misc.api';

function getInitials(name) {
  return name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';
}

export default function Navbar({ onSettingsOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!searchOpen || searchData) return;
    Promise.all([getGroups(), getTransactions()])
      .then(([groups, transactions]) => setSearchData({ groups, transactions }))
      .catch(() => {});
  }, [searchOpen, searchData]);

  const doSearch = useCallback((q) => {
    if (!q.trim() || !searchData) {
      setResults([]);
      return;
    }
    try {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      const groupHits = searchData.groups
        .filter((g) => re.test(g.name))
        .map((g) => ({ type: 'group', label: g.name, sub: `${g.memberCount} members`, path: `/groups/${g.id}` }));
      const txHits = searchData.transactions
        .filter((t) => re.test(t.title))
        .map((t) => ({ type: 'transaction', label: t.title, sub: `${t.group.name} · ${t.paidBy.name}`, path: `/groups/${t.group.id}` }));
      setResults([...groupHits, ...txHits].slice(0, 8));
    } catch {
      setResults([]);
    }
  }, [searchData]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 150);
  };

  const handleSelect = (item) => {
    setSearchOpen(false);
    setQuery('');
    setResults([]);
    navigate(item.path);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setSearchOpen(false); inputRef.current?.blur(); }
    if (e.key === 'Enter' && results.length > 0) handleSelect(results[0]);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="h-14 bg-white dark:bg-[#1a1a23] border-b border-gray-200 dark:border-[#2a2a35] flex items-center justify-between px-6 shrink-0">
      {/* Search */}
      <div className="flex items-center relative" ref={searchRef}>
        <div className="relative">
          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search groups or transactions..."
            value={query}
            onChange={handleChange}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-64 pl-9 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-[#22222e] border border-gray-200 dark:border-[#2a2a35] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B5BF7]/20 focus:border-[#5B5BF7] focus:bg-white dark:focus:bg-[#1a1a23] transition-all"
          />
        </div>

        {/* Dropdown */}
        {searchOpen && results.length > 0 && (
          <div className="absolute left-0 top-10 w-80 bg-white dark:bg-[#1a1a23] rounded-xl border border-gray-200 dark:border-[#2a2a35] shadow-lg py-1.5 z-50">
            {results.map((item, i) => (
              <button
                key={`${item.type}-${i}`}
                onClick={() => handleSelect(item)}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#22222e] flex items-center gap-3"
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                  item.type === 'group' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {item.type === 'group' ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                    </svg>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-[#f1f1f1] truncate">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.sub}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {searchOpen && query && results.length === 0 && (
          <div className="absolute left-0 top-10 w-80 bg-white dark:bg-[#1a1a23] rounded-xl border border-gray-200 dark:border-[#2a2a35] shadow-lg py-6 text-center z-50">
            <p className="text-sm text-gray-400 dark:text-gray-500">No results found</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-[#5B5BF7] text-white text-xs font-bold flex items-center justify-center">
                {getInitials(user.name)}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-[#f1f1f1] hidden sm:block">{user.name}</span>
              <svg className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 w-48 bg-white dark:bg-[#1a1a23] rounded-xl border border-gray-200 dark:border-[#2a2a35] shadow-lg py-1.5 z-50">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-[#2a2a35]">
                  <p className="text-sm font-medium text-gray-900 dark:text-[#f1f1f1] truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); onSettingsOpen?.(); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-[#f1f1f1] hover:bg-gray-50 dark:hover:bg-[#22222e] flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
