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
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 p-6 sm:p-8 text-white shadow-xl shadow-violet-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHY2aDR2LTJtMC04aC0ydjJoMnYtMm0tNC00djRoMnYtNGgtMm0wIDhoMnYtMmgtMnYyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-white/70">
            <i className="ti ti-calendar-event text-sm" />
            <span className="text-xs font-medium capitalize">{today}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-1">Tableau de bord</h2>
          <p className="text-white/60 text-sm">Progression et vue d&apos;ensemble du projet</p>

          {/* Progress ring */}
          <div className="mt-6 flex items-center gap-6">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - overallProgress / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-extrabold">{overallProgress}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="text-xs text-white/80">{done} terminées sur {total}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-300" />
                <span className="text-xs text-white/80">{inProgress} en cours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/30" />
                <span className="text-xs text-white/80">{todo} à faire</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <CounterCard label="Total tâches" value={total} icon="ti-list-check" gradient="from-gray-500 to-gray-600" />
        <CounterCard label="Terminées" value={done} icon="ti-circle-check" gradient="from-emerald-500 to-green-600" />
        <CounterCard label="En cours" value={inProgress} icon="ti-loader" gradient="from-amber-500 to-orange-500" />
        <CounterCard label="À faire" value={todo} icon="ti-circle-dashed" gradient="from-slate-400 to-slate-500" />
      </div>

      {/* Timeline */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
          <i className="ti ti-timeline text-base text-violet-500" />
          Timeline des phases
        </h3>

        {/* Desktop horizontal timeline */}
        <div className="relative hidden sm:block">
          {/* Connection line */}
          <div className="absolute top-7 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-200 via-pink-200 to-red-200 rounded-full" />
          <div className="grid grid-cols-6 gap-3">
            {phases.map(phase => {
              const pc = PHASE_COLORS[phase.id];
              const unlocked = isPhaseUnlocked(phase, now);
              const progress = getPhaseProgress(phase);
              const days = daysUntilUnlock(phase, now);

              return (
                <div key={phase.id} className="relative flex flex-col items-center">
                  {/* Node */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-[10px] z-10 border-2 border-white shadow-lg transition-all duration-500
                      ${unlocked
                        ? `bg-gradient-to-br ${pc.bgSolid.replace('bg-', 'from-').replace('-500', '-500')} ${pc.bgSolid.replace('bg-', 'to-').replace('-500', '-600')} shadow-${phase.color}-500/20`
                        : 'bg-gradient-to-br from-gray-300 to-gray-400 shadow-gray-300/20'
                      }`}
                  >
                    {unlocked ? phase.shortName : <i className="ti ti-lock text-lg opacity-80" />}
                  </div>

                  {/* Card */}
                  <div
                    className={`mt-3 w-full rounded-xl p-3 text-center transition-all card-hover
                      ${unlocked
                        ? `${pc.bg} border ${pc.border}`
                        : 'bg-gray-50/80 border border-gray-200/60 opacity-50'
                      }`}
                  >
                    <p className={`text-[11px] font-bold ${unlocked ? pc.text : 'text-gray-400'}`}>
                      {phase.name}
                    </p>
                    <p className="text-[9px] text-gray-400 mt-0.5 font-medium">{phase.dates}</p>

                    {unlocked ? (
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-white/70 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${pc.bgSolid.replace('bg-', 'from-').replace('-500', '-400')} ${pc.bgSolid.replace('bg-', 'to-').replace('-500', '-600')} transition-all duration-700`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-gray-500 mt-1 font-semibold">{progress}%</p>
                      </div>
                    ) : (
                      <div className="mt-2 inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-full text-[9px] text-gray-400 border border-gray-100">
                        <i className="ti ti-clock text-[10px]" />
                        Dans {days}j
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="sm:hidden space-y-2">
          {phases.map(phase => {
            const pc = PHASE_COLORS[phase.id];
            const unlocked = isPhaseUnlocked(phase, now);
            const progress = getPhaseProgress(phase);
            const days = daysUntilUnlock(phase, now);

            return (
              <div
                key={phase.id}
                className={`flex items-center gap-3 rounded-xl p-3 transition-all
                  ${unlocked
                    ? `${pc.bg} border ${pc.border}`
                    : 'bg-gray-50/80 border border-gray-200/60 opacity-50'
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[9px] shrink-0 shadow-md
                    ${unlocked ? pc.bgSolid : 'bg-gray-400'}`}
                >
                  {unlocked ? phase.shortName : <i className="ti ti-lock text-sm" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[11px] font-bold ${unlocked ? pc.text : 'text-gray-400'}`}>
                    {phase.shortName} — {phase.name}
                  </p>
                  <p className="text-[9px] text-gray-400 font-medium">{phase.dates}</p>
                  {unlocked ? (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/70 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pc.bgSolid} transition-all duration-700`} style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-[9px] font-semibold text-gray-500">{progress}%</span>
                    </div>
                  ) : (
                    <p className="text-[9px] text-gray-400 mt-1 flex items-center gap-1">
                      <i className="ti ti-clock text-[10px]" />
                      Dans {days}j
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deliverables */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <i className="ti ti-package text-base text-violet-500" />
          Livrables clés
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {phases.map(phase => {
            const pc = PHASE_COLORS[phase.id];
            const unlocked = isPhaseUnlocked(phase, now);
            return (
              <div
                key={phase.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all card-hover
                  ${unlocked ? `${pc.bg} ${pc.border}` : 'bg-gray-50/50 border-gray-100 opacity-40'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[9px] font-bold shrink-0 ${unlocked ? pc.bgSolid : 'bg-gray-300'}`}>
                  {!unlocked ? <i className="ti ti-lock text-xs" /> : phase.shortName}
                </div>
                <div className="min-w-0">
                  <p className={`text-[11px] font-bold ${unlocked ? pc.text : 'text-gray-400'}`}>
                    {phase.shortName}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{phase.deliverable}</p>
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
  label, value, icon, gradient,
}: {
  label: string; value: number; icon: string; gradient: string;
}) {
  return (
    <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm p-4 flex items-center gap-3 card-hover">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shadow-gray-500/10 shrink-0`}>
        <i className={`ti ${icon} text-lg text-white`} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900 leading-none">{value}</p>
        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{label}</p>
      </div>
    </div>
  );
}
