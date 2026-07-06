import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, FileText, LayoutDashboard, LogOut, Shield, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../state/auth.store';

const navItems = [
  { to: '/', label: 'Command', icon: LayoutDashboard },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/admin', label: 'Admin', icon: Shield },
];

export const AppShell = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#eef1f4] text-ink dark:bg-[#14181d] dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-line/80 bg-white/95 px-4 py-5 shadow-sm dark:border-white/10 dark:bg-[#181d23] lg:block">
        <div className="flex items-center gap-3 border-b border-line pb-5 dark:border-white/10">
          <div className="grid h-10 w-10 place-items-center bg-ink text-white">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="text-sm font-bold tracking-[0.18em]">AEGIS</div>
            <div className="text-xs text-steel dark:text-slate-400">Threat & Response Analytics</div>
          </div>
        </div>
        <nav className="mt-6 space-y-1">
          {navItems
            .filter((item) => item.label !== 'Admin' || user?.role === 'ADMIN')
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-ink text-white dark:bg-white dark:text-ink'
                      : 'text-graphite hover:bg-field dark:text-slate-300 dark:hover:bg-white/5',
                  )
                }
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-line bg-white/90 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-[#181d23]/90 md:px-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-steel dark:text-slate-400">Karnataka State Police</div>
              <h1 className="text-lg font-semibold">Crime Intelligence Command Center</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right text-sm sm:block">
                <div className="font-medium">{user?.name}</div>
                <div className="text-xs text-steel dark:text-slate-400">{user?.role}</div>
              </div>
              <button
                aria-label="Log out"
                className="focus-ring border border-line bg-white p-2 hover:bg-field dark:border-white/10 dark:bg-white/5"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-7">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
