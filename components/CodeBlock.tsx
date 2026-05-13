"use client";

interface CodeBlockProps {
  code: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800 border-green-300",
  medium: "bg-amber-100 text-amber-800 border-amber-300",
  hard: "bg-red-100 text-red-800 border-red-300",
};

export default function CodeBlock({ code, topic, difficulty }: CodeBlockProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <span className="text-sm font-medium text-slate-600">{topic}</span>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${difficultyColors[difficulty]}`}
        >
          {difficulty}
        </span>
      </div>
      <pre className="p-4 sm:p-6 overflow-x-auto">
        <code className="text-sm sm:text-base leading-relaxed font-mono text-slate-800 whitespace-pre-wrap">
          {code}
        </code>
      </pre>
    </div>
  );
}
