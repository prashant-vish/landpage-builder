// app/api/chat/route.ts
import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// System prompt optimization for landing page generation
const SYSTEM_PROMPT = `
You are an expert HTML and CSS developer specializing in creating landing pages.
Your task is to generate clean, responsive, and modern HTML and CSS code for landing pages based on user requirements.
Always include the following in your responses:
1. Valid HTML5 code with proper semantics
2. Responsive design using CSS (preferably with media queries)
3. Modern design principles and aesthetics
4. Optimized for performance and SEO
5. All HTML and CSS must be in a single file (inline CSS in a <style> tag)
6. Include comments to explain different sections
7. Use semantic HTML tags where appropriate
8. Ensure the page looks good on both mobile and desktop
9. Focus on creating compelling visual hierarchy and user flow
10. Include placeholder content that's relevant to the type of landing page requested

The code should be ready to use immediately when copied into an HTML file.
`;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, chatId } = await req.json();

    const userId = session.user.id;
  

    // Create or update chat
    let chat;
    if (chatId) {
      chat = await db.chat.findUnique({
        where: { id: chatId, userId },
      });

      if (!chat) {
        return new Response("Chat not found", { status: 404 });
      }
    } else {
      console.log("-----------------------inside else________");
      chat = await db.chat.create({
        data: { userId },
      });
    }

    // Save user message
    await db.message.create({
      data: {
        chatId: chat.id,
        content: messages[messages.length - 1].content,
        role: "user",
      },
    });

    // Add system prompt to the beginning of the conversation
    const conversationWithSystemPrompt = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    // Create response stream with the AI SDK
    const { textStream } = streamText({
      model: openai("gpt-4"),
      messages: conversationWithSystemPrompt,
    });

    // Prepare response
    const encoder = new TextEncoder();
    let fullCompletion = "";

    // Create a ReadableStream from the textStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const textPart of textStream) {
            fullCompletion += textPart;
            controller.enqueue(encoder.encode(textPart));
          }

          // Save the complete response to the database
          await db.message.create({
            data: {
              chatId: chat.id,
              content: fullCompletion,
              role: "assistant",
            },
          });

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.log("Chat API error:", error);
    return new Response("Internal server error ho gya", { status: 500 });
  }
}
