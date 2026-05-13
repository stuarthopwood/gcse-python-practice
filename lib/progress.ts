export interface SessionRecord {
  date: string;
  marks: number;
  maxMarks: number;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
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
}

const STORAGE_KEY = "gcse-python-progress";

const XP_PER_MARK = 10;
const XP_PER_PERFECT = 50;
const XP_PER_LEVEL = 100;
const STREAK_BONUS_THRESHOLD = 3;

export function getProgress(): Progress {
  if (typeof window === "undefined") {
    return defaultProgress();
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return defaultProgress();
  return JSON.parse(stored);
}

export function recordAnswer(
  marks: number,
  maxMarks: number,
  topic: string,
  difficulty: "easy" | "medium" | "hard"
): Progress {
  const progress = getProgress();

  const record: SessionRecord = {
    date: new Date().toISOString(),
    marks,
    maxMarks,
    topic,
    difficulty,
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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

function defaultProgress(): Progress {
  return {
    totalQuestions: 0,
    totalMarks: 0,
    totalMaxMarks: 0,
    streak: 0,
    bestStreak: 0,
    level: 1,
    xp: 0,
    sessions: [],
  };
}
