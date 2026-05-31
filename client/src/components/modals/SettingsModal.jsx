import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile as updateProfileApi } from '../../api/auth.api';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'privacy', label: 'Privacy' },
  { key: 'faq', label: 'FAQ' },
  { key: 'help', label: 'Help' },
];

export default function SettingsModal({ onClose }) {
  const { user, loginUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#1a1a23] rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-[#2a2a35] shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#f1f1f1]">Settings</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none">&times;</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b dark:border-[#2a2a35] px-6 shrink-0 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`text-sm font-medium px-3 py-3 border-b-2 transition-colors shrink-0 ${
                activeTab === t.key
                  ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-[#f1f1f1]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === 'profile' && <ProfileSection user={user} loginUser={loginUser} />}
          {activeTab === 'privacy' && <PrivacySection />}
          {activeTab === 'faq' && <FAQSection />}
          {activeTab === 'help' && <HelpSection />}
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ user, loginUser }) {
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const isGoogle = user?.authProvider === 'google';

  const handleSave = async () => {
    if (!name.trim()) { setErr('Name is required'); return; }
    setSaving(true); setErr(''); setMsg('');
    try {
      const payload = { name: name.trim() };
      if (!isGoogle && currentPassword && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      const updated = await updateProfileApi(payload);
      loginUser(localStorage.getItem('token'), updated);
      setMsg('Profile updated');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setErr(err.response?.data?.error || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-[#f1f1f1] block mb-1">Email</label>
        <input
          type="email"
          value={user?.email || ''}
          disabled
          className="w-full border dark:border-[#2a2a35] rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-[#22222e] text-gray-500 dark:text-gray-400"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-[#f1f1f1] block mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border dark:border-[#2a2a35] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none dark:bg-[#22222e] dark:text-[#f1f1f1]"
        />
      </div>

      {!isGoogle && (
        <>
          <hr className="border-gray-100 dark:border-[#2a2a35]" />
          <p className="text-sm font-medium text-gray-700 dark:text-[#f1f1f1]">Change Password</p>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className="w-full border dark:border-[#2a2a35] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none dark:bg-[#22222e] dark:text-[#f1f1f1]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full border dark:border-[#2a2a35] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none dark:bg-[#22222e] dark:text-[#f1f1f1]"
            />
          </div>
        </>
      )}

      {err && <p className="text-sm text-red-600 dark:text-red-400">{err}</p>}
      {msg && <p className="text-sm text-emerald-600 dark:text-emerald-400">{msg}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}

function PrivacySection() {
  return (
    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
      <h3 className="font-semibold text-gray-900 dark:text-[#f1f1f1] text-base">Privacy Notice</h3>
      <p>
        CONTRI takes your privacy seriously. We only collect the information you provide when
        creating an account — your name, email, and profile picture (if using Google Sign-In).
      </p>
      <p>
        Your financial data (expenses, groups, balances) is stored securely on our servers and
        is never shared with third parties. We do not sell or monetize your data.
      </p>
      <p>
        Communications from CONTRI are limited to essential service emails: verification codes,
        password resets, and group invites. You will not receive marketing emails.
      </p>
      <h4 className="font-semibold text-gray-900 dark:text-[#f1f1f1]">Data You Control</h4>
      <ul className="list-disc list-inside space-y-1">
        <li>You can update your name and password at any time from Settings.</li>
        <li>You can leave any group you are a member of.</li>
        <li>You can delete expenses you created.</li>
        <li>Contact us to request account deletion.</li>
      </ul>
    </div>
  );
}

function FAQSection() {
  return (
    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
      {[
        {
          q: 'How are expenses split?',
          a: 'By default, expenses are split equally among selected members. The remainder of uneven division goes to the person who paid.',
        },
        {
          q: 'What does "Settle Up" do?',
          a: 'Settle Up creates a settlement expense that clears debts between two members. It does not involve real payment — it just updates the group balances.',
        },
        {
          q: 'Can I remove a group member?',
          a: 'Currently, members can only be removed by leaving the group. Contact the group creator if you need assistance.',
        },
        {
          q: 'How do I verify my email?',
          a: 'After registration, a 6-digit code is sent to your email. Enter it on the verification page. The code expires in 10 minutes.',
        },
        {
          q: 'I forgot my password',
          a: 'Use the "Forgot Password" link on the login page to receive a reset code via email.',
        },
        {
          q: 'Is my financial data safe?',
          a: 'Yes. All data is encrypted in transit and at rest. We use industry-standard security practices to protect your information.',
        },
      ].map((item) => (
        <div key={item.q}>
          <h4 className="font-semibold text-gray-900 dark:text-[#f1f1f1] mb-1">{item.q}</h4>
          <p>{item.a}</p>
        </div>
      ))}
    </div>
  );
}

function HelpSection() {
  return (
    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
      <h3 className="font-semibold text-gray-900 dark:text-[#f1f1f1] text-base">Help & Support</h3>
      <p>
        Need help using CONTRI? Here are the resources available to you:
      </p>
      <div className="space-y-3">
        <div className="bg-gray-50 dark:bg-[#22222e] rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 dark:text-[#f1f1f1] mb-1">Getting Started</h4>
          <p>Create a group, add members via email invite, then start adding expenses. CONTRI will automatically calculate who owes whom.</p>
        </div>
        <div className="bg-gray-50 dark:bg-[#22222e] rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 dark:text-[#f1f1f1] mb-1">Creating an Expense</h4>
          <p>Click "Add Expense" in any group. Enter a title, amount, who paid, and who should split. The split is equal by default.</p>
        </div>
        <div className="bg-gray-50 dark:bg-[#22222e] rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 dark:text-[#f1f1f1] mb-1">Reading Balances</h4>
          <p>The dashboard shows your overall balance. Inside a group, you can see detailed balances per member and click "Settle Up" to record a payment.</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 pt-2">
        For further assistance, email us at{' '}
        <a href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL || 'support@contri.app'}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
          {import.meta.env.VITE_SUPPORT_EMAIL || 'support@contri.app'}
        </a>
      </p>
    </div>
  );
}
