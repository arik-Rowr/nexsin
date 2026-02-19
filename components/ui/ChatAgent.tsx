"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Maximize2, Minimize2 } from "lucide-react";
import Image from "next/image";

interface Message {
  sender: "user" | "bot";
  text: string;
  options?: string[];
}

export default function ChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  /* Greeting */
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: "bot", text: "🤖 Hello! I’m your AI Assistant." }]);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "How can I help you today?",
            options: [
              "💬 Chat with Support",
              "📦 Check Order Status",
              "🧾 View History",
              "📞 Contact Team",
            ],
          },
        ]);
      }, 600);
    }
  }, [isOpen]);

  /* Auto scroll */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOptionClick = (option: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: option }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Processing your request..." },
      ]);
    }, 600);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Got it! I’ll forward this 🚀" },
      ]);
    }, 600);
  };

  return (
    /* GLOBAL WRAPPER (does NOT block site clicks) */
    <div className="fixed inset-0 pointer-events-none z-[40]">
      {/* FLOATING CHAT BUTTON */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 pointer-events-auto"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src="/robot.png"
            alt="chat"
            className="w-20 h-20 drop-shadow-[0_0_12px_#00BFFF]"
          />
        </motion.button>
      )}

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`fixed pointer-events-auto bg-[#0A0F1D]/95 backdrop-blur-xl
              border border-[#1A2337] shadow-2xl flex flex-col
              ${
                isFull
                  ? "inset-0 rounded-none"
                  : "bottom-28 right-6 w-[22rem] h-[520px] rounded-2xl"
              }
            `}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center p-4 bg-[#162447]">
              <h3 className="text-white font-semibold">AI Assistant</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsFull(!isFull)}
                  className="bg-white/20 p-2 rounded text-white"
                >
                  {isFull ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsFull(false);
                  }}
                  className="bg-red-500 p-2 rounded text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* CHAT BODY */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#0B1220] space-y-3">
              {messages.map((msg, i) => (
                <div key={i}>
                  <div
                    className={`px-4 py-2 rounded-xl text-sm max-w-[70%] ${
                      msg.sender === "user"
                        ? "ml-auto bg-blue-600 text-white"
                        : "mr-auto bg-[#1C2333] text-gray-200"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.options && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(opt)}
                          className="bg-[#1E88E5] hover:bg-[#1565C0] text-white px-3 py-1 rounded text-xs"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* INPUT */}
            <form
              onSubmit={handleSend}
              className="flex gap-2 p-3 bg-[#0A0F1D] border-t border-[#162032]"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[#101A33] border border-[#1B2A47] text-white rounded px-3 py-2"
              />
              <button
                type="submit"
                className="bg-[#1E88E5] hover:bg-[#1565C0] p-2 rounded text-white"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
