// app/chat/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import ChatInterface from "@/components/ChatInterface";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <header className="bg-white border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 p-1 rounded hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <h1 className="text-xl font-bold">Landing Page Builder</h1>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600">
              Signed in as {session?.user?.email}
            </p>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-blue-600 hover:underline"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {isSidebarOpen && (
          <ChatHistorySidebar
            onSelectChat={setActiveChatId}
            activeChat={activeChatId}
          />
        )}
        <div className="flex-1 overflow-hidden">
          <ChatInterface chatId={activeChatId || undefined} />
        </div>
      </main>
    </div>
  );
}
