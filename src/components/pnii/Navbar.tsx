'use client';

import { ViewType } from '@/lib/data';

interface NavbarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const NAV_ITEMS: { view: ViewType; label: string; icon: string }[] = [
  { view: 'my-tasks', label: 'Mes tâches', icon: 'ti-list-check' },
  { view: 'overview', label: "Vue d'ensemble", icon: 'ti-layout-dashboard' },
  { view: 'phases',   label: 'Phases',       icon: 'ti-stack' },
  { view: 'team',     label: 'Équipe',        icon: 'ti-users' },
];

export default function Navbar({ activeView, onViewChange }: NavbarProps) {
  return (
    <nav className="sticky bottom-0 z-50 glass-strong shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)] safe-area-bottom">
      <div className="max-w-7xl mx-auto flex items-center justify-around px-1">
        {NAV_ITEMS.map(item => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={`flex flex-col items-center gap-0.5 py-2.5 px-3 sm:px-5 transition-all duration-300 min-w-[64px] relative
                ${isActive
                  ? 'text-violet-600'
                  : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {/* Active background pill */}
              {isActive && (
                <span className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-8 bg-violet-50 rounded-xl -z-10" />
              )}
              {/* Active top bar */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-gradient-to-r from-violet-600 to-pink-500 rounded-full" />
              )}
              <i className={`ti ${item.icon} text-[20px] transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-[10px] sm:text-[11px] transition-all ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
