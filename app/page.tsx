"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import CodeBlock from "@/components/CodeBlock";
import AnswerForm from "@/components/AnswerForm";
import Feedback from "@/components/Feedback";
import StatsPanel from "@/components/StatsPanel";
import LoadingSpinner from "@/components/LoadingSpinner";
import PinEntry from "@/components/PinEntry";
import {
  getStoredPin,
  setStoredPin,
  getProgress,
  defaultProgress,
  loadProgressFromServer,
  saveProgressToServer,
  recordAnswer,
} from "@/lib/progress";
import type { Question, GradeResponse } from "@/lib/types";
import type { Progress } from "@/lib/progress";

type AppState = "pin" | "loading" | "answering" | "grading" | "feedback";
type Difficulty = "easy" | "medium" | "hard";

export default function Home() {
  const [state, setState] = useState<AppState>("pin");
  const [pin, setPin] = useState<string | null>(null);
  const [pinLoading, setPinLoading] = useState(true);
  const [pinError, setPinError] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<GradeResponse | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress>(defaultProgress());
  const [lastXpGain, setLastXpGain] = useState<number>(0);
  const recentTopics = useRef<string[]>([]);
  const hasInitialised = useRef(false);

  useEffect(() => {
    const stored = getStoredPin();
    if (stored) {
      handlePinSubmit(stored);
    } else {
      setPinLoading(false);
    }
  }, []);

  const handlePinSubmit = async (enteredPin: string) => {
    setPinLoading(true);
    setPinError(null);

    try {
      const loaded = await loadProgressFromServer(enteredPin);
      setPin(enteredPin);
      setStoredPin(enteredPin);
      setProgress(loaded);
      setState("loading");
    } catch {
      const local = getProgress();
      setPin(enteredPin);
      setStoredPin(enteredPin);
      setProgress(local);
      setState("loading");
    } finally {
      setPinLoading(false);
    }
  };

  const generateQuestion = useCallback(async (diff?: Difficulty) => {
    const targetDifficulty = diff || difficulty;
    setState("loading");
    setError(null);
    setFeedback(null);
    setLastXpGain(0);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          difficulty: targetDifficulty,
          recentTopics: recentTopics.current,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate question");

      const data: Question = await res.json();
      setQuestion(data);

      recentTopics.current = [...recentTopics.current, data.topic].slice(-5);

      setState("answering");
    } catch {
      setError(
        "Couldn't generate a question. Check your internet connection and try again."
      );
      setState("answering");
    }
  }, [difficulty]);

  useEffect(() => {
    if (state === "loading" && pin && !hasInitialised.current) {
      hasInitialised.current = true;
      generateQuestion();
    }
  }, [state, pin, generateQuestion]);

  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d);
    setQuestionNumber((n) => n + 1);
    generateQuestion(d);
  };

  const handleSubmit = async (
    input: string,
    processing: string,
    output: string
  ) => {
    if (!question || !pin) return;

    setState("grading");
    setError(null);

    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: question.code,
          input,
          processing,
          output,
        }),
      });

      if (!res.ok) throw new Error("Failed to grade answer");

      const data: GradeResponse = await res.json();
      setFeedback(data);

      const prevXp = progress.xp;
      const updated = recordAnswer(
        progress,
        data.marks,
        data.maxMarks,
        question.topic,
        question.difficulty
      );
      setProgress(updated);
      setLastXpGain(updated.xp - prevXp);

      saveProgressToServer(pin, updated).catch(() => {});

      setState("feedback");
    } catch {
      setError("Couldn't grade your answer. Try submitting again.");
      setState("answering");
    }
  };

  const handleNext = () => {
    setQuestionNumber((n) => n + 1);
    generateQuestion();
  };

  const handleLogout = () => {
    setPin(null);
    setState("pin");
    setPinLoading(false);
    localStorage.removeItem("gcse-python-pin");
  };

  if (state === "pin") {
    if (pinLoading) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <LoadingSpinner message="Loading your progress..." />
        </div>
      );
    }
    return (
      <PinEntry
        onSubmit={handlePinSubmit}
        isLoading={pinLoading}
        error={pinError}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              🐍 Python Practice
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Question {questionNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => handleDifficultyChange(d)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    difficulty === d
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Switch user"
            >
              🔒
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Stats Panel */}
        {progress.totalQuestions > 0 && (
          <div className="mb-6">
            <StatsPanel progress={progress} xpGained={lastXpGain} />
          </div>
        )}

        {state === "loading" && (
          <LoadingSpinner message="Generating a question..." />
        )}

        {state !== "loading" && question && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Code */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <CodeBlock
                code={question.code}
                topic={question.topic}
                difficulty={question.difficulty}
              />
            </div>

            {/* Right: Answer or Feedback */}
            <div>
              {state === "answering" && (
                <AnswerForm onSubmit={handleSubmit} isLoading={false} />
              )}

              {state === "grading" && (
                <LoadingSpinner message="Checking your answer..." />
              )}

              {state === "feedback" && feedback && (
                <Feedback feedback={feedback} onNext={handleNext} />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
