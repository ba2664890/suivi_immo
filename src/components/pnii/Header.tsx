'use client';

import { Member } from '@/lib/data';

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
    <header className="sticky top-0 z-50 glass-strong shadow-sm shadow-black/[0.03]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 shrink-0 shadow-md shadow-violet-500/20">
            <i className="ti ti-building-skyscraper text-lg text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-extrabold gradient-text leading-tight">PNII Sénégal</h1>
            <p className="text-[10px] text-gray-400 hidden sm:block capitalize font-medium">{dateStr}</p>
          </div>
        </div>

        {/* Active member pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white rounded-full pl-1.5 pr-3 py-1.5 border border-gray-200/80 shadow-sm">
            <div className="relative">
              <div
                className={`w-7 h-7 rounded-full ${activeMember.color} flex items-center justify-center text-white font-bold text-[9px] shrink-0 ring-2 ${activeMember.borderColor} ring-offset-1 shadow-sm`}
              >
                {activeMember.initial}
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <span className="text-xs font-semibold text-gray-700 hidden sm:inline truncate max-w-[130px]">
              {activeMember.name}
            </span>
            <span className="text-[9px] font-bold bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-full px-2 py-0.5 shadow-sm shadow-violet-500/20">
              Moi
            </span>
          </div>
          <button
            onClick={onChangeMember}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-50 hover:bg-violet-50 text-gray-500 hover:text-violet-600 border border-gray-200/80 hover:border-violet-200 transition-all hover:shadow-sm"
            title="Changer de membre"
          >
            <i className="ti ti-arrows-exchange text-base" />
          </button>
        </div>
      </div>
    </header>
  );
}
