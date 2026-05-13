"use client";

import { useState, useEffect, useCallback } from "react";
import CodeBlock from "@/components/CodeBlock";
import AnswerForm from "@/components/AnswerForm";
import Feedback from "@/components/Feedback";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { Question, GradeResponse } from "@/lib/types";

type AppState = "loading" | "answering" | "grading" | "feedback";
type Difficulty = "easy" | "medium" | "hard";

export default function Home() {
  const [state, setState] = useState<AppState>("loading");
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<GradeResponse | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [error, setError] = useState<string | null>(null);

  const generateQuestion = useCallback(async () => {
    setState("loading");
    setError(null);
    setFeedback(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty }),
      });

      if (!res.ok) throw new Error("Failed to generate question");

      const data: Question = await res.json();
      setQuestion(data);
      setState("answering");
    } catch {
      setError(
        "Couldn't generate a question. Check your internet connection and try again."
      );
      setState("answering");
    }
  }, [difficulty]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleSubmit = async (
    input: string,
    processing: string,
    output: string
  ) => {
    if (!question) return;

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

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              🐍 Python Practice
            </h1>
            <p className="text-xs text-slate-500">Question {questionNumber}</p>
          </div>
          <div className="flex gap-1">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  difficulty === d
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
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
