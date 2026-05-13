import { describe, it, expect } from "vitest";
import { CATEGORIES, getCategoryLabel } from "@/lib/categories";

describe("CATEGORIES", () => {
  it("has exactly 10 categories", () => {
    expect(CATEGORIES).toHaveLength(10);
  });

  it("each category has id, label, and description", () => {
    CATEGORIES.forEach((cat) => {
      expect(cat.id).toBeTruthy();
      expect(cat.label).toBeTruthy();
      expect(cat.description).toBeTruthy();
    });
  });

  it("category IDs are kebab-case", () => {
    CATEGORIES.forEach((cat) => {
      expect(cat.id).toMatch(/^[a-z]+(-[a-z]+)*$/);
    });
  });

  it("has no duplicate IDs", () => {
    const ids = CATEGORIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getCategoryLabel", () => {
  it("returns label for known category", () => {
    expect(getCategoryLabel("for-loops")).toBe("For Loops");
    expect(getCategoryLabel("strings")).toBe("String Manipulation");
  });

  it("returns the id itself for unknown category", () => {
    expect(getCategoryLabel("unknown-thing")).toBe("unknown-thing");
  });
});
