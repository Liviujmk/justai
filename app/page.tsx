"use client";

import { useChat } from "@ai-sdk/react";
import { SwatchBook } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { MessageList, ChatInput } from "../components/ui";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const [inputAreaHeight, setInputAreaHeight] = useState(0);

  const isLoading = status === "submitted" || status === "streaming";

  // Measure input area height dynamically
  useEffect(() => {
    const measureInputHeight = () => {
      if (inputAreaRef.current) {
        const height = inputAreaRef.current.offsetHeight;
        setInputAreaHeight(height);
      }
    };

    measureInputHeight();

    // Remeasure on window resize
    window.addEventListener("resize", measureInputHeight);

    // Use ResizeObserver for more accurate tracking
    const resizeObserver = new ResizeObserver(measureInputHeight);
    if (inputAreaRef.current) {
      resizeObserver.observe(inputAreaRef.current);
    }

    return () => {
      window.removeEventListener("resize", measureInputHeight);
      resizeObserver.disconnect();
    };
  }, []);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen" role="main">
      {/* Header */}
      <header className="" role="banner">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <SwatchBook className="size-7 text-black" />
            </div>
          </h1>
        </div>
      </header>

      {/* Messages Area */}
      <MessageList
        messages={messages as any}
        isLoading={isLoading}
        error={error}
        inputAreaHeight={inputAreaHeight}
      />

      {/* Input Area */}
      <ChatInput
        ref={inputAreaRef}
        input={input}
        setInput={setInput}
        onSubmit={onFormSubmit}
        isLoading={isLoading}
        messagesLength={messages.length}
      />
    </div>
  );
}
