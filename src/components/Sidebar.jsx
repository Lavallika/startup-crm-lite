import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart2, X } from 'lucide-react';
import DarkModeToggle from './common/DarkModeToggle';

const NAV_ITEMS = [
  { to: '/',          label: 'Dashboard',  subLabel: 'Overview & KPIs',     icon: LayoutDashboard },
  { to: '/leads',     label: 'Leads',      subLabel: 'Manage pipeline',      icon: Users           },
  { to: '/analytics', label: 'Analytics',  subLabel: 'Reports & trends',     icon: BarChart2       },
];

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  // ─── Desktop & tablet: left sidebar ────────────────────────────────────────
  const desktopLinkClass = ({ isActive }) =>
    'group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1 ' +
    (isActive
      ? 'bg-indigo-800 dark:bg-indigo-900/80 text-white shadow-sm'
      : 'text-indigo-100 dark:text-gray-300 hover:bg-indigo-700/60 dark:hover:bg-gray-800 hover:text-white');

  // ─── Mobile bottom bar links ────────────────────────────────────────────────
  const mobileLinkClass = ({ isActive }) =>
    'flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-3 py-2 rounded-lg transition-colors ' +
    (isActive
      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
      : 'text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400');

  // ─── Mobile drawer link ────────────────────────────────────────────────────
  const drawerLinkClass = ({ isActive }) =>
    'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors mb-2 min-h-[44px] ' +
    (isActive
      ? 'bg-indigo-800 text-white dark:bg-indigo-900'
      : 'text-indigo-100 dark:text-gray-300 hover:bg-indigo-700 dark:hover:bg-gray-800 hover:text-white');

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
        bg-indigo-600 dark:bg-gray-900
        shadow-xl border-r border-transparent dark:border-gray-800
        transition-transform duration-300 ease-in-out
        w-64 md:w-20 lg:w-64
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand & Close button */}
        <div className="flex items-center justify-between px-4 py-5 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            {/* Always show text on mobile drawer, or on lg+ desktop */}
            <span className={`text-white font-bold text-xl tracking-tight whitespace-nowrap ${!isMobileMenuOpen ? 'hidden lg:block' : 'block'}`}>
              Startup CRM
            </span>
          </div>
          
          {/* Close button - mobile only */}
          {isMobileMenuOpen && (
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-white/70 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 lg:px-4 overflow-y-auto space-y-1 mt-2">
          {NAV_ITEMS.map(({ to, label, subLabel, icon: Icon }) => (
            <NavLink 
              key={to} 
              to={to} 
              end={to === '/'} 
              className={isMobileMenuOpen ? drawerLinkClass : desktopLinkClass}
              onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
            >
              <span className="flex-shrink-0">
                <Icon className={isMobileMenuOpen ? "w-6 h-6" : "w-5 h-5"} />
              </span>
              <span className={`flex flex-col min-w-0 ${!isMobileMenuOpen ? 'hidden lg:flex' : 'flex'}`}>
                <span className="leading-tight">{label}</span>
                <span className="text-xs font-normal opacity-60 leading-tight">{subLabel}</span>
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Dark mode toggle */}
        <div className={`p-4 border-t border-indigo-500 dark:border-gray-800 flex ${!isMobileMenuOpen ? 'justify-center lg:justify-start' : 'justify-start'}`}>
          <DarkModeToggle />
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAVIGATION BAR ─────────────────────────────────────── */}
      <nav className="
        md:hidden fixed bottom-0 left-0 right-0 z-30
        bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800
        flex items-center justify-around
        px-2 py-1 safe-area-inset-bottom
      ">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={mobileLinkClass}>
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-tight">{label}</span>
          </NavLink>
        ))}
        {/* Compact theme toggle on bottom bar */}
        <div className="flex flex-col items-center justify-center gap-1 min-h-[44px]">
          <DarkModeToggle compact />
          <span className="text-[10px] font-medium text-slate-500 dark:text-gray-400 leading-tight">Theme</span>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
