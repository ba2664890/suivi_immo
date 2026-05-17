'use client';

import { MEMBERS, Member } from '@/lib/data';

interface MemberSelectorProps {
  onSelect: (memberId: string) => void;
}

export default function MemberSelector({ onSelect }: MemberSelectorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="w-full max-w-3xl text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 mb-4">
          <i className="ti ti-building-skyscraper text-3xl text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          PNII Sénégal
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Plateforme Nationale d&apos;Information Immobilière — Suivi de projet
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-lg text-sm">
          <i className="ti ti-user-question text-lg" />
          Qui es-tu ? Sélectionne ton profil pour continuer.
        </div>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MEMBERS.map((member: Member) => (
          <button
            key={member.id}
            onClick={() => onSelect(member.id)}
            className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 text-left"
          >
            <div
              className={`w-12 h-12 rounded-full ${member.color} flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover:scale-110 transition-transform`}
            >
              {member.initial}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 text-sm truncate group-hover:text-gray-700">
                {member.name}
              </div>
              <div className="text-xs text-gray-500 truncate">{member.role}</div>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-8 text-xs text-gray-400">
        Démarrage du projet : Lundi 18 Mai 2026
      </p>
    </div>
  );
}
