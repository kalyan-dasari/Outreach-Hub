import React, { useState } from 'react';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Send,
  ShieldCheck,
  Zap,
  User,
  LogOut,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
  onNewCampaign: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeProvider: string;
  user: UserProfile;
  onResetDemoData: () => void;
  onOpenLoginModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onOpenSearch,
  onNewCampaign,
  darkMode,
  onToggleDarkMode,
  activeProvider,
  user,
  onResetDemoData,
  onOpenLoginModal,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left Area: Mobile Menu & Search trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          id="mobile-sidebar-toggle-btn"
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input Trigger */}
        <button
          id="global-search-trigger"
          onClick={onOpenSearch}
          className="flex-1 flex items-center justify-between px-3 py-2 text-xs text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-lg transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-zinc-400" />
            <span className="hidden sm:inline">Search contacts, colleges, campaigns, templates...</span>
            <span className="sm:hidden">Search Outreach Hub...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-500 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Area: Status Badges, Actions & User */}
      <div className="flex items-center gap-2.5">
        {/* Visible DEMO MODE Indicator (Mandated by Prompt) */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>DEMO MODE</span>
          <span className="text-amber-600 dark:text-amber-400 font-normal">| {activeProvider.toUpperCase()}</span>
        </div>

        {/* Quick Reset Demo Data */}
        <button
          onClick={onResetDemoData}
          title="Reset sandbox demo data"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset Data</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={onToggleDarkMode}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/80 rounded-xl transition-all shadow-2xs cursor-pointer"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle color theme"
        >
          {darkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-medium hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[11px] font-medium hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* Primary CTA: New Campaign */}
        <button
          id="header-create-campaign-btn"
          onClick={onNewCampaign}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Create Campaign</span>
          <span className="sm:hidden">New</span>
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            id="user-profile-menu-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-200 overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <ChevronDown className="w-3 h-3 text-zinc-500 hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                <p className="font-semibold text-zinc-900 dark:text-white">{user.name}</p>
                <p className="text-zinc-500 text-[11px] truncate">{user.email}</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-600 dark:text-zinc-300 font-medium">
                  {user.role}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onOpenLoginModal();
                }}
                className="w-full text-left px-3 py-1.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5" />
                <span>Switch / Sign In Profile</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onResetDemoData();
                }}
                className="w-full text-left px-3 py-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Sandbox</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
