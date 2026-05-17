// ============================================================
// PNII Sénégal — Project Tracking Data Layer
// ============================================================

export type Priority = 'Critique' | 'Haute' | 'Moyenne';
export type TaskStatus = 'À faire' | 'En cours' | 'Terminé';

export interface Member {
  id: string;
  name: string;
  role: string;
  color: string;        // Tailwind bg class
  textColor: string;    // Tailwind text class
  borderColor: string;  // Tailwind border class
  initial: string;      // 2-letter initials
}

export interface Task {
  id: string;
  phaseId: string;
  title: string;
  priority: Priority;
  assignedTo: string[];  // member ids (max 3)
  status: TaskStatus;
}

export interface Phase {
  id: string;
  index: number;
  name: string;
  shortName: string;
  dates: string;
  unlockDate: Date;
  color: string;         // accent color class
  bgLight: string;       // light bg
  borderAccent: string;  // border class
  textAccent: string;    // text class
  deliverable: string;
  tasks: Task[];
}

// ---- MEMBERS ----
export const MEMBERS: Member[] = [
  { id: 'awa',     name: 'Awa Gueye',                role: 'CEO',                color: 'bg-rose-500',    textColor: 'text-rose-700',    borderColor: 'border-rose-500',    initial: 'AG' },
  { id: 'abdou',   name: 'Abdou Ba',                 role: 'CTO',                color: 'bg-sky-500',     textColor: 'text-sky-700',     borderColor: 'border-sky-500',     initial: 'AB' },
  { id: 'cheikh',  name: 'Cheikh Omar Sakho',         role: 'COO',                color: 'bg-amber-500',   textColor: 'text-amber-700',   borderColor: 'border-amber-500',   initial: 'CS' },
  { id: 'fatim',   name: 'Fatimata Bah',              role: 'CFO',                color: 'bg-emerald-500', textColor: 'text-emerald-700', borderColor: 'border-emerald-500', initial: 'FB' },
  { id: 'marian',  name: 'Marian Daiferlé',           role: 'CMO',                color: 'bg-purple-500',  textColor: 'text-purple-700',  borderColor: 'border-purple-500',  initial: 'MD' },
  { id: 'justin',  name: 'Justin Bognon',             role: 'CPO',                color: 'bg-indigo-500',  textColor: 'text-indigo-700',  borderColor: 'border-indigo-500',  initial: 'JB' },
  { id: 'poko',    name: 'Poko Ibrahima Noba',        role: 'Head of Community',  color: 'bg-teal-500',    textColor: 'text-teal-700',    borderColor: 'border-teal-500',    initial: 'PN' },
  { id: 'mouha',   name: 'Mouhamadou Moustapha Sarr', role: 'Head of Data',       color: 'bg-orange-500',  textColor: 'text-orange-700',  borderColor: 'border-orange-500',  initial: 'MS' },
  { id: 'kassi',   name: 'Kassi Mamadou Maxwell',     role: 'Head of Partnerships',color:'bg-cyan-500',    textColor: 'text-cyan-700',    borderColor: 'border-cyan-500',    initial: 'KM' },
];

export function getMember(id: string): Member | undefined {
  return MEMBERS.find(m => m.id === id);
}

