const COLORS = ['#FEE2E2', '#DBEAFE', '#D1FAE5', '#FEF3C7', '#EDE9FE', '#FCE7F3', '#CFFAFE', '#FFEDD5'];

function getInitials(name) {
  return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

export default function MemberList({ members }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f1f1] mb-3">Members</h3>
      <div className="flex flex-wrap gap-3">
        {members.map((m, i) => (
          <div
            key={m.id}
            className="flex items-center gap-2.5 bg-white dark:bg-[#1a1a23] rounded-xl border border-gray-100 dark:border-[#2a2a35] px-3.5 py-2 hover:border-gray-200 dark:hover:border-[#2a2a35] hover:shadow-sm transition-all"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length], color: '#374151' }}
            >
              {getInitials(m.name)}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-[#f1f1f1]">{m.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
