"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";

// --------------------------------------------
// 🟢 Message Type
// --------------------------------------------
interface Message {
  sender: "user" | "bot";
  text: string;
  options?: string[];
}

export default function ChatAgent() {
  // --------------------------------------------
  // 🟢 States
  // --------------------------------------------
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // --------------------------------------------
  // 🟢 Greeting Message (Runs Only When Opened First Time)
  // --------------------------------------------
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const timer1 = setTimeout(() => {
        // First greet
        setMessages([
          { sender: "bot", text: "👋 Hello Sir, I’m your AI Assistant!" },
        ]);

        const timer2 = setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "What about your query today?",
              options: [
                "💬 Chat with Support",
                "📦 Check Order Status",
                "🧾 View History",
                "📞 Contact Team",
              ],
            },
          ]);
        }, 1000);

        return () => clearTimeout(timer2);
      }, 400);

      return () => clearTimeout(timer1);
    }
  }, [isOpen]);

  // --------------------------------------------
  // 🟢 Auto-scroll to bottom on new message
  // --------------------------------------------
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --------------------------------------------
  // 🟢 When user clicks a suggestion option
  // --------------------------------------------
  const handleOptionClick = (option: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: option }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Processing your request..." },
      ]);
    }, 900);
  };

  // --------------------------------------------
  // 🟢 When user manually sends a message
  // --------------------------------------------
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Got it Sir! I’ll forward this to the team 🔥",
        },
      ]);
    }, 800);
  };

  // --------------------------------------------
  // 🟢 UI
  // --------------------------------------------
  return (
    <>
      {/* Floating Robot Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[9999]"
      >
        {!isOpen ? (
          <motion.img
            src="/robot.png"
            alt="ChatBot"
            className="w-20 h-20"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        ) : (
          <div className="bg-red-600 p-4 rounded-full text-white shadow-lg">
            <X size={22} />
          </div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 70 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-28 right-6 w-80 h-[480px] bg-[#0F172A] border border-gray-700 rounded-2xl shadow-2xl flex flex-col z-[9999]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-700 to-purple-700">
              <motion.img
                src="/robot.png"
                alt="Bot"
                className="w-10 h-10 rounded-full"
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <h3 className="text-white font-semibold text-sm"> AI Assistant</h3>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-3 bg-[#0B1430] space-y-2 text-sm">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`p-2 rounded-lg max-w-[80%] ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white ml-auto"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.options && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {msg.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(opt)}
                          className="bg-blue-700 hover:bg-blue-800 text-white text-xs px-3 py-1 rounded-lg"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSend}
              className="p-3 flex gap-2 bg-[#0F172A] border-t border-gray-700"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-[#091530] border border-gray-600 text-white rounded-lg px-3 py-2"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-white"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