// ---- PHASES ----
const PHASE_RAW: Omit<Phase, 'unlockDate'>[] = [
  {
    id: 'ph0', index: 0,
    name: 'Audit & Recadrage',
    shortName: 'Ph.0',
    dates: '18–20 Mai',
    color: 'violet',
    bgLight: 'bg-violet-50',
    borderAccent: 'border-violet-400',
    textAccent: 'text-violet-700',
    deliverable: 'Rapport audit + plan 20 actions',
    tasks: [
      { id: 'ph0-t1', phaseId: 'ph0', title: 'Audit architecture technique', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph0-t2', phaseId: 'ph0', title: 'Audit qualité des données', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph0-t3', phaseId: 'ph0', title: 'Audit applicatif web React.js', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph0-t4', phaseId: 'ph0', title: 'Revue des scrapers 7+ sources', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph0-t5', phaseId: 'ph0', title: 'Revue partenariats agences', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph0-t6', phaseId: 'ph0', title: "Plan d'action priorisé 20 actions", priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph0-t7', phaseId: 'ph0', title: 'Revue conformité & légal RGPD', priority: 'Moyenne', assignedTo: [], status: 'À faire' },
    ],
  },
  {
    id: 'ph1', index: 1,
    name: 'Données & Collecte',
    shortName: 'Ph.1',
    dates: '21–24 Mai',
    color: 'blue',
    bgLight: 'bg-blue-50',
    borderAccent: 'border-blue-400',
    textAccent: 'text-blue-700',
    deliverable: '10 000+ annonces Bronze',
    tasks: [
      { id: 'ph1-t1', phaseId: 'ph1', title: 'Hardening scrapers Scrapy', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph1-t2', phaseId: 'ph1', title: 'Mise à jour sélecteurs CSS/XPath anti-bot', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph1-t3', phaseId: 'ph1', title: 'Intégration nouvelles sources Jumia/Realestate.sn', priority: 'Moyenne', assignedTo: [], status: 'À faire' },
      { id: 'ph1-t4', phaseId: 'ph1', title: 'Enrichissement couche Bronze v2', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph1-t5', phaseId: 'ph1', title: 'Orchestration Airflow avec SLA et alertes', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph1-t6', phaseId: 'ph1', title: 'Intégration ANACIM + GTFS + Google Trends', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph1-t7', phaseId: 'ph1', title: 'Formulaire terrain v2 géolocalisé', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph1-t8', phaseId: 'ph1', title: 'Système score de confiance 0–100', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph1-t9', phaseId: 'ph1', title: 'Relance agences partenaires CSV/JSON', priority: 'Critique', assignedTo: [], status: 'À faire' },
    ],
  },
  {
    id: 'ph2', index: 2,
    name: 'ETL & Qualité',
    shortName: 'Ph.2',
    dates: '25–27 Mai',
    color: 'green',
    bgLight: 'bg-green-50',
    borderAccent: 'border-green-400',
    textAccent: 'text-green-700',
    deliverable: 'Silver 6 000+ annonces + rapport 15p.',
    tasks: [
      { id: 'ph2-t1', phaseId: 'ph2', title: 'Déduplication renforcée Levenshtein', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph2-t2', phaseId: 'ph2', title: 'Normalisation quartiers NLP spaCy', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph2-t3', phaseId: 'ph2', title: 'Intégration sources nouvelles dans ETL', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph2-t4', phaseId: 'ph2', title: 'Détection outliers IQR + Z-score', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph2-t5', phaseId: 'ph2', title: 'Géocodage de précision Nominatim', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph2-t6', phaseId: 'ph2', title: 'Validation croisée inter-sources v2', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph2-t7', phaseId: 'ph2', title: 'Pipeline Bronze→Silver dbt avec tests', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph2-t8', phaseId: 'ph2', title: 'Dashboard qualité Metabase v2', priority: 'Moyenne', assignedTo: [], status: 'À faire' },
    ],
  },
  {
    id: 'ph3', index: 3,
    name: 'Gold Layer & IA',
    shortName: 'Ph.3',
    dates: '28–31 Mai',
    color: 'amber',
    bgLight: 'bg-amber-50',
    borderAccent: 'border-amber-400',
    textAccent: 'text-amber-700',
    deliverable: 'Modèle ML + API estimateur + Gold 80+ quartiers',
    tasks: [
      { id: 'ph3-t1', phaseId: 'ph3', title: 'Prix médians renforcés IC95%', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph3-t2', phaseId: 'ph3', title: 'Tendances mensuelles glissantes', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph3-t3', phaseId: 'ph3', title: 'Score accessibilité transport GTFS', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph3-t4', phaseId: 'ph3', title: 'Score risque climatique ANACIM', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph3-t5', phaseId: 'ph3', title: 'Feature engineering IA enrichi', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph3-t6', phaseId: 'ph3', title: 'Entraînement modèles ML — OLS/RF/XGBoost', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph3-t7', phaseId: 'ph3', title: 'API estimateur FastAPI avec SHAP', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph3-t8', phaseId: 'ph3', title: 'Heatmaps Gold Layer GeoJSON', priority: 'Haute', assignedTo: [], status: 'À faire' },
    ],
  },
  {
    id: 'ph4', index: 4,
    name: 'App Web – Révision',
    shortName: 'Ph.4',
    dates: '1–5 Juin',
    color: 'pink',
    bgLight: 'bg-pink-50',
    borderAccent: 'border-pink-400',
    textAccent: 'text-pink-700',
    deliverable: 'App renforcée + sécurité + QA Cypress > 80%',
    tasks: [
      { id: 'ph4-t1', phaseId: 'ph4', title: 'Intégration estimateur IA dans app', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph4-t2', phaseId: 'ph4', title: 'Dashboard analytics avec heatmaps interactives', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph4-t3', phaseId: 'ph4', title: 'Renforcement sécurité JWT + WAF', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph4-t4', phaseId: 'ph4', title: 'Tests QA Cypress > 80% couverture', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph4-t5', phaseId: 'ph4', title: 'Optimisation performance Lighthouse > 80', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph4-t6', phaseId: 'ph4', title: 'Interface B2B agences validation', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph4-t7', phaseId: 'ph4', title: 'Alertes marché personnalisées', priority: 'Moyenne', assignedTo: [], status: 'À faire' },
    ],
  },
  {
    id: 'ph5', index: 5,
    name: 'Mobile & Lancement',
    shortName: 'Ph.5',
    dates: '6–7 Juin',
    color: 'red',
    bgLight: 'bg-red-50',
    borderAccent: 'border-red-400',
    textAccent: 'text-red-700',
    deliverable: 'Plan mobile + bilan + roadmap 6 mois',
    tasks: [
      { id: 'ph5-t1', phaseId: 'ph5', title: 'PWA mobile complète offline', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph5-t2', phaseId: 'ph5', title: 'Plan stratégie mobile M+3', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph5-t3', phaseId: 'ph5', title: 'Bilan complet 3 semaines KPIs', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph5-t4', phaseId: 'ph5', title: 'Roadmap 6 mois M+1→M+6', priority: 'Critique', assignedTo: [], status: 'À faire' },
      { id: 'ph5-t5', phaseId: 'ph5', title: 'Communication lancement presse/LinkedIn', priority: 'Haute', assignedTo: [], status: 'À faire' },
      { id: 'ph5-t6', phaseId: 'ph5', title: 'Plan acquisition utilisateurs SEO/diaspora', priority: 'Moyenne', assignedTo: [], status: 'À faire' },
    ],
  },
];

// Unlock dates (2026)
const UNLOCK_DATES: Record<string, Date> = {
  ph0: new Date(2026, 4, 18), // May 18
  ph1: new Date(2026, 4, 21), // May 21
  ph2: new Date(2026, 4, 25), // May 25
  ph3: new Date(2026, 4, 28), // May 28
  ph4: new Date(2026, 5, 1),  // Jun 1
  ph5: new Date(2026, 5, 6),  // Jun 6
};

export const PHASES: Phase[] = PHASE_RAW.map(p => ({
  ...p,
  unlockDate: UNLOCK_DATES[p.id],
}));

// ---- HELPERS ----

export function isPhaseUnlocked(phase: Phase, now: Date = new Date()): boolean {
  return now >= phase.unlockDate;
}

export function daysUntilUnlock(phase: Phase, now: Date = new Date()): number {
  const diff = phase.unlockDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getPhaseProgress(phase: Phase): number {
  if (phase.tasks.length === 0) return 0;
  const done = phase.tasks.filter(t => t.status === 'Terminé').length;
  return Math.round((done / phase.tasks.length) * 100);
}

export const PRIORITY_POINTS: Record<Priority, { done: number; inProgress: number }> = {
  Critique: { done: 30, inProgress: 15 },
  Haute:    { done: 20, inProgress: 10 },
  Moyenne:  { done: 10, inProgress: 5 },
};

export function computeMemberScore(memberId: string, phases: Phase[]): number {
  let score = 0;
  for (const phase of phases) {
    for (const task of phase.tasks) {
      if (task.assignedTo.includes(memberId)) {
        const pts = PRIORITY_POINTS[task.priority];
        if (task.status === 'Terminé') score += pts.done;
        else if (task.status === 'En cours') score += pts.inProgress;
      }
    }
  }
  return score;
}

export function getStatusNext(status: TaskStatus): TaskStatus {
  if (status === 'À faire') return 'En cours';
  if (status === 'En cours') return 'Terminé';
  return 'À faire';
}

// Phase color mapping for various uses
export const PHASE_COLORS: Record<string, { bg: string; border: string; text: string; ring: string; bgSolid: string }> = {
  ph0: { bg: 'bg-violet-50',  border: 'border-violet-400', text: 'text-violet-700', ring: 'ring-violet-400', bgSolid: 'bg-violet-500' },
  ph1: { bg: 'bg-blue-50',    border: 'border-blue-400',   text: 'text-blue-700',   ring: 'ring-blue-400',   bgSolid: 'bg-blue-500' },
  ph2: { bg: 'bg-green-50',   border: 'border-green-400',  text: 'text-green-700',  ring: 'ring-green-400',  bgSolid: 'bg-green-500' },
  ph3: { bg: 'bg-amber-50',   border: 'border-amber-400',  text: 'text-amber-700',  ring: 'ring-amber-400',  bgSolid: 'bg-amber-500' },
  ph4: { bg: 'bg-pink-50',    border: 'border-pink-400',   text: 'text-pink-700',   ring: 'ring-pink-400',   bgSolid: 'bg-pink-500' },
  ph5: { bg: 'bg-red-50',     border: 'border-red-400',    text: 'text-red-700',    ring: 'ring-red-400',    bgSolid: 'bg-red-500' },
};

export const PRIORITY_STYLES: Record<Priority, { bg: string; text: string; border: string }> = {
  Critique: { bg: 'bg-red-50',  text: 'text-red-700',  border: 'border-red-200' },
  Haute:    { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  Moyenne:  { bg: 'bg-sky-50',  text: 'text-sky-700',  border: 'border-sky-200' },
};

export const STATUS_STYLES: Record<TaskStatus, { bg: string; text: string; dot: string }> = {
  'À faire':   { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  'En cours':  { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Terminé':   { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
};

export type ViewType = 'my-tasks' | 'overview' | 'phases' | 'team';
