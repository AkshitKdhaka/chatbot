"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Smile, Maximize2, Minimize2 } from 'lucide-react';
import type { ChatMessage } from "@/types/message";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMsg]);
      
      // Increment unread count if chat is closed
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: ChatMessage = { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again." 
      };
      setMessages((prev) => [...prev, errorMsg]);
      
      // Increment unread count if chat is closed
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const commonEmojis = ["😀", "😂", "😍", "🤔", "👍", "👎", "❤️", "🎉", "😢", "😡", "🙏", "💯"];

  return (
    <>
      {/* Main page content */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-center text-gray-800 mb-4 sm:mb-8">
            Welcome to Our Support Center
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900">How can we help you today?</h2>
            <p className="text-gray-800 mb-6 text-sm sm:text-base">
              Our AI-powered support chatbot is here to assist you 24/7. Click the chat bubble 
              in the bottom-right corner to get started!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 text-gray-900">Quick Support</h3>
                <p className="text-sm text-gray-800">
                  Get instant answers to common questions about our products and services.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 text-gray-900">24/7 Availability</h3>
                <p className="text-sm text-gray-800">
                  Our chatbot is available around the clock to provide you with assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chat Widget */}
      <div className={`fixed z-50 ${
        isFullscreen 
          ? 'inset-0' 
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6'
      }`}>
        {!isOpen ? (
          /* Chat Bubble */
          <button
            onClick={() => {
              setIsOpen(true);
              setUnreadCount(0); // Clear unread count when opening chat
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-200 hover:scale-110 group"
            aria-label="Open chat"
          >
            <MessageCircle size={20} className="sm:w-6 sm:h-6" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </button>
        ) : (
          /* Chat Window */
          <div className={`bg-white shadow-2xl flex flex-col border ${
            isFullscreen 
              ? 'w-full h-full rounded-none' 
              : 'w-full sm:w-96 rounded-lg sm:rounded-lg'
          } ${
            !isFullscreen 
              ? 'h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] max-w-sm sm:max-w-none mx-auto sm:mx-0' 
              : ''
          }`}>
            {/* Header */}
            <div className={`bg-blue-600 text-white p-3 sm:p-4 flex justify-between items-center ${
              isFullscreen ? 'rounded-none' : 'rounded-t-lg'
            }`}>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base">Support Chat</h3>
                <p className="text-xs opacity-90 text-white">We're here to help!</p>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={toggleFullscreen}
                  className="hover:bg-blue-700 rounded p-1 sm:p-1 transition-colors text-white"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize2 size={18} className="sm:w-5 sm:h-5" /> : <Maximize2 size={18} className="sm:w-5 sm:h-5" />}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsFullscreen(false);
                  }}
                  className="hover:bg-blue-700 rounded p-1 sm:p-1 transition-colors text-white"
                  aria-label="Close chat"
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
              {messages.length === 0 && (
                <div className="text-center text-gray-800 text-xs sm:text-xs">
                  <div className="bg-gray-200 text-gray-900 rounded-lg p-2 sm:p-2 mb-2 text-xs sm:text-xs">
                    👋 Hi! How can I help you today?
                  </div>
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] px-2 sm:px-2 py-1.5 sm:py-1.5 rounded-lg text-xs sm:text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-gray-200 text-gray-900 rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-2 sm:px-2 py-1.5 sm:py-1.5 rounded-lg rounded-bl-sm text-xs sm:text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 bg-gray-600 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs sm:text-xs text-gray-700 ml-1">typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="border-t bg-gray-50 p-2">
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
                  {commonEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="p-1 sm:p-1 hover:bg-gray-200 rounded text-sm sm:text-sm"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t p-3 sm:p-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="Add emoji"
                >
                  <Smile size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 border rounded-full px-3 py-2 sm:py-2 text-xs sm:text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-600"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full p-2 sm:p-2 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Send size={12} className="sm:w-[14px] sm:h-[14px]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
