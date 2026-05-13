import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import type { Progress } from "@/lib/progress";

function progressKey(pin: string) {
  return `progress:${pin}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get("pin");

  if (!pin || pin.length < 4) {
    return NextResponse.json({ error: "PIN required (4+ digits)" }, { status: 400 });
  }

  const data = await redis.get<Progress>(progressKey(pin));

  if (!data) {
    return NextResponse.json({ exists: false, progress: null });
  }

  return NextResponse.json({ exists: true, progress: data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { pin, progress } = body as { pin: string; progress: Progress };

  if (!pin || pin.length < 4) {
    return NextResponse.json({ error: "PIN required (4+ digits)" }, { status: 400 });
  }

  if (!progress) {
    return NextResponse.json({ error: "Progress data required" }, { status: 400 });
  }

  await redis.set(progressKey(pin), progress);

  return NextResponse.json({ success: true });
}
