import { describe, it, expect } from "vitest";
import type { Question, GradeResponse, GradeRequest } from "@/lib/types";

describe("Type contracts", () => {
  it("Question type has required fields including category", () => {
    const question: Question = {
      code: "def foo(): return 1",
      topic: "functions",
      category: "functions",
      difficulty: "easy",
    };
    expect(question.code).toBeDefined();
    expect(question.topic).toBeDefined();
    expect(question.category).toBeDefined();
    expect(question.difficulty).toBe("easy");
  });

  it("GradeResponse type has required fields", () => {
    const response: GradeResponse = {
      marks: 4,
      maxMarks: 5,
      feedback: "Good job!",
      strengths: "Correct input identified",
      improvements: "Add more detail to processing",
      modelAnswer: {
        input: "A number",
        processing: "Doubles it",
        output: "Prints the doubled number",
      },
    };
    expect(response.marks).toBeLessThanOrEqual(response.maxMarks);
    expect(response.modelAnswer.input).toBeDefined();
    expect(response.modelAnswer.processing).toBeDefined();
    expect(response.modelAnswer.output).toBeDefined();
  });

  it("GradeRequest requires all answer fields", () => {
    const request: GradeRequest = {
      code: "def foo(): return 1",
      input: "Nothing",
      processing: "Returns 1",
      output: "1",
    };
    expect(request.code).toBeTruthy();
    expect(request.input).toBeTruthy();
    expect(request.processing).toBeTruthy();
    expect(request.output).toBeTruthy();
  });

  it("difficulty must be easy, medium, or hard", () => {
    const validDifficulties: Question["difficulty"][] = ["easy", "medium", "hard"];
    validDifficulties.forEach((d) => {
      expect(["easy", "medium", "hard"]).toContain(d);
    });
  });
});
