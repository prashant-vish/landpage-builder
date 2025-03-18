// app/api/chat/[chatId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const chatId = params.chatId;

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    // app/api/chat/[chatId]/route.ts (continued)
    return NextResponse.json(chat);
  } catch (error) {
    console.error("Chat detail error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const chatId = params.chatId;

    // Check if the chat belongs to the user
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userId,
      },
    });

    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    // Delete the chat and its messages (cascade delete is set up in the schema)
    await prisma.chat.delete({
      where: {
        id: chatId,
      },
    });

    return NextResponse.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Chat deletion error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
