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
    <nav className="sticky bottom-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-200 safe-area-bottom">
      <div className="max-w-7xl mx-auto flex items-center justify-around px-2">
        {NAV_ITEMS.map(item => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 sm:px-5 transition-all duration-200 min-w-[64px] relative
                ${isActive
                  ? 'text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
              )}
              <i className={`ti ${item.icon} text-xl ${isActive ? 'font-bold' : ''}`} />
              <span className={`text-[10px] sm:text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
