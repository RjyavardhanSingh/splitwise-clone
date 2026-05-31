import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGroups } from '../api/groups.api';
import AppLayout from '../components/layout/AppLayout';
import GroupCard from '../components/dashboard/GroupCard';
import SettingsModal from '../components/modals/SettingsModal';

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    getGroups()
      .then(setGroups)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout onSettingsOpen={() => setShowSettings(true)}>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-[#f1f1f1]">All Groups</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{groups.length} group{groups.length !== 1 ? 's' : ''}</p>
          </div>
          <Link
            to="/groups/new"
            className="px-4 py-2 bg-[#5B5BF7] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all"
          >
            + New Group
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-[#2a2a35] rounded-2xl" />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white dark:bg-[#1a1a23] rounded-2xl border border-gray-100 dark:border-[#2a2a35] p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-[#22222e] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-900 dark:text-[#f1f1f1] font-semibold mb-1">No groups yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Create a group to start tracking shared expenses</p>
            <Link
              to="/groups/new"
              className="inline-flex px-5 py-2.5 bg-[#5B5BF7] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all"
            >
              Create your first group
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {groups.map((g, i) => (
              <GroupCard key={g.id} group={g} index={i} />
            ))}
          </div>
        )}
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </AppLayout>
  );
}
