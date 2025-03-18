// app/components/ChatHistorySidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  role: string;
  createdAt: string;
}

interface Chat {
  id: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export default function ChatHistorySidebar({
  onSelectChat,
  activeChat,
}: {
  onSelectChat: (chatId: string | null) => void;
  activeChat: string | null;
}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch chat history
  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/chat/history");
      if (!response.ok) throw new Error("Failed to fetch chats");
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Create a new chat
  const createNewChat = () => {
    onSelectChat(null);
  };

  // Delete a chat
  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete chat");

      // If the active chat was deleted, create a new one
      if (activeChat === chatId) {
        onSelectChat(null);
      }

      // Refresh the chat list
      fetchChats();
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  // Get chat preview (first few words of the first message)
  const getChatPreview = (chat: Chat): string => {
    if (!chat.messages || chat.messages.length === 0) {
      return "New conversation";
    }

    const firstMessage = chat.messages[0];
    const previewText = firstMessage.content.substring(0, 30);
    return previewText.length < firstMessage.content.length
      ? `${previewText}...`
      : previewText;
  };

  return (
    <div className="w-64 bg-gray-50 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <Button
          onClick={createNewChat}
          className="w-full flex items-center justify-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No chat history</div>
        ) : (
          <ul className="divide-y">
            {chats.map((chat) => (
              <li
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`p-3 cursor-pointer hover:bg-gray-100 ${
                  activeChat === chat.id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-2">
                    <p className="text-sm font-medium truncate">
                      {getChatPreview(chat)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(chat.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => deleteChat(chat.id, e)}
                    className="h-6 w-6 p-0"
                  >
                    <TrashIcon className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
