"use client";

import { useRef, useEffect, forwardRef } from "react";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  messagesLength: number;
}

const ChatInput = forwardRef<HTMLDivElement, ChatInputProps>(
  ({ input, setInput, onSubmit, isLoading, messagesLength }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const prevLoadingRef = useRef(isLoading);

    // Auto-resize textarea
    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
      }
    }, [input]);

    // Auto-focus after streaming completes
    useEffect(() => {
      // If loading changed from true to false (streaming finished)
      if (prevLoadingRef.current && !isLoading && textareaRef.current) {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 100);
      }
      prevLoadingRef.current = isLoading;
    }, [isLoading]);

    // Focus on initial render if no messages
    useEffect(() => {
      if (messagesLength === 0 && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [messagesLength]);

    return (
      <div
        ref={ref}
        className={`input-slide fixed left-0 right-0 z-10 ${
          messagesLength === 0 ? "input-slide-center" : "input-slide-bottom"
        } transition-transform duration-500 ease-in-out`}
        style={{ bottom: 0 }}
        role="region"
        aria-label="Message input"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <form onSubmit={onSubmit} className="relative">
            <div className="relative w-full bg-white border pb-3 px-3 border-gray-200 rounded-4xl resize-none focus:outline-none transition-all duration-200 shadow-sm">
              <div className="">
                <label htmlFor="message-input-bottom" className="sr-only">
                  Type your message
                </label>
                <textarea
                  id="message-input-bottom"
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.currentTarget.value)}
                  placeholder="Ask JustAI anything..."
                  className="pt-5 px-2 align-bottom w-full mb-5 min-h-14 focus:outline-none resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSubmit(e as any);
                    }
                  }}
                  disabled={isLoading}
                  aria-describedby="input-help-bottom"
                />
              </div>
              <div className="flex justify-end items-center">
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="cursor-pointer p-3 bg-gray-900 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none hover:scale-110"
                  aria-label="Send message"
                >
                  <ArrowUp className="size-6 text-white" />
                  <span className="sr-only">Send message</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
