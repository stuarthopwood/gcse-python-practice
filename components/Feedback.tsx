"use client";

import type { GradeResponse } from "@/lib/types";

interface FeedbackProps {
  feedback: GradeResponse;
  onNext: () => void;
}

export default function Feedback({ feedback, onNext }: FeedbackProps) {
  const percentage = (feedback.marks / feedback.maxMarks) * 100;

  const scoreColor =
    percentage >= 80
      ? "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-700"
      : percentage >= 60
        ? "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:border-amber-700"
        : "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-700";

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Score */}
      <div
        className={`text-center p-4 rounded-2xl border-2 ${scoreColor}`}
      >
        <div className="text-3xl font-bold">
          {feedback.marks} / {feedback.maxMarks}
        </div>
        <div className="text-sm font-medium mt-1">{feedback.feedback}</div>
      </div>

      {/* Strengths */}
      {feedback.strengths && (
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">✅ What you did well</h3>
          <p className="text-green-700 dark:text-green-400 text-sm leading-relaxed">
            {feedback.strengths}
          </p>
        </div>
      )}

      {/* Improvements */}
      {feedback.improvements && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">💡 To improve</h3>
          <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">
            {feedback.improvements}
          </p>
        </div>
      )}

      {/* Model Answer */}
      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
        <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-3">
          📝 Model Answer
        </h3>
        <div className="space-y-3 text-sm text-indigo-900 dark:text-indigo-200">
          <div>
            <span className="font-semibold">Input:</span>{" "}
            {feedback.modelAnswer.input}
          </div>
          <div>
            <span className="font-semibold">Processing:</span>{" "}
            {feedback.modelAnswer.processing}
          </div>
          <div>
            <span className="font-semibold">Output:</span>{" "}
            {feedback.modelAnswer.output}
          </div>
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        className="w-full py-4 px-6 text-lg font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm"
      >
        Next Question →
      </button>
    </div>
  );
}
