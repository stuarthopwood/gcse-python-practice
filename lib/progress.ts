export interface SessionRecord {
  date: string;
  marks: number;
  maxMarks: number;
  topic: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface CategoryScore {
  attempts: number;
  totalMarks: number;
  totalMaxMarks: number;
}

export interface Progress {
  totalQuestions: number;
  totalMarks: number;
  totalMaxMarks: number;
  streak: number;
  bestStreak: number;
  level: number;
  xp: number;
  sessions: SessionRecord[];
  categoryScores: Record<string, CategoryScore>;
}

const STORAGE_KEY = "gcse-python-progress";
const PIN_KEY = "gcse-python-pin";

const XP_PER_MARK = 10;
const XP_PER_PERFECT = 50;
const XP_PER_LEVEL = 100;
const STREAK_BONUS_THRESHOLD = 3;

export function getStoredPin(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PIN_KEY);
}

export function setStoredPin(pin: string): void {
  localStorage.setItem(PIN_KEY, pin);
}

export function getProgress(): Progress {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return defaultProgress();
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return defaultProgress();
  const parsed = JSON.parse(stored);
  if (!parsed.categoryScores) {
    parsed.categoryScores = {};
  }
  return parsed;
}

export function setProgress(progress: Progress): void {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}

export async function loadProgressFromServer(pin: string): Promise<Progress> {
  const res = await fetch(`/api/progress?pin=${encodeURIComponent(pin)}`);
  const data = await res.json();

  if (data.exists && data.progress) {
    if (!data.progress.categoryScores) {
      data.progress.categoryScores = {};
    }
    setProgress(data.progress);
    return data.progress;
  }

  return getProgress();
}

export async function saveProgressToServer(pin: string, progress: Progress): Promise<void> {
  await fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin, progress }),
  });
}

export function recordAnswer(
  currentProgress: Progress,
  marks: number,
  maxMarks: number,
  topic: string,
  category: string,
  difficulty: "easy" | "medium" | "hard"
): Progress {
  const progress = {
    ...currentProgress,
    sessions: [...currentProgress.sessions],
    categoryScores: { ...currentProgress.categoryScores },
  };

  const record: SessionRecord = {
    date: new Date().toISOString(),
    marks,
    maxMarks,
    topic,
    category,
    difficulty,
  };

  if (!progress.categoryScores[category]) {
    progress.categoryScores[category] = { attempts: 0, totalMarks: 0, totalMaxMarks: 0 };
  }
  progress.categoryScores[category] = {
    attempts: progress.categoryScores[category].attempts + 1,
    totalMarks: progress.categoryScores[category].totalMarks + marks,
    totalMaxMarks: progress.categoryScores[category].totalMaxMarks + maxMarks,
  };

  progress.sessions.push(record);
  progress.totalQuestions += 1;
  progress.totalMarks += marks;
  progress.totalMaxMarks += maxMarks;

  let xpGained = marks * XP_PER_MARK;

  if (marks === maxMarks) {
    xpGained += XP_PER_PERFECT;
    progress.streak += 1;
  } else if (marks >= 4) {
    progress.streak += 1;
  } else {
    progress.streak = 0;
  }

  if (progress.streak > progress.bestStreak) {
    progress.bestStreak = progress.streak;
  }

  if (progress.streak >= STREAK_BONUS_THRESHOLD) {
    xpGained += 15;
  }

  const difficultyMultiplier =
    difficulty === "hard" ? 1.5 : difficulty === "medium" ? 1.2 : 1;
  xpGained = Math.round(xpGained * difficultyMultiplier);

  progress.xp += xpGained;
  progress.level = Math.floor(progress.xp / XP_PER_LEVEL) + 1;

  setProgress(progress);
  return progress;
}

export function getAverageScore(progress: Progress): number {
  if (progress.totalMaxMarks === 0) return 0;
  return Math.round((progress.totalMarks / progress.totalMaxMarks) * 100);
}

export function getTitle(level: number): string {
  if (level >= 20) return "Python Master";
  if (level >= 15) return "Code Wizard";
  if (level >= 10) return "Bug Slayer";
  if (level >= 7) return "Loop Legend";
  if (level >= 5) return "Syntax Warrior";
  if (level >= 3) return "Code Explorer";
  return "Beginner Coder";
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getWeakCategories(progress: Progress): string[] {
  const scores = Object.entries(progress.categoryScores)
    .filter(([, s]) => s.attempts >= 2)
    .map(([id, s]) => ({ id, pct: Math.round((s.totalMarks / s.totalMaxMarks) * 100) }))
    .sort((a, b) => a.pct - b.pct);

  return scores.filter((s) => s.pct < 70).map((s) => s.id);
}

export function defaultProgress(): Progress {
  return {
    totalQuestions: 0,
    totalMarks: 0,
    totalMaxMarks: 0,
    streak: 0,
    bestStreak: 0,
    level: 1,
    xp: 0,
    sessions: [],
    categoryScores: {},
  };
}
