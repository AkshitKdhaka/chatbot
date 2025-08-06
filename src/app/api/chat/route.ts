import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongo";
import Message from "@/models/Message";

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  await connectMongo();
  await Message.create({ role: "user", content: message });

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: message }],
      }),
    });

    // ❗ Check for non-OK status
    if (!groqRes.ok) {
      const errorText = await groqRes.text(); // Read raw text
      console.error("Groq API Error:", groqRes.status, errorText);
      return NextResponse.json({ error: "Groq API failed: " + errorText }, { status: groqRes.status });
    }

    const data = await groqRes.json();

    const reply = data.choices?.[0]?.message?.content || "Sorry, no reply generated.";

    await Message.create({ role: "assistant", content: reply });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
