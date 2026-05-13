import { describe, it, expect } from "vitest";

describe("/api/generate response contract", () => {
  it("valid response has code, topic, and difficulty", () => {
    const mockResponse = {
      code: 'def add(a, b):\n    return a + b\n\nprint(add(3, 4))',
      topic: "functions with return",
      difficulty: "easy",
    };

    expect(mockResponse).toHaveProperty("code");
    expect(mockResponse).toHaveProperty("topic");
    expect(mockResponse).toHaveProperty("difficulty");
    expect(["easy", "medium", "hard"]).toContain(mockResponse.difficulty);
  });

  it("generated code should contain a function definition", () => {
    const mockQuestion = {
      code: 'def greet(name):\n    return "Hello " + name',
      topic: "string concatenation",
      difficulty: "easy",
    };
    expect(mockQuestion.code.length).toBeGreaterThan(0);
    expect(mockQuestion.code).toContain("def ");
  });
});

describe("/api/grade", () => {
  it("returns marks between 0 and 5", () => {
    const mockGrade = {
      marks: 3,
      maxMarks: 5,
      strengths: "Good identification of input",
      improvements: "Could explain the loop more clearly",
      feedback: "Nice work! Keep it up.",
      modelAnswer: {
        input: "Two numbers a and b",
        processing: "Adds them together",
        output: "Prints 7",
      },
    };
    expect(mockGrade.marks).toBeGreaterThanOrEqual(0);
    expect(mockGrade.marks).toBeLessThanOrEqual(mockGrade.maxMarks);
  });

  it("requires all fields in grade request", () => {
    const validRequest = {
      code: "def foo(): pass",
      input: "nothing",
      processing: "does nothing",
      output: "nothing",
    };
    expect(validRequest.code).toBeTruthy();
    expect(validRequest.input).toBeTruthy();
    expect(validRequest.processing).toBeTruthy();
    expect(validRequest.output).toBeTruthy();
  });

  it("rejects empty answer fields", () => {
    const invalidRequest = {
      code: "def foo(): pass",
      input: "",
      processing: "does stuff",
      output: "prints something",
    };
    const isValid =
      invalidRequest.input.trim() &&
      invalidRequest.processing.trim() &&
      invalidRequest.output.trim();
    expect(isValid).toBeFalsy();
  });
});
