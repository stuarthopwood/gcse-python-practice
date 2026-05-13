import { describe, it, expect } from "vitest";
import { GENERATE_SYSTEM_PROMPT, GRADE_SYSTEM_PROMPT } from "@/lib/prompts";

describe("GENERATE_SYSTEM_PROMPT", () => {
  it("mentions GCSE-level concepts", () => {
    expect(GENERATE_SYSTEM_PROMPT).toContain("For loops");
    expect(GENERATE_SYSTEM_PROMPT).toContain("While loops");
    expect(GENERATE_SYSTEM_PROMPT).toContain("String manipulation");
    expect(GENERATE_SYSTEM_PROMPT).toContain("Lists");
    expect(GENERATE_SYSTEM_PROMPT).toContain("Dictionaries");
  });

  it("specifies JSON response format", () => {
    expect(GENERATE_SYSTEM_PROMPT).toContain('"code"');
    expect(GENERATE_SYSTEM_PROMPT).toContain('"topic"');
    expect(GENERATE_SYSTEM_PROMPT).toContain('"difficulty"');
  });

  it("constrains code length", () => {
    expect(GENERATE_SYSTEM_PROMPT).toContain("3-15 lines");
  });

  it("defines difficulty levels", () => {
    expect(GENERATE_SYSTEM_PROMPT).toContain("Easy =");
    expect(GENERATE_SYSTEM_PROMPT).toContain("Medium =");
    expect(GENERATE_SYSTEM_PROMPT).toContain("Hard =");
  });
});

describe("GRADE_SYSTEM_PROMPT", () => {
  it("grades out of 5 marks", () => {
    expect(GRADE_SYSTEM_PROMPT).toContain("out of 5 marks");
  });

  it("specifies mark allocation", () => {
    expect(GRADE_SYSTEM_PROMPT).toContain("1 mark for correctly identifying the input");
    expect(GRADE_SYSTEM_PROMPT).toContain("2 marks for explaining the processing");
    expect(GRADE_SYSTEM_PROMPT).toContain("1 mark for correctly stating the output");
  });

  it("requires encouraging tone", () => {
    expect(GRADE_SYSTEM_PROMPT).toContain("encouraging");
    expect(GRADE_SYSTEM_PROMPT).toContain("16-year-old");
  });

  it("specifies JSON response format", () => {
    expect(GRADE_SYSTEM_PROMPT).toContain('"marks"');
    expect(GRADE_SYSTEM_PROMPT).toContain('"strengths"');
    expect(GRADE_SYSTEM_PROMPT).toContain('"improvements"');
    expect(GRADE_SYSTEM_PROMPT).toContain('"modelAnswer"');
  });
});
