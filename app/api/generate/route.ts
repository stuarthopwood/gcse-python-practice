import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GENERATE_SYSTEM_PROMPT } from "@/lib/prompts";
import type { GenerateRequest, Question } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const difficulty = body.difficulty || "medium";
    const recentTopics: string[] = body.recentTopics || [];

    const avoidance = recentTopics.length > 0
      ? `\n\nIMPORTANT: Avoid these topics as they were recently used: ${recentTopics.join(", ")}. Pick a DIFFERENT concept.`
      : "";

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: GENERATE_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate a ${difficulty} difficulty Python code analysis question.${avoidance}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response format" },
        { status: 500 }
      );
    }

    const text = content.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const question: Question = JSON.parse(text);

    return NextResponse.json(question);
  } catch (error) {
    console.error("Generate error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to generate question", details: message },
      { status: 500 }
    );
  }
}
