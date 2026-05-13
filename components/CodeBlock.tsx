"use client";

interface CodeBlockProps {
  code: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
  medium: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
  hard: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
};

export default function CodeBlock({ code, topic, difficulty }: CodeBlockProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{topic}</span>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${difficultyColors[difficulty]}`}
        >
          {difficulty}
        </span>
      </div>
      <pre className="p-4 sm:p-6 overflow-x-auto bg-white dark:bg-slate-900">
        <code className="text-sm sm:text-base leading-relaxed font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
          {code}
        </code>
      </pre>
    </div>
  );
}
