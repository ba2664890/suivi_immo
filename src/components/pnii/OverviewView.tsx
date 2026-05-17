'use client';

import {
  Phase, PHASE_COLORS, getPhaseProgress, isPhaseUnlocked, daysUntilUnlock,
} from '@/lib/data';

interface OverviewViewProps {
  phases: Phase[];
}

export default function OverviewView({ phases }: OverviewViewProps) {
  const now = new Date();
  const today = now.toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const allTasks = phases.flatMap(p => p.tasks);
  const total = allTasks.length;
  const done = allTasks.filter(t => t.status === 'Terminé').length;
  const inProgress = allTasks.filter(t => t.status === 'En cours').length;
  const todo = allTasks.filter(t => t.status === 'À faire').length;
  const overallProgress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Today */}
      <div className="text-center">
        <p className="text-sm text-gray-500 capitalize">{today}</p>
      </div>

      {/* Global counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <CounterCard label="Total tâches" value={total} icon="ti-list-check" color="bg-gray-100 text-gray-700" />
        <CounterCard label="Terminées" value={done} icon="ti-circle-check" color="bg-green-50 text-green-700" />
        <CounterCard label="En cours" value={inProgress} icon="ti-loader" color="bg-amber-50 text-amber-700" />
        <CounterCard label="À faire" value={todo} icon="ti-circle-dashed" color="bg-gray-50 text-gray-600" />
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Progression globale</span>
          <span className="text-sm font-bold text-gray-900">{overallProgress}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <i className="ti ti-timeline text-base" />
          Timeline des phases
        </h3>

        {/* Horizontal timeline for desktop */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden sm:block absolute top-6 left-0 right-0 h-0.5 bg-gray-200" />
          <div className="hidden sm:grid sm:grid-cols-6 gap-2">
            {phases.map(phase => {
              const pc = PHASE_COLORS[phase.id];
              const unlocked = isPhaseUnlocked(phase, now);
              const progress = getPhaseProgress(phase);
              const days = daysUntilUnlock(phase, now);

              return (
                <div key={phase.id} className="relative flex flex-col items-center">
                  {/* Dot */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs z-10 border-2 border-white shadow-sm
                      ${unlocked ? pc.bgSolid : 'bg-gray-300'}`}
                  >
                    {unlocked ? (
                      <span>{phase.shortName}</span>
                    ) : (
                      <i className="ti ti-lock text-base" />
                    )}
                  </div>

                  {/* Card below */}
                  <div
                    className={`mt-3 w-full rounded-lg border p-3 text-center transition-all
                      ${unlocked
                        ? `${pc.bg} ${pc.border}`
                        : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                  >
                    <p className={`text-xs font-bold ${unlocked ? pc.text : 'text-gray-400'}`}>
                      {phase.name}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{phase.dates}</p>

                    {unlocked ? (
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${pc.bgSolid} rounded-full transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">{progress}% terminé</p>
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-400 mt-2 flex items-center justify-center gap-1">
                        <i className="ti ti-clock text-xs" />
                        Dans {days} jour{days > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile vertical timeline */}
          <div className="sm:hidden space-y-3">
            {phases.map(phase => {
              const pc = PHASE_COLORS[phase.id];
              const unlocked = isPhaseUnlocked(phase, now);
              const progress = getPhaseProgress(phase);
              const days = daysUntilUnlock(phase, now);

              return (
                <div
                  key={phase.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 transition-all
                    ${unlocked
                      ? `${pc.bg} ${pc.border}`
                      : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0
                      ${unlocked ? pc.bgSolid : 'bg-gray-300'}`}
                  >
                    {unlocked ? phase.shortName : <i className="ti ti-lock text-sm" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold ${unlocked ? pc.text : 'text-gray-400'}`}>
                        {phase.shortName} — {phase.name}
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-500">{phase.dates}</p>

                    {unlocked ? (
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${pc.bgSolid} rounded-full transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">{progress}% terminé</p>
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                        <i className="ti ti-clock text-xs" />
                        Dans {days} jour{days > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deliverables overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <i className="ti ti-package text-base" />
          Livrables clés
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {phases.map(phase => {
            const pc = PHASE_COLORS[phase.id];
            const unlocked = isPhaseUnlocked(phase, now);
            return (
              <div
                key={phase.id}
                className={`flex items-start gap-2 p-3 rounded-lg border transition-all
                  ${unlocked ? `${pc.bg} ${pc.border}` : 'bg-gray-50 border-gray-100 opacity-50'}`}
              >
                {!unlocked && <i className="ti ti-lock text-xs text-gray-400 mt-0.5 shrink-0" />}
                <div>
                  <p className={`text-xs font-semibold ${unlocked ? pc.text : 'text-gray-400'}`}>
                    {phase.shortName}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5">{phase.deliverable}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CounterCard({
  label, value, icon, color,
}: {
  label: string; value: number; icon: string; color: string;
}) {
  return (
    <div className={`rounded-xl border border-gray-200 p-3 flex items-center gap-3 ${color.split(' ')[0]}`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <i className={`ti ${icon} text-lg`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-[11px] text-gray-500">{label}</p>
      </div>
    </div>
  );
}
