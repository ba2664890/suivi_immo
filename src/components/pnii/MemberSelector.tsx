'use client';

import { MEMBERS } from '@/lib/data';

interface MemberSelectorProps {
  onSelect: (memberId: string) => void;
}

export default function MemberSelector({ onSelect }: MemberSelectorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center mesh-bg p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-pink-200/30 blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-blue-200/20 blur-3xl pointer-events-none" />

      <div className="w-full max-w-3xl text-center mb-10 relative z-10">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-500 to-pink-500 shadow-lg shadow-violet-500/25 mb-6 animate-float">
          <i className="ti ti-building-skyscraper text-4xl text-white" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
          <span className="gradient-text">PNII Sénégal</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Plateforme Nationale d&apos;Information Immobilière
          <br />
          <span className="text-gray-400">Suivi de projet en temps réel</span>
        </p>

        {/* Prompt card */}
        <div className="mt-6 inline-flex items-center gap-2.5 bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-200/60 text-violet-700 px-5 py-2.5 rounded-2xl text-sm shadow-sm">
          <span className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center">
            <i className="ti ti-user-question text-sm" />
          </span>
          <span className="font-medium">Qui es-tu ? Sélectionne ton profil</span>
        </div>
      </div>

      {/* Member grid */}
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
        {MEMBERS.map((member, idx) => (
          <button
            key={member.id}
            onClick={() => onSelect(member.id)}
            className="group flex items-center gap-3.5 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 hover:border-violet-300/50 hover:-translate-y-1 transition-all duration-300 text-left"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div
              className={`w-13 h-13 rounded-2xl ${member.color} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
              style={{ width: '52px', height: '52px' }}
            >
              {member.initial}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-gray-900 text-[13px] truncate group-hover:text-violet-700 transition-colors">
                {member.name}
              </div>
              <div className="text-[11px] text-gray-400 truncate font-medium">{member.role}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-10 flex items-center gap-2 text-xs text-gray-400 relative z-10">
        <i className="ti ti-calendar-event text-sm" />
        <span>Démarrage du projet : Lundi 18 Mai 2026</span>
      </div>
    </div>
  );
}
