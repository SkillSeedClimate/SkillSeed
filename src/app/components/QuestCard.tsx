import { CheckCircle2, Clock, FileWarning, Hourglass, ListChecks, Star } from 'lucide-react';
import type { Quest, QuestProgress, QuestProgressStatus } from '../types/database';

interface QuestCardProps {
  quest: Quest;
  progress?: QuestProgress | null;
  onStart: (quest: Quest) => void;
}

export function QuestCard({ quest, progress, onStart }: QuestCardProps) {
  const status: QuestProgressStatus | 'not_started' = progress?.status ?? 'not_started';
  const totalSteps = quest.steps?.length ?? 0;
  const currentStep = progress?.current_step ?? 0;
  const progressRatio = totalSteps > 0 ? Math.min(1, Math.max(0, currentStep / totalSteps)) : 0;

  const statusLabel: Record<typeof status, string> = {
    not_started: 'Not started',
    in_progress: 'In progress',
    submitted: 'Pending review',
    verified: 'Completed',
    rejected: 'Needs resubmission',
  };

  const statusTone: Record<typeof status, string> = {
    not_started: 'bg-muted text-muted-foreground',
    in_progress: 'bg-[#E6F4EE] dark:bg-[#1E3B34] text-[#0F3D2E] dark:text-[#6DD4A8]',
    submitted: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    verified: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    rejected: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  };

  return (
    <div className="bg-white dark:bg-[#132B23] border border-border dark:border-[#1E3B34] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ease-out motion-reduce:transition-none hover:-translate-y-0.5 flex flex-col h-full">
      {/* Icon + tier badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{quest.badge_icon}</span>
        <span
          className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${
            quest.tier === 'beginner'
              ? 'bg-[#E6F4EE] dark:bg-[#1E3B34] text-[#0F3D2E] dark:text-[#6DD4A8]'
              : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
          }`}
        >
          {quest.tier === 'beginner' ? 'Beginner' : 'Advanced'}
        </span>
      </div>

      {/* Title + description */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-card-foreground mb-1.5 line-clamp-1">{quest.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{quest.description}</p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-lg whitespace-nowrap font-medium shrink-0 ${statusTone[status]}`}>
          {statusLabel[status]}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4 mb-4 flex-wrap">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          ~{quest.estimated_days} days
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-500" />
          +{quest.points_reward.toLocaleString()} pts
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ListChecks className="w-4 h-4" />
          {totalSteps} steps
        </span>
      </div>

      {/* Reward label */}
      <div className="bg-muted dark:bg-[#0D1F18] rounded-lg px-3 py-2.5 mb-4 text-sm text-card-foreground">
        {quest.tier === 'beginner' ? (
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2F8F6B] dark:text-[#6DD4A8]" />
            Badge: {quest.badge_name}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Hourglass className="w-4 h-4 text-amber-500" />
            Certificate: {quest.certificate_name}
          </span>
        )}
      </div>

      {/* Progress (only when started) */}
      {status !== 'not_started' && totalSteps > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Step {Math.min(totalSteps, currentStep + 1)} of {totalSteps}</span>
            <span className="font-medium">{Math.round(progressRatio * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted dark:bg-[#0D1F18] overflow-hidden">
            <div
              className="h-full bg-[#2F8F6B] dark:bg-[#6DD4A8] transition-[width] duration-500 ease-out motion-reduce:transition-none rounded-full"
              style={{ width: `${Math.round(progressRatio * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTA button — state aware */}
      {status === 'not_started' && (
        <button
          onClick={() => onStart(quest)}
          className="w-full min-h-[44px] bg-[linear-gradient(135deg,#0F3D2E_0%,#2F8F6B_100%)] text-white text-sm font-semibold py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 motion-reduce:transition-none active:scale-[0.98]"
        >
          Start quest
        </button>
      )}
      {status === 'in_progress' && (
        <button
          onClick={() => onStart(quest)}
          className="w-full min-h-[44px] border-2 border-[#0F3D2E] dark:border-[#6DD4A8] text-[#0F3D2E] dark:text-[#6DD4A8] text-sm font-semibold py-2.5 rounded-xl hover:bg-[#E6F4EE] dark:hover:bg-[#1E3B34] transition-all duration-200 motion-reduce:transition-none active:scale-[0.98]"
        >
          Continue
        </button>
      )}
      {status === 'submitted' && (
        <div className="w-full min-h-[44px] bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm font-medium py-2.5 rounded-xl text-center flex items-center justify-center">
          Pending review
        </div>
      )}
      {status === 'verified' && (
        <div className="w-full min-h-[44px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm font-semibold py-2.5 rounded-xl text-center flex items-center justify-center">
          Completed
        </div>
      )}
      {status === 'rejected' && (
        <button
          onClick={() => onStart(quest)}
          className="w-full min-h-[44px] bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-sm font-semibold py-2.5 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all duration-200 motion-reduce:transition-none active:scale-[0.98] inline-flex items-center justify-center gap-2"
        >
          <FileWarning className="w-4 h-4" />
          Resubmit
        </button>
      )}
    </div>
  );
}

export default QuestCard;
