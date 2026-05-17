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
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <i className="ti ti-stack text-xl text-gray-700" />
        <h2 className="text-lg font-bold text-gray-900">Phases</h2>
      </div>

      {/* Phase tabs - clickable even when locked */}
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
        {phases.map(phase => {
          const pc = PHASE_COLORS[phase.id];
          const unlocked = isPhaseUnlocked(phase, now);
          const isActive = activeTab === phase.id;
          const days = daysUntilUnlock(phase, now);

          return (
            <button
              key={phase.id}
              onClick={() => setActiveTab(phase.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border
                ${!unlocked
                  ? isActive
                    ? 'bg-gray-100 text-gray-500 border-gray-300'
                    : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                  : isActive
                    ? `${pc.bg} ${pc.text} ${pc.border}`
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
            >
              {!unlocked && <i className="ti ti-lock text-xs" />}
              {phase.shortName}
              {!unlocked && (
                <span className="text-[9px] text-gray-400 ml-1">J-{days}</span>
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
            {/* Phase header */}
            <div className={`${unlocked ? pc.bg : 'bg-gray-50'} rounded-xl border ${unlocked ? pc.border : 'border-gray-200'} p-4 sm:p-6`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {!unlocked && (
                      <i className="ti ti-lock text-lg text-gray-400" />
                    )}
                    <h3 className={`text-base sm:text-lg font-bold ${unlocked ? pc.text : 'text-gray-500'}`}>
                      {phase.shortName} — {phase.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{phase.dates}</p>
                  {!unlocked && (
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full text-xs text-gray-500 border border-gray-200">
                      <i className="ti ti-clock text-sm" />
                      Dans {days} jour{days > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-2xl font-bold ${unlocked ? 'text-gray-900' : 'text-gray-400'}`}>{progress}%</p>
                  <p className="text-[10px] text-gray-500">{done}/{phase.tasks.length} tâches</p>
                </div>
              </div>
              <div className="mt-3 w-full h-2 bg-white/60 rounded-full overflow-hidden">
                <div
                  className={`h-full ${unlocked ? pc.bgSolid : 'bg-gray-300'} rounded-full transition-all duration-500`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <i className="ti ti-package text-sm text-gray-500" />
                <span className="text-xs text-gray-600">
                  <span className="font-semibold">Livrable :</span> {phase.deliverable}
                </span>
              </div>
            </div>

            {/* Task grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${!unlocked ? 'opacity-50 pointer-events-none' : ''}`}>
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
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <i className="ti ti-package text-base" />
                Livrable clé
              </h4>
              <p className="text-sm text-gray-600">{phase.deliverable}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- Task card ----
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
    <div className={`bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 transition-all hover:shadow-sm ${isAssignedToMe ? `ring-2 ${phaseColor.ring} ring-offset-1` : ''}`}>
      {/* Title + priority */}
      <div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${ps.bg} ${ps.text} border ${ps.border} mb-1.5`}>
          {task.priority}
        </span>
        <p className="text-sm font-medium text-gray-900 leading-snug">{task.title}</p>
      </div>

      {/* Status button */}
      <button
        onClick={() => onCycleStatus(task.id)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold w-fit ${ss.bg} ${ss.text} hover:opacity-80 transition-opacity cursor-pointer`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
        {task.status}
      </button>

      {/* Member avatars */}
      <div className="flex items-center gap-1.5 flex-wrap">
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
              title={`${member.name} (${member.role})${isAssigned ? ' — Cliquer pour désassigner' : isFull ? ' — Complet' : ' — Cliquer pour assigner'}`}
              className={`relative w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold transition-all
                ${isAssigned
                  ? `${member.color} ring-1 ring-offset-1 ${isMe ? member.borderColor : 'ring-gray-300'}`
                  : isFull
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 cursor-pointer'
                }`}
            >
              {member.initial}
              {isMe && isAssigned && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full flex items-center justify-center">
                  <i className="ti ti-check text-[7px] text-white" />
                </span>
              )}
            </button>
          );
        })}
        <span className="text-[10px] text-gray-400 ml-1">{task.assignedTo.length}/3</span>
      </div>
    </div>
  );
}
