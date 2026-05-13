"use client";

import { useState } from "react";

interface AnswerFormProps {
  onSubmit: (input: string, processing: string, output: string) => void;
  isLoading: boolean;
}

export default function AnswerForm({ onSubmit, isLoading }: AnswerFormProps) {
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !processing.trim() || !output.trim()) return;
    onSubmit(input, processing, output);
  };

  const isValid = input.trim() && processing.trim() && output.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="input"
          className="block text-base font-semibold text-slate-700 mb-2"
        >
          📥 Input
          <span className="block text-sm font-normal text-slate-500">
            What does the function need to work? What&apos;s being passed in?
          </span>
        </label>
        <textarea
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full min-h-[100px] p-4 text-base border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-y transition-colors"
          placeholder="e.g. It takes in a list of numbers..."
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="processing"
          className="block text-base font-semibold text-slate-700 mb-2"
        >
          ⚙️ Processing
          <span className="block text-sm font-normal text-slate-500">
            What does it actually do, step by step?
          </span>
        </label>
        <textarea
          id="processing"
          value={processing}
          onChange={(e) => setProcessing(e.target.value)}
          className="w-full min-h-[140px] p-4 text-base border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-y transition-colors"
          placeholder="e.g. It loops through each item and checks if..."
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="output"
          className="block text-base font-semibold text-slate-700 mb-2"
        >
          📤 Output
          <span className="block text-sm font-normal text-slate-500">
            What&apos;s the end result? What gets printed or sent back?
          </span>
        </label>
        <textarea
          id="output"
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          className="w-full min-h-[100px] p-4 text-base border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-y transition-colors"
          placeholder="e.g. It prints out 42..."
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full py-4 px-6 text-lg font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        {isLoading ? "Checking..." : "Check My Answer ✓"}
      </button>
    </form>
  );
}
