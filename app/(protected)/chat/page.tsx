"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/chat");
        const json = await res.json();
        if (json.success) {
          setMessages(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch chat history", error);
      } finally {
        setIsFetching(false);
      }
    }
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add optimistic message
    const optimisticMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const json = await res.json();
      
      if (json.success) {
        setMessages((prev) => [...prev, json.data]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (error) {
      console.error("Chat error", error);
      // Remove optimistic message if failed
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Bot className="w-8 h-8 text-emerald-400" />
          AI Health Coach
        </h1>
        <p className="text-gray-400">Ask about nutrition, workouts, or healthy habits.</p>
      </div>

      <div className="flex-1 glass-card border border-gray-800/60 overflow-hidden flex flex-col relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none" />
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth z-10">
          {isFetching ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
              <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-2">
                <Sparkles className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-gray-300 max-w-sm">
                Hi! I'm your personal AI health coach. Ask me anything about your diet, workouts, or lifestyle goals!
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="w-8 h-8 shrink-0 border border-gray-700">
                  {msg.role === "user" ? (
                    <>
                      <AvatarImage src={session?.user?.image ?? ""} />
                      <AvatarFallback>{session?.user?.name?.charAt(0) ?? "U"}</AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                      AI
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === "user"
                      ? "bg-emerald-500 text-white rounded-tr-sm"
                      : "bg-gray-800/80 text-gray-200 rounded-tl-sm border border-gray-700/50 shadow-lg"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 flex-row"
            >
              <Avatar className="w-8 h-8 shrink-0 border border-gray-700">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-800/80 rounded-2xl rounded-tl-sm p-4 border border-gray-700/50 shadow-lg flex items-center gap-1.5 w-20 h-[52px]">
                <div className="w-2 h-2 bg-emerald-400 rounded-full typing-dot" />
                <div className="w-2 h-2 bg-emerald-400 rounded-full typing-dot" />
                <div className="w-2 h-2 bg-emerald-400 rounded-full typing-dot" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-900/90 border-t border-gray-800/60 z-10 backdrop-blur-md">
          <form onSubmit={sendMessage} className="relative flex items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your coach..."
              className="pr-12 h-12 bg-gray-800 border-gray-700 focus:border-emerald-500/50 rounded-xl"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="absolute right-1.5 h-9 w-9 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
