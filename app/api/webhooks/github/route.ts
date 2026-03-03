import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const event = req.headers.get("x-github-event");

    if (event === "ping") {
      return res.json({ message: "pong", status: 200 });
    }

    //* HANDLE LATER

    return res.json({ message: "Event processes" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook", error);
    return res.json({ error: "Internal server error" }, { status: 500 });
  }
}
