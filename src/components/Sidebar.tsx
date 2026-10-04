import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Briefcase,
  Send,
  GitFork,
  FileText,
  BarChart3,
  ShieldBan,
  Settings,
  UploadCloud,
  X,
  Sparkles,
  Inbox,
  Sun,
  Moon,
} from 'lucide-react';

export type NavigationTab =
  | 'dashboard'
  | 'contacts'
  | 'students'
  | 'clients'
  | 'campaigns'
  | 'create-campaign'
  | 'sequences'
  | 'templates'
  | 'analytics'
  | 'suppression'
  | 'settings'
  | 'inbox';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  counts: {
    contacts: number;
    students: number;
    clients: number;
    campaigns: number;
    suppression: number;
    replies: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  darkMode = false,
  onToggleDarkMode,
  counts,
}) => {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Replies & Activity', icon: Inbox, badge: counts.replies },
  ];

  const audienceNav = [
    { id: 'contacts', label: 'All Contacts', icon: Users, badge: counts.contacts },
    { id: 'students', label: 'Student Outreach', icon: GraduationCap, badge: counts.students },
    { id: 'clients', label: 'Client Outreach', icon: Briefcase, badge: counts.clients },
  ];

  const campaignNav = [
    { id: 'campaigns', label: 'Campaigns', icon: Send, badge: counts.campaigns },
    { id: 'sequences', label: 'Sequences', icon: GitFork },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const configNav = [
    { id: 'suppression', label: 'Suppression', icon: ShieldBan, badge: counts.suppression },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderNavGroup = (title: string, items: Array<{ id: string; label: string; icon: any; badge?: number }>) => (
    <div className="mb-5">
      <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
        {title}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => {
                onSelectTab(item.id as NavigationTab);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white dark:text-zinc-900' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive
                      ? 'bg-zinc-700 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 font-bold text-sm tracking-tight shadow-xs">
            OH
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-white">
                Outreach Hub
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded">
                SaaS
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 truncate max-w-[140px]">
              Dual Outreach Engine
            </p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-1">
        {renderNavGroup('Overview', mainNav)}
        {renderNavGroup('Audiences', audienceNav)}
        {renderNavGroup('Execution', campaignNav)}
        {renderNavGroup('Deliverability', configNav)}
      </div>

      {/* Theme Toggle & Sandbox Footer */}
      <div className="p-3.5 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2.5">
        {/* Quick Theme Switcher */}
        {onToggleDarkMode && (
          <div className="flex items-center justify-between p-1.5 px-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
              {darkMode ? (
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span className="text-[11px] font-medium">{darkMode ? 'Dark Theme' : 'Light Theme'}</span>
            </div>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="px-2 py-0.5 rounded-lg bg-white dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 border border-zinc-200 dark:border-zinc-600 text-[10px] font-semibold text-zinc-800 dark:text-zinc-200 transition-colors shadow-2xs cursor-pointer"
            >
              Switch to {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>
        )}

        {/* Quick Launch CTA Card */}
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sandbox Mode Active</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-2.5">
            Test student & client flows safely with simulated events.
          </p>
          <button
            id="sidebar-create-campaign-btn"
            onClick={() => {
              onSelectTab('create-campaign');
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-white transition-colors"
          >
            <Send className="w-3 h-3" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Container */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
