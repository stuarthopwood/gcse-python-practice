import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GENERATE_SYSTEM_PROMPT } from "@/lib/prompts";
import type { Question } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const difficulty = body.difficulty || "easy";
    const recentTopics: string[] = body.recentTopics || [];
    const recentCategories: string[] = body.recentCategories || [];
    const weakCategories: string[] = body.weakCategories || [];
    const focusCategory: string | undefined = body.focusCategory;

    let userPrompt = `Generate a ${difficulty} difficulty Python code analysis question.`;

    if (focusCategory) {
      userPrompt += `\n\nThe student wants to practice the "${focusCategory}" category specifically. Generate a question in that category.`;
    } else if (weakCategories.length > 0 && Math.random() < 0.6) {
      const weak = weakCategories[Math.floor(Math.random() * weakCategories.length)];
      userPrompt += `\n\nThe student is weak in "${weak}". Generate a question in that category to help them improve.`;
    }

    if (recentTopics.length > 0) {
      userPrompt += `\n\nAVOID these recent topics (generate something completely different): ${recentTopics.join(", ")}`;
    }

    if (recentCategories.length > 0 && !focusCategory) {
      userPrompt += `\nAVOID these categories that were used in the last few questions: ${recentCategories.join(", ")}. Pick a DIFFERENT category.`;
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: GENERATE_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt,
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
