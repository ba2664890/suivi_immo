'use client';

import {
  Phase, MEMBERS,
  computeMemberScore, PHASE_COLORS,
} from '@/lib/data';

interface TeamViewProps {
  phases: Phase[];
  activeMemberId: string;
}

export default function TeamView({ phases, activeMemberId }: TeamViewProps) {
  const memberScores = MEMBERS.map(member => {
    const score = computeMemberScore(member.id, phases);
    const assignedTasks = phases.flatMap(p => p.tasks).filter(t => t.assignedTo.includes(member.id));
    const done = assignedTasks.filter(t => t.status === 'Terminé').length;
    const inProgress = assignedTasks.filter(t => t.status === 'En cours').length;
    const todo = assignedTasks.filter(t => t.status === 'À faire').length;
    const taskDetails = assignedTasks.map(t => {
      const phase = phases.find(p => p.id === t.phaseId);
      return { ...t, phaseName: phase?.shortName ?? '', phaseId: t.phaseId };
    });
    return { member, score, done, inProgress, todo, total: assignedTasks.length, taskDetails };
  }).sort((a, b) => b.score - a.score);

  const maxScore = Math.max(...memberScores.map(m => m.score), 1);

  // Get top 3 for podium
  const podium = memberScores.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-md shadow-violet-500/20">
          <i className="ti ti-users text-lg text-white" />
        </div>
        <h2 className="text-lg font-extrabold text-gray-900">Équipe</h2>
      </div>

      {/* Podium - Top 3 */}
      {podium.length > 0 && podium.some(m => m.score > 0) && (
        <div className="flex items-end justify-center gap-3 pt-4 pb-2">
          {/* 2nd place */}
          {podium[1] && (
            <PodiumCard ms={podium[1]} rank={2} isActive={podium[1].member.id === activeMemberId} maxScore={maxScore} />
          )}
          {/* 1st place */}
          {podium[0] && (
            <PodiumCard ms={podium[0]} rank={1} isActive={podium[0].member.id === activeMemberId} maxScore={maxScore} />
          )}
          {/* 3rd place */}
          {podium[2] && (
            <PodiumCard ms={podium[2]} rank={3} isActive={podium[2].member.id === activeMemberId} maxScore={maxScore} />
          )}
        </div>
      )}

      {/* Full ranking */}
      <div className="space-y-2.5">
        {memberScores.map((ms, idx) => {
          const isActive = ms.member.id === activeMemberId;
          const rank = idx + 1;
          const barWidth = maxScore > 0 ? (ms.score / maxScore) * 100 : 0;
          const pc = ms.taskDetails.length > 0 ? PHASE_COLORS[ms.taskDetails[0].phaseId] : null;

          return (
            <div
              key={ms.member.id}
              className={`relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl border p-4 transition-all duration-300 card-hover
                ${isActive
                  ? `ring-2 ${ms.member.borderColor} ring-offset-2 shadow-md shadow-violet-500/10 border-transparent`
                  : 'border-gray-200/60 hover:shadow-md'
                }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-pink-500 rounded-l-2xl" />
              )}

              <div className="flex items-start gap-3">
                {/* Rank badge */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm
                  ${rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' :
                    rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                    rank === 3 ? 'bg-gradient-to-br from-orange-300 to-amber-400 text-white' :
                    'bg-gray-100 text-gray-400'
                  }`}
                >
                  {rank}
                </div>

                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className={`w-11 h-11 rounded-xl ${ms.member.color} flex items-center justify-center text-white font-bold text-xs shadow-md`}
                  >
                    {ms.member.initial}
                  </div>
                  {isActive && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-[7px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm">
                      Moi
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-bold text-gray-900">{ms.member.name}</span>
                      <span className="text-[10px] text-gray-400 ml-2 font-medium">{ms.member.role}</span>
                    </div>
                    <span className="text-lg font-extrabold gradient-text">{ms.score} pts</span>
                  </div>

                  {/* Score bar */}
                  <div className="mt-2 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${ms.member.color} rounded-full transition-all duration-700`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  {/* Stats */}
                  <div className="mt-2 flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1 text-gray-500 font-medium">
                      <i className="ti ti-list-check text-xs" />
                      {ms.total}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <i className="ti ti-circle-check text-xs" />
                      {ms.done}
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <i className="ti ti-loader text-xs" />
                      {ms.inProgress}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 font-medium">
                      <i className="ti ti-circle-dashed text-xs" />
                      {ms.todo}
                    </span>
                  </div>

                  {/* Task list */}
                  {ms.taskDetails.length > 0 && (
                    <div className="mt-3 space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                      {ms.taskDetails.map(task => {
                        const tpc = PHASE_COLORS[task.phaseId];
                        const statusStyle =
                          task.status === 'Terminé' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                          task.status === 'En cours' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                          'text-gray-500 bg-gray-50 border-gray-100';

                        return (
                          <div key={task.id} className="flex items-center gap-2 text-[10px]">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md font-bold ${tpc.text} ${tpc.bg}`}>
                              {task.phaseName}
                            </span>
                            <span className="text-gray-600 truncate flex-1 font-medium">{task.title}</span>
                            <span className={`px-1.5 py-0.5 rounded-md font-semibold border ${statusStyle}`}>
                              {task.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scoring legend */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-5 shadow-sm">
        <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5">
          <i className="ti ti-info-circle text-sm text-violet-500" />
          Barème de score
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
          <div className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl px-3 py-2.5 border border-red-100/60">
            <span className="font-extrabold text-red-600">Critique</span>
            <span className="text-red-500 font-medium">30 pts · 15 pts</span>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl px-3 py-2.5 border border-orange-100/60">
            <span className="font-extrabold text-orange-600">Haute</span>
            <span className="text-orange-500 font-medium">20 pts · 10 pts</span>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl px-3 py-2.5 border border-sky-100/60">
            <span className="font-extrabold text-sky-600">Moyenne</span>
            <span className="text-sky-500 font-medium">10 pts · 5 pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Podium card for top 3
function PodiumCard({ ms, rank, isActive, maxScore }: {
  ms: { member: { id: string; name: string; role: string; color: string; borderColor: string; initial: string }; score: number };
  rank: number;
  isActive: boolean;
  maxScore: number;
}) {
  const heights = { 1: 'h-32', 2: 'h-24', 3: 'h-20' };
  const badges = { 1: '🥇', 2: '🥈', 3: '🥉' };
  const sizes = { 1: 'w-14 h-14 text-sm', 2: 'w-12 h-12 text-xs', 3: 'w-10 h-10 text-[10px]' };

  return (
    <div className={`flex flex-col items-center ${rank === 1 ? 'order-2' : rank === 2 ? 'order-1' : 'order-3'}`}>
      <div className="relative mb-2">
        <div className={`${sizes[rank]} rounded-2xl ${ms.member.color} flex items-center justify-center text-white font-bold shadow-lg ${isActive ? `ring-2 ${ms.member.borderColor} ring-offset-2` : ''}`}>
          {ms.member.initial}
        </div>
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg">{badges[rank]}</span>
      </div>
      <p className="text-[10px] font-bold text-gray-800 text-center max-w-[80px] truncate">{ms.member.name}</p>
      <p className="text-lg font-extrabold gradient-text mt-1">{ms.score}</p>
      <div className={`w-20 ${heights[rank]} mt-2 bg-gradient-to-t from-violet-100 to-violet-50 rounded-t-xl flex items-end justify-center pb-2 border border-violet-200/60 border-b-0`}>
        <span className="text-[10px] font-bold text-violet-600">#{rank}</span>
      </div>
    </div>
  );
}
