import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart2, 
  Layers, 
  Settings as SettingsIcon, 
  X, 
  LogOut,
  User as UserIcon
} from 'lucide-react';
import DarkModeToggle from './common/DarkModeToggle';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/',          label: 'Dashboard',  subLabel: 'Overview & KPIs',     icon: LayoutDashboard },
  { to: '/leads',     label: 'Leads',      subLabel: 'Lead records & table', icon: Users           },
  { to: '/pipeline',  label: 'Pipeline',   subLabel: 'Kanban stage board',   icon: Layers          },
  { to: '/analytics', label: 'Analytics',  subLabel: 'Reports & trends',     icon: BarChart2       },
  { to: '/settings',  label: 'Settings',   subLabel: 'Profile & security',   icon: SettingsIcon    },
];

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { logout, user } = useAuth();

  // ─── Desktop & tablet: left sidebar link styling ───────────────────────────
  const desktopLinkClass = ({ isActive }) =>
    'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-1 ' +
    (isActive
      ? 'bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm font-semibold'
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white');

  // ─── Mobile bottom bar links ────────────────────────────────────────────────
  const mobileLinkClass = ({ isActive }) =>
    'flex flex-col items-center justify-center gap-1 min-w-[40px] min-h-[44px] px-2 py-1.5 rounded-lg transition-colors ' +
    (isActive
      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white');

  // ─── Mobile drawer link ────────────────────────────────────────────────────
  const drawerLinkClass = ({ isActive }) =>
    'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors mb-2 min-h-[44px] ' +
    (isActive
      ? 'bg-indigo-50 text-indigo-600 dark:bg-gray-700 dark:text-white font-semibold'
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white');

  return (
    <>
      {/* ── MOBILE DRAWER OVERLAY ───────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── DRAWER / TABLET / DESKTOP LEFT SIDEBAR ──────────────────────────── */}
      <aside className={`
        fixed left-0 top-0 h-screen z-50 flex flex-col
        bg-white dark:bg-gray-800
        shadow-xl border-r border-gray-200 dark:border-gray-700
        transition-transform duration-300 ease-in-out
        w-64 md:w-20 lg:w-64
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-5 lg:px-6">
          <NavLink 
            to="/" 
            className="flex items-center gap-3 focus:outline-none"
            onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
          >
            <div className="flex-shrink-0 w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-600/30">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className={`text-gray-900 dark:text-white font-extrabold text-xl tracking-tight whitespace-nowrap ${!isMobileMenuOpen ? 'hidden lg:block' : 'block'}`}>
              Startup CRM
            </span>
          </NavLink>
          
          {/* Close button - mobile only */}
          {isMobileMenuOpen && (
            <button 
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Close navigation menu"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 lg:px-4 overflow-y-auto space-y-1 mt-1">
          {NAV_ITEMS.map(({ to, label, subLabel, icon: Icon }) => (
            <NavLink 
              key={to} 
              to={to} 
              end={to === '/'} 
              className={isMobileMenuOpen ? drawerLinkClass : desktopLinkClass}
              onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
              title={label}
            >
              <span className="flex-shrink-0">
                <Icon className={isMobileMenuOpen ? "w-6 h-6" : "w-5 h-5"} />
              </span>
              <span className={`flex flex-col min-w-0 ${!isMobileMenuOpen ? 'hidden lg:flex' : 'flex'}`}>
                <span className="leading-tight">{label}</span>
                <span className="text-[11px] font-normal opacity-60 leading-tight mt-0.5">{subLabel}</span>
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section: Theme Toggle + User Profile Card + Logout */}
        <div className="p-3 lg:p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {/* Dark mode toggle */}
          <div className={`flex ${!isMobileMenuOpen ? 'justify-center lg:justify-start' : 'justify-start'}`}>
            <DarkModeToggle />
          </div>

          {/* User profile link & logout — Desktop/Drawer */}
          <div className={`flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700/60 ${!isMobileMenuOpen ? 'hidden lg:flex' : 'flex'}`}>
            <NavLink
              to="/settings"
              onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
              className="flex-1 min-w-0 flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              title="Open Profile Settings"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={14} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{user?.email || ''}</p>
              </div>
            </NavLink>

            <button
              type="button"
              onClick={logout}
              title="Log out of CRM"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shrink-0 cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>

          {/* Tablet collapsed sidebar: User / Logout icons */}
          <div className={`justify-center gap-1 ${!isMobileMenuOpen ? 'hidden md:flex lg:hidden' : 'hidden'}`}>
            <NavLink
              to="/settings"
              title="Settings"
              className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <SettingsIcon size={18} />
            </NavLink>
            <button
              type="button"
              onClick={logout}
              title="Log out"
              className="p-2 rounded-lg text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAVIGATION BAR ─────────────────────────────────────── */}
      <nav className="
        md:hidden fixed bottom-0 left-0 right-0 z-30
        bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700
        flex items-center justify-around
        px-1 py-1 safe-area-inset-bottom
      ">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={mobileLinkClass}>
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-tight">{label}</span>
          </NavLink>
        ))}

        {/* Compact theme toggle on bottom bar */}
        <div className="flex flex-col items-center justify-center gap-0.5 min-h-[44px]">
          <DarkModeToggle compact />
          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 leading-tight">Theme</span>
        </div>

        {/* Logout button in bottom bar */}
        <button
          type="button"
          onClick={logout}
          className="flex flex-col items-center justify-center gap-1 min-w-[40px] min-h-[44px] px-2 py-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-medium leading-tight">Logout</span>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
