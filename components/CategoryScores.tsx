"use client";

import { CATEGORIES } from "@/lib/categories";
import type { CategoryScore } from "@/lib/progress";

interface CategoryScoresProps {
  scores: Record<string, CategoryScore>;
  focusCategory: string | null;
  onFocusChange: (category: string | null) => void;
}

export default function CategoryScores({
  scores = {},
  focusCategory,
  onFocusChange,
}: CategoryScoresProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          📊 Category Scores
        </h3>
        {focusCategory && (
          <button
            onClick={() => onFocusChange(null)}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            Clear focus
          </button>
        )}
      </div>
      <div className="space-y-2">
        {CATEGORIES.map((cat) => {
          const score = scores[cat.id];
          const pct = score
            ? Math.round((score.totalMarks / score.totalMaxMarks) * 100)
            : null;
          const isFocused = focusCategory === cat.id;
          const isWeak = pct !== null && pct < 70;

          return (
            <button
              key={cat.id}
              onClick={() => onFocusChange(isFocused ? null : cat.id)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                isFocused
                  ? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700"
                  : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                    {cat.label}
                  </span>
                  {isWeak && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium">
                      Needs work
                    </span>
                  )}
                  {isFocused && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium">
                      Focused
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {score ? (
                  <>
                    <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pct! >= 80
                            ? "bg-green-500"
                            : pct! >= 60
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                      {pct}%
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
