'use client';

import { useState } from 'react';
import {
  Phase, Task, MEMBERS,
  PRIORITY_STYLES, STATUS_STYLES, PHASE_COLORS,
  isPhaseUnlocked, daysUntilUnlock,
} from '@/lib/data';

interface PhasesViewProps {
  phases: Phase[];
  activeMemberId: string;
  onToggleAssign: (taskId: string, memberId: string) => void;
  onCycleStatus: (taskId: string) => void;
}

export default function PhasesView({
  phases, activeMemberId, onToggleAssign, onCycleStatus,
}: PhasesViewProps) {
  const now = new Date();
  const [activeTab, setActiveTab] = useState('ph0');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-md shadow-violet-500/20">
          <i className="ti ti-stack text-lg text-white" />
        </div>
        <h2 className="text-lg font-extrabold text-gray-900">Phases</h2>
      </div>

      {/* Phase tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {phases.map(phase => {
          const pc = PHASE_COLORS[phase.id];
          const unlocked = isPhaseUnlocked(phase, now);
          const isActive = activeTab === phase.id;
          const days = daysUntilUnlock(phase, now);

          return (
            <button
              key={phase.id}
              onClick={() => setActiveTab(phase.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 border
                ${!unlocked
                  ? isActive
                    ? 'bg-gray-100 text-gray-600 border-gray-300 shadow-sm'
                    : 'bg-gray-50/50 text-gray-400 border-gray-200/60 hover:bg-gray-100'
                  : isActive
                    ? `${pc.bg} ${pc.text} ${pc.border} shadow-sm`
                    : 'bg-white/80 text-gray-500 border-gray-200/60 hover:bg-gray-50 hover:shadow-sm'
                }`}
            >
              {!unlocked && <i className="ti ti-lock text-[10px] opacity-60" />}
              {phase.shortName}
              {!unlocked && (
                <span className="text-[8px] opacity-50 font-semibold ml-0.5">J-{days}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Phase content */}
      {phases.map(phase => {
        if (phase.id !== activeTab) return null;
        const pc = PHASE_COLORS[phase.id];
        const unlocked = isPhaseUnlocked(phase, now);
        const days = daysUntilUnlock(phase, now);
        const done = phase.tasks.filter(t => t.status === 'Terminé').length;
        const progress = phase.tasks.length > 0 ? Math.round((done / phase.tasks.length) * 100) : 0;

        return (
          <div key={phase.id} className="space-y-4">
            {/* Phase header card */}
            <div className={`relative overflow-hidden rounded-2xl border ${unlocked ? pc.border : 'border-gray-200/60'} p-5 sm:p-6 shadow-sm`}>
              {/* Background gradient */}
              <div className={`absolute inset-0 ${unlocked ? pc.bg : 'bg-gray-50'} opacity-80`} />
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/20 blur-2xl -translate-y-1/2 translate-x-1/4" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`w-10 h-10 rounded-xl ${unlocked ? pc.bgSolid : 'bg-gray-400'} flex items-center justify-center text-white font-bold text-[10px] shadow-md`}>
                        {!unlocked ? <i className="ti ti-lock text-base" /> : phase.shortName}
                      </div>
                      <div>
                        <h3 className={`text-base sm:text-lg font-extrabold ${unlocked ? pc.text : 'text-gray-500'}`}>
                          {phase.name}
                        </h3>
                        <p className="text-[11px] text-gray-500 font-medium">{phase.dates}</p>
                      </div>
                    </div>
                    {!unlocked && (
                      <div className="mt-2 inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[11px] text-gray-500 border border-gray-200/60 shadow-sm">
                        <i className="ti ti-clock text-sm text-gray-400" />
                        <span className="font-semibold">Dans {days} jour{days > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-3xl font-extrabold ${unlocked ? 'text-gray-900' : 'text-gray-400'}`}>{progress}%</p>
                    <p className="text-[10px] text-gray-400 font-semibold">{done}/{phase.tasks.length}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 w-full h-2.5 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${unlocked ? pc.bgSolid : 'bg-gray-400'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Deliverable */}
                <div className="mt-3 flex items-center gap-2">
                  <i className="ti ti-package text-sm text-gray-400" />
                  <span className="text-[11px] text-gray-600">
                    <span className="font-bold">Livrable :</span> {phase.deliverable}
                  </span>
                </div>
              </div>
            </div>

            {/* Task grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${!unlocked ? 'opacity-40 pointer-events-none' : ''}`}>
              {phase.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  phaseColor={pc}
                  activeMemberId={activeMemberId}
                  onToggleAssign={onToggleAssign}
                  onCycleStatus={onCycleStatus}
                />
              ))}
            </div>

            {/* Deliverables section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-2">
                <i className="ti ti-package text-base text-violet-500" />
                Livrable clé
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">{phase.deliverable}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskCard({
  task, phaseColor, activeMemberId, onToggleAssign, onCycleStatus,
}: {
  task: Task;
  phaseColor: { bg: string; border: string; text: string; bgSolid: string; ring: string };
  activeMemberId: string;
  onToggleAssign: (taskId: string, memberId: string) => void;
  onCycleStatus: (taskId: string) => void;
}) {
  const ps = PRIORITY_STYLES[task.priority];
  const ss = STATUS_STYLES[task.status];
  const isFull = task.assignedTo.length >= 3;
  const isAssignedToMe = task.assignedTo.includes(activeMemberId);

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl border p-4 flex flex-col gap-3 card-hover ${isAssignedToMe ? `ring-2 ${phaseColor.ring} ring-offset-2 border-transparent shadow-md shadow-violet-500/10` : 'border-gray-200/60'}`}>
      {/* Priority + Title */}
      <div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${ps.bg} ${ps.text} border ${ps.border} mb-2`}>
          {task.priority}
        </span>
        <p className="text-[13px] font-semibold text-gray-900 leading-snug">{task.title}</p>
      </div>

      {/* Status button */}
      <button
        onClick={() => onCycleStatus(task.id)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold w-fit ${ss.bg} ${ss.text} border border-transparent hover:shadow-sm transition-all cursor-pointer`}
      >
        <span className={`w-2 h-2 rounded-full ${ss.dot}`} />
        {task.status}
      </button>

      {/* Member avatars */}
      <div className="flex items-center gap-1 flex-wrap">
        {MEMBERS.map(member => {
          const isAssigned = task.assignedTo.includes(member.id);
          const canAssign = !isAssigned && !isFull;
          const isMe = member.id === activeMemberId;

          return (
            <button
              key={member.id}
              onClick={() => {
                if (isAssigned || canAssign) {
                  onToggleAssign(task.id, member.id);
                }
              }}
              disabled={!isAssigned && isFull}
              title={`${member.name} (${member.role})${isAssigned ? ' — Désassigner' : isFull ? ' — Complet' : ' — Assigner'}`}
              className={`relative w-7 h-7 rounded-xl flex items-center justify-center text-white text-[8px] font-bold transition-all duration-200
                ${isAssigned
                  ? `${member.color} ring-2 ring-offset-1 ${isMe ? member.borderColor : 'ring-gray-200'} shadow-sm`
                  : isFull
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-gray-50 text-gray-300 hover:bg-gray-100 hover:text-gray-400 cursor-pointer border border-dashed border-gray-200'
                }`}
            >
              {member.initial}
              {isMe && isAssigned && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-violet-600 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                  <i className="ti ti-check text-[7px] text-white" />
                </span>
              )}
            </button>
          );
        })}
        <span className="text-[9px] text-gray-300 ml-1 font-semibold">{task.assignedTo.length}/3</span>
      </div>
    </div>
  );
}
