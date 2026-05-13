import { describe, it, expect, beforeEach } from "vitest";
import {
  defaultProgress,
  recordAnswer,
  getAverageScore,
  getTitle,
  getWeakCategories,
} from "@/lib/progress";
import type { Progress } from "@/lib/progress";

describe("defaultProgress", () => {
  it("returns zeroed progress with empty category scores", () => {
    const p = defaultProgress();
    expect(p.totalQuestions).toBe(0);
    expect(p.totalMarks).toBe(0);
    expect(p.level).toBe(1);
    expect(p.xp).toBe(0);
    expect(p.sessions).toEqual([]);
    expect(p.categoryScores).toEqual({});
  });
});

describe("recordAnswer", () => {
  let progress: Progress;

  beforeEach(() => {
    progress = defaultProgress();
  });

  it("increments total questions", () => {
    const updated = recordAnswer(progress, 3, 5, "counting vowels", "strings", "easy");
    expect(updated.totalQuestions).toBe(1);
  });

  it("accumulates marks", () => {
    let p = recordAnswer(progress, 3, 5, "topic1", "for-loops", "easy");
    p = recordAnswer(p, 4, 5, "topic2", "strings", "medium");
    expect(p.totalMarks).toBe(7);
    expect(p.totalMaxMarks).toBe(10);
  });

  it("tracks category scores", () => {
    const updated = recordAnswer(progress, 4, 5, "counting", "for-loops", "easy");
    expect(updated.categoryScores["for-loops"]).toEqual({
      attempts: 1,
      totalMarks: 4,
      totalMaxMarks: 5,
    });
  });

  it("accumulates category scores across attempts", () => {
    let p = recordAnswer(progress, 3, 5, "topic1", "for-loops", "easy");
    p = recordAnswer(p, 5, 5, "topic2", "for-loops", "medium");
    expect(p.categoryScores["for-loops"].attempts).toBe(2);
    expect(p.categoryScores["for-loops"].totalMarks).toBe(8);
  });

  it("awards XP based on marks", () => {
    const updated = recordAnswer(progress, 3, 5, "topic", "lists", "easy");
    expect(updated.xp).toBe(30); // 3 marks * 10 XP
  });

  it("awards bonus XP for perfect score", () => {
    const updated = recordAnswer(progress, 5, 5, "topic", "lists", "easy");
    expect(updated.xp).toBe(100); // (5*10 + 50 perfect) * 1.0 difficulty
  });

  it("applies difficulty multiplier", () => {
    const easy = recordAnswer(progress, 3, 5, "topic", "lists", "easy");
    const hard = recordAnswer(progress, 3, 5, "topic", "lists", "hard");
    expect(hard.xp).toBeGreaterThan(easy.xp);
  });

  it("increments streak on high score", () => {
    let p = recordAnswer(progress, 5, 5, "t1", "lists", "easy");
    p = recordAnswer(p, 4, 5, "t2", "strings", "easy");
    expect(p.streak).toBe(2);
  });

  it("resets streak on low score", () => {
    let p = recordAnswer(progress, 5, 5, "t1", "lists", "easy");
    p = recordAnswer(p, 2, 5, "t2", "strings", "easy");
    expect(p.streak).toBe(0);
  });

  it("tracks best streak", () => {
    let p = recordAnswer(progress, 5, 5, "t1", "lists", "easy");
    p = recordAnswer(p, 5, 5, "t2", "strings", "easy");
    p = recordAnswer(p, 2, 5, "t3", "for-loops", "easy");
    p = recordAnswer(p, 5, 5, "t4", "lists", "easy");
    expect(p.bestStreak).toBe(2);
    expect(p.streak).toBe(1);
  });

  it("calculates level from XP", () => {
    let p = progress;
    for (let i = 0; i < 5; i++) {
      p = recordAnswer(p, 5, 5, `t${i}`, "lists", "easy");
    }
    expect(p.level).toBeGreaterThan(1);
  });

  it("stores session record with category", () => {
    const updated = recordAnswer(progress, 3, 5, "my topic", "dictionaries", "medium");
    expect(updated.sessions[0].category).toBe("dictionaries");
    expect(updated.sessions[0].topic).toBe("my topic");
  });
});

describe("getAverageScore", () => {
  it("returns 0 for no attempts", () => {
    expect(getAverageScore(defaultProgress())).toBe(0);
  });

  it("calculates percentage correctly", () => {
    const p = { ...defaultProgress(), totalMarks: 8, totalMaxMarks: 10 };
    expect(getAverageScore(p)).toBe(80);
  });
});

describe("getTitle", () => {
  it("returns Beginner Coder for level 1", () => {
    expect(getTitle(1)).toBe("Beginner Coder");
  });

  it("returns Code Explorer for level 3", () => {
    expect(getTitle(3)).toBe("Code Explorer");
  });

  it("returns Python Master for level 20+", () => {
    expect(getTitle(20)).toBe("Python Master");
    expect(getTitle(25)).toBe("Python Master");
  });
});

describe("getWeakCategories", () => {
  it("returns empty array when no categories attempted", () => {
    expect(getWeakCategories(defaultProgress())).toEqual([]);
  });

  it("ignores categories with fewer than 2 attempts", () => {
    const p = {
      ...defaultProgress(),
      categoryScores: {
        "for-loops": { attempts: 1, totalMarks: 1, totalMaxMarks: 5 },
      },
    };
    expect(getWeakCategories(p)).toEqual([]);
  });

  it("identifies categories below 70%", () => {
    const p = {
      ...defaultProgress(),
      categoryScores: {
        "for-loops": { attempts: 3, totalMarks: 12, totalMaxMarks: 15 }, // 80%
        "strings": { attempts: 3, totalMarks: 6, totalMaxMarks: 15 }, // 40%
        "lists": { attempts: 2, totalMarks: 5, totalMaxMarks: 10 }, // 50%
      },
    };
    const weak = getWeakCategories(p);
    expect(weak).toContain("strings");
    expect(weak).toContain("lists");
    expect(weak).not.toContain("for-loops");
  });

  it("sorts weakest first", () => {
    const p = {
      ...defaultProgress(),
      categoryScores: {
        "strings": { attempts: 2, totalMarks: 6, totalMaxMarks: 10 }, // 60%
        "lists": { attempts: 2, totalMarks: 4, totalMaxMarks: 10 }, // 40%
      },
    };
    const weak = getWeakCategories(p);
    expect(weak[0]).toBe("lists");
    expect(weak[1]).toBe("strings");
  });
});
