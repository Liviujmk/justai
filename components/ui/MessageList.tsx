"use client";

import { useRef, useEffect } from "react";
import { SwatchBook } from "lucide-react";
import Message from "./Message";

interface MessageListProps {
  messages: any[];
  isLoading: boolean;
  error: any;
  inputAreaHeight: number;
}

const MessageList = ({
  messages,
  isLoading,
  error,
  inputAreaHeight,
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if there's a streaming message that has started
  const hasStreamingContent = messages.some(
    (msg: any) =>
      msg.role === "assistant" &&
      msg.parts?.some((part: any) => part.type === "text" && part.text)
  );

  return (
    <div
      className="flex-1 overflow-y-auto scroll-smooth"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 py-6"
        style={{ paddingBottom: `${inputAreaHeight + 24}px` }}
      >
        <div className="space-y-8">
          {messages.length === 0 ? (
            <div className="text-center mb-8 flex flex-col items-center justify-center h-full">
              <div className="flex items-center justify-center mb-6 mx-auto gap-3">
                <SwatchBook className="size-11 text-black" />
                <h1 className="text-2xl font-bold">JustAI</h1>
              </div>
              <div className="text-gray-500 text-lg">
                Ask JustAI anything...
              </div>
            </div>
          ) : (
            messages
              .filter((message) => message.role !== "system")
              .map((message, index) => (
                <Message
                  key={message.id}
                  id={message.id}
                  role={message.role}
                  parts={message.parts}
                  isStreaming={isLoading}
                  isLastMessage={
                    index ===
                    messages.filter((m) => m.role !== "system").length - 1
                  }
                />
              ))
          )}

          {/* Show spinner only when loading and no streaming content yet */}
          {isLoading && !hasStreamingContent && (
            <div
              className="group"
              role="status"
              aria-label="Assistant is typing"
            >
              <div className="max-w-4xl">
                <div className="flex items-center justify-start">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
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
  );
};

export default MessageList;
