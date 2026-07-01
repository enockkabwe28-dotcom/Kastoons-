import React from 'react';
import { Sparkles, Moon, Sun, Users, RefreshCw, Undo2 } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  activeProjectTitle?: string;
  onExitProject?: () => void;
  onlineCount: number;
}

export default function Header({
  theme,
  setTheme,
  activeProjectTitle,
  onExitProject,
  onlineCount,
}: HeaderProps) {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Branding & Navigation Back */}
        <div className="flex items-center space-x-4">
          {activeProjectTitle ? (
            <button
              onClick={onExitProject}
              className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer group"
              id="exit-project-btn"
            >
              <Undo2 className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Studio</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-violet-600 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight bg-linear-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Kastoons
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Studio v2.5
              </span>
            </div>
          )}

          {activeProjectTitle && (
            <div className="flex items-center space-x-2 pl-4 border-l border-gray-200 dark:border-gray-800">
              <span className="text-xs text-gray-400 uppercase font-mono tracking-wider hidden md:inline">
                Editing:
              </span>
              <span className="font-display font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                {activeProjectTitle}
              </span>
            </div>
          )}
        </div>

        {/* Right: Team Sync & Customization Tools */}
        <div className="flex items-center space-x-3">
          {/* Active Collaboration Indicator */}
          <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <Users className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            <span className="text-xs font-mono font-medium text-gray-700 dark:text-gray-300">
              {onlineCount} {onlineCount === 1 ? 'Editor' : 'Editors'}
            </span>
          </div>

          {/* Sync status */}
          <div className="hidden md:flex items-center space-x-1.5 text-xs text-gray-400 dark:text-gray-500 font-mono">
            <RefreshCw className="w-3 h-3 animate-spin text-purple-500" />
            <span>Synced to Cloud</span>
          </div>

          {/* Light/Dark Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            id="theme-toggle-btn"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
