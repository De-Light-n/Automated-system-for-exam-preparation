import React, { useState } from 'react';
import { UserStats } from '../types';
import { GraduationCap, Trophy, Flame, BookOpen, ChevronDown, LogOut, LogIn } from 'lucide-react';

interface HeaderProps {
  stats: UserStats;
  goHome: () => void;
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ stats, goHome, isAuthenticated, onLogin, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const progressPercent = (stats.xp % 1000) / 10; // Assuming 1000 XP per level

  return (
    <header className="sticky top-4 z-50 px-4 mb-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl shadow-lg shadow-slate-200/50 px-4 py-3 flex items-center justify-between transition-all hover:shadow-xl hover:shadow-slate-200/60">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={goHome}>
          <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight">
            ExamNinja
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
           {/* Streak */}
           <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-full border border-orange-100" title="Днів підряд">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span className="text-orange-700 font-bold text-sm">{stats.streak}</span>
          </div>

          {/* Level & XP */}
          <div className="hidden sm:flex flex-col min-w-[140px]">
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
              <span>{stats.level}</span>
              <span>{stats.xp} XP</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-1000 ease-out relative" 
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-secondary transition-colors relative group"
            >
              <Trophy className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              <ChevronDown className={`w-3 h-3 absolute -bottom-1 -right-1 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-2 py-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="text-sm text-slate-700">Карток</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{stats.cardsLearned}</span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-accent" />
                          <span className="text-sm text-slate-700">Тестів</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{stats.testsPassed}</span>
                      </div>
                    </div>
                  </div>

                  {isAuthenticated && onLogout && (
                    <div className="p-2 border-t border-slate-100">
                      <button
                        onClick={() => { onLogout(); setShowDropdown(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Вийти
                      </button>
                    </div>
                  )}
                  
                  {!isAuthenticated && onLogin && (
                    <div className="p-2 border-t border-slate-100">
                      <button
                        onClick={() => { onLogin(); setShowDropdown(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium"
                      >
                        <LogIn className="w-4 h-4" />
                        Увійти
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};