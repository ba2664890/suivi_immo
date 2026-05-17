'use client';

import { Member, getMember } from '@/lib/data';

interface HeaderProps {
  activeMember: Member;
  onChangeMember: () => void;
}

export default function Header({ activeMember, onChangeMember }: HeaderProps) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shrink-0">
            <i className="ti ti-building-skyscraper text-lg text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-gray-900 leading-tight">PNII Sénégal</h1>
            <p className="text-xs text-gray-500 hidden sm:block capitalize">{dateStr}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full pl-1 pr-3 py-1 border border-gray-200">
            <div
              className={`w-7 h-7 rounded-full ${activeMember.color} flex items-center justify-center text-white font-bold text-[10px] shrink-0 ring-2 ${activeMember.borderColor} ring-offset-1`}
            >
              {activeMember.initial}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline truncate max-w-[140px]">
              {activeMember.name}
            </span>
            <span className="text-[10px] font-semibold bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-full px-1.5 py-0.5">
              Moi
            </span>
          </div>
          <button
            onClick={onChangeMember}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
            title="Changer de membre"
          >
            <i className="ti ti-refresh text-base" />
          </button>
        </div>
      </div>
    </header>
  );
}
