"use client";

import { useState } from "react";

interface PinEntryProps {
  onSubmit: (pin: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export default function PinEntry({ onSubmit, isLoading, error }: PinEntryProps) {
  const [pin, setPin] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) {
      onSubmit(pin);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">🐍 Python Practice</h1>
          <p className="text-slate-500">Enter your PIN to load your progress</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={(e) => setPin(e.target.value.slice(0, 8))}
              className="w-full text-center text-3xl font-mono tracking-[0.5em] p-4 border-2 border-slate-200 rounded-xl bg-white text-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-colors"
              placeholder="••••"
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-slate-400 mt-2 text-center">
              4+ digits. First time? Pick any PIN — it&apos;ll create your profile.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={pin.length < 4 || isLoading}
            className="w-full py-4 px-6 text-lg font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isLoading ? "Loading..." : "Start Practising →"}
          </button>
        </form>
      </div>
    </div>
  );
}
