import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout({ children, onSettingsOpen }) {
  return (
    <div className="h-screen flex bg-[#F8FAFC] dark:bg-[#0f0f13]">
      <Sidebar onSettingsOpen={onSettingsOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onSettingsOpen={onSettingsOpen} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
