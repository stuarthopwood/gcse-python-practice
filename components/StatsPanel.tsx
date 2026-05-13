"use client";

import type { Progress } from "@/lib/progress";
import { getAverageScore, getTitle } from "@/lib/progress";

interface StatsPanelProps {
  progress: Progress;
  xpGained?: number;
}

export default function StatsPanel({ progress, xpGained }: StatsPanelProps) {
  const average = getAverageScore(progress);
  const title = getTitle(progress.level);
  const xpToNext = 100 - (progress.xp % 100);
  const xpProgress = ((progress.xp % 100) / 100) * 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
      {/* Level & Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Level {progress.level}
          </span>
          <h3 className="text-base font-bold text-indigo-700">{title}</h3>
        </div>
        {progress.streak >= 2 && (
          <div className="text-right">
            <span className="text-2xl">🔥</span>
            <span className="block text-xs font-semibold text-orange-600">
              {progress.streak} streak
            </span>
          </div>
        )}
      </div>

      {/* XP Bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{progress.xp} XP</span>
          <span>{xpToNext} to next level</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        {xpGained && xpGained > 0 && (
          <p className="text-xs text-green-600 font-medium mt-1 animate-pulse">
            +{xpGained} XP!
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
        <div className="text-center">
          <div className="text-lg font-bold text-slate-800">
            {progress.totalQuestions}
          </div>
          <div className="text-xs text-slate-500">Questions</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-slate-800">{average}%</div>
          <div className="text-xs text-slate-500">Average</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-slate-800">
            {progress.bestStreak}
          </div>
          <div className="text-xs text-slate-500">Best Streak</div>
        </div>
      </div>
    </div>
  );
}
