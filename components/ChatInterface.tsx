// app/components/ChatInterface.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useAIState, useUIState, useActions } from "ai/rsc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Define the message type
type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function ChatInterface({ chatId }: { chatId?: string }) {
  const [activeTab, setActiveTab] = useState("chat");
  const [previewHtml, setPreviewHtml] = useState("");
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State for messages
  const [messages, setMessages] = useState<Message[]>([]);

  // Load chat history when chatId changes
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!chatId) {
        setMessages([]);
        setPreviewHtml("");
        return;
      }
      try {
        const response = await fetch(`/api/chat/${chatId}`);
        if (!response.ok) throw new Error("Failed to fetch chat");
        const data = await response.json();
        setMessages(data.messages);
        // Extract HTML from the last assistant message
        const assistantMessages = data.messages.filter(
          (msg: Message) => msg.role === "assistant"
        );
        if (assistantMessages.length > 0) {
          const lastAssistantMessage =
            assistantMessages[assistantMessages.length - 1];
          const htmlContent = extractHtmlFromMessage(
            lastAssistantMessage.content
          );
          if (htmlContent) {
            setPreviewHtml(htmlContent);
          }
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };
    loadChatHistory();
  }, [chatId]);

  // Extract HTML code from message content
  const extractHtmlFromMessage = (content: string): string => {
    // Look for code blocks or HTML content
    const htmlMatch =
      content.match(/```html\s*([\s\S]*?)\s*```/) ||
      content.match(/<!DOCTYPE html>[\s\S]*<\/html>/);
    if (htmlMatch && htmlMatch[1]) {
      return htmlMatch[1].trim();
    } else if (htmlMatch) {
      return htmlMatch[0].trim();
    }
    return "";
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to download HTML content
  const downloadHtml = () => {
    if (!previewHtml) return;
    const blob = new Blob([previewHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "landing-page.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isSubmitting) return;

    // Add user message to state immediately
    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsSubmitting(true);

    try {
      // Make API request
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          chatId: chatId,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      // Stream the response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantMessage += chunk;

          // Update with partial message
          setMessages([
            ...updatedMessages,
            { role: "assistant", content: assistantMessage },
          ]);
        }
      }

      // Extract HTML after receiving complete response
      const htmlContent = extractHtmlFromMessage(assistantMessage);
      if (htmlContent) {
        setPreviewHtml(htmlContent);
        setActiveTab("preview");
      }

      // Clear input
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="border-b p-4">
          <TabsList className="mb-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="chat" className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <h2 className="text-2xl font-bold mb-2">Landing Page Builder</h2>
              <p className="text-gray-600 mb-6 max-w-md">
                Describe the landing page you want to create, and Ill generate
                the HTML and CSS code for you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-2">Product Landing Page</h3>
                  <p className="text-sm text-gray-500">
                    Create a modern landing page for a new smartphone app with
                    hero section, features, pricing, and testimonials.
                  </p>
                </Card>
                <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-2">Service Business</h3>
                  <p className="text-sm text-gray-500">
                    Design a professional landing page for a consulting business
                    with about us, services, case studies, and contact form.
                  </p>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-100 ml-auto max-w-[80%]"
                      : "bg-gray-100 max-w-[80%]"
                  }`}
                >
                  <p className="font-medium mb-1">
                    {message.role === "user" ? "You" : "AI Assistant"}
                  </p>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </TabsContent>
        <TabsContent value="preview" className="flex-1 overflow-hidden">
          {previewHtml ? (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center border-b p-4">
                <h3 className="font-medium">Live Preview</h3>
                <Button onClick={downloadHtml}>Download HTML</Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  ref={previewRef}
                  srcDoc={previewHtml}
                  className="w-full h-full border-0"
                  title="Preview"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">
                No preview available. Start a chat to generate HTML.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="code" className="flex-1 overflow-auto">
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="font-medium">HTML Code</h3>
              <Button onClick={downloadHtml} disabled={!previewHtml}>
                Download HTML
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
              {previewHtml ? (
                <Textarea
                  className="w-full h-full font-mono bg-gray-50"
                  value={previewHtml}
                  readOnly
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">
                    No code available. Start a chat to generate HTML.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the landing page you want to create..."
            className="flex-1"
          />
          <Button type="submit" disabled={isSubmitting || !input.trim()}>
            {isSubmitting ? "Generating..." : "Generate"}
          </Button>
        </form>
      </div>
    </div>
  );
}
