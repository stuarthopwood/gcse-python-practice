import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GRADE_SYSTEM_PROMPT } from "@/lib/prompts";
import type { GradeRequest, GradeResponse } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const body: GradeRequest = await request.json();
    const { code, input, processing, output } = body;

    if (!code || !input || !processing || !output) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const userMessage = `Here is the Python code the student was shown:

\`\`\`python
${code}
\`\`\`

Here is the student's answer:

**Input:** ${input}

**Processing:** ${processing}

**Output:** ${output}

Please grade this answer.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 1024,
      system: GRADE_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userMessage,
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

    const gradeResponse: GradeResponse = JSON.parse(content.text);

    return NextResponse.json(gradeResponse);
  } catch (error) {
    console.error("Grade error:", error);
    return NextResponse.json(
      { error: "Failed to grade answer" },
      { status: 500 }
    );
  }
}
