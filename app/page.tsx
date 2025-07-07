"use client";

import { useChat } from "@ai-sdk/react";
import { Send, Sparkles, User, Loader2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, [input]);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input });
    setInput("");
  };

  return (
    <div
      className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      role="main"
    >
      {/* Header */}
      <header
        className="border-b border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm"
        role="banner"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent font-bold">
              JustAI
            </span>
          </h1>
        </div>
      </header>

      {messages.length === 0 ? (
        /* Centered Initial State */
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-3xl">
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl mb-6 mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                What can I help you with?
              </h2>

              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Ask me anything - I'm here to help with your questions and
                tasks.
              </p>
            </div>

            {/* Centered Input */}
            <div role="region" aria-label="Message input">
              <form onSubmit={onFormSubmit} className="relative">
                <div className="relative">
                  <label htmlFor="message-input" className="sr-only">
                    Type your message
                  </label>
                  <textarea
                    id="message-input"
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.currentTarget.value)}
                    placeholder="Ask JustAI anything..."
                    className="w-full px-6 py-5 pr-16 border-2 border-gray-200 rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[80px] max-h-[200px] text-base leading-relaxed placeholder-gray-500 shadow-lg bg-white/90 backdrop-blur-sm transition-all duration-200 hover:shadow-xl"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onFormSubmit(e as any);
                      }
                    }}
                    disabled={isLoading}
                    aria-describedby="input-help"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-3 bottom-3 p-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:scale-105"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
              <div
                id="input-help"
                className="flex items-center justify-center mt-4 text-xs text-gray-500"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Press Enter to send, Shift + Enter for new line
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Messages View */
        <>
          {/* Messages Container */}
          <div
            className="flex-1 overflow-y-auto"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
              <div className="space-y-8">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className="group"
                    role="article"
                    aria-label={`$ {
                      message.role === "user" ? "Your" : "Assistant"
                    } message`}
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* Avatar */}
                      <div className="flex-shrink-0 mt-1">
                        {message.role === "assistant" ? (
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-3">
                          <span className="text-sm font-semibold text-gray-900">
                            {message.role === "user" ? "You" : "JustAI"}
                          </span>
                        </div>
                        <div
                          className="prose prose-gray max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap break-words bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                          tabIndex={0}
                        >
                          {Array.isArray(message.parts)
                            ? message.parts.map((part, i) => {
                                if (part.type === "text") {
                                  return <div key={i}>{part.text}</div>;
                                }
                                return null;
                              })
                            : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div
                    className="group"
                    role="status"
                    aria-label="Assistant is typing"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-3">
                          <span className="text-sm font-semibold text-gray-900">
                            JustAI
                          </span>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                          <div className="flex items-center gap-3 text-gray-600">
                            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                            <span className="text-sm">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="text-center text-red-500 mt-4">
                    <div>An error occurred.</div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Input Area */}
          <div
            className="border-t border-gray-200 bg-white/80 backdrop-blur-xl"
            role="region"
            aria-label="Message input"
          >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
              <form onSubmit={onFormSubmit} className="relative">
                <div className="relative">
                  <label htmlFor="message-input-bottom" className="sr-only">
                    Type your message
                  </label>
                  <textarea
                    id="message-input-bottom"
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.currentTarget.value)}
                    placeholder="Ask JustAI anything..."
                    className="w-full px-6 py-5 pr-16 border-2 border-gray-200 rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[80px] max-h-[200px] text-base leading-relaxed placeholder-gray-500 shadow-lg bg-white/90 backdrop-blur-sm transition-all duration-200 hover:shadow-xl"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onFormSubmit(e as any);
                      }
                    }}
                    disabled={isLoading}
                    aria-describedby="input-help-bottom"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-3 bottom-3 p-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:scale-105"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
              <div
                id="input-help-bottom"
                className="flex items-center justify-center mt-4 text-xs text-gray-500"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Press Enter to send, Shift + Enter for new line
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
