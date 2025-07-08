"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { User } from "lucide-react";
import { SwatchBook } from "lucide-react";
import { UIMessagePart } from "ai";

interface MessageProps {
  id: string;
  role: "user" | "assistant" | "system";
  parts?: any[];
  isStreaming?: boolean;
  isLastMessage?: boolean;
}

const Message = memo(
  ({
    id,
    role,
    parts,
    isStreaming = false,
    isLastMessage = false,
  }: MessageProps) => {
    const isCurrentlyStreaming =
      role === "assistant" && isStreaming && isLastMessage;

    const renderContent = () => {
      if (!Array.isArray(parts)) return null;

      return parts.map((part, i) => {
        if (part.type === "text") {
          if (role === "user") {
            // User messages render as plain text
            return (
              <div key={i} className="text-gray-900">
                {part.text}
              </div>
            );
          } else {
            // Assistant messages render as markdown
            return (
              <div
                key={i}
                className={isCurrentlyStreaming ? "streaming-text" : ""}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    code(props: any) {
                      const { node, inline, className, children, ...rest } =
                        props;
                      const match = /language-(\w+)/.exec(className || "");
                      const language = match ? match[1] : "";

                      // Extract text content from children
                      const getTextContent = (children: any): string => {
                        if (typeof children === "string") {
                          return children;
                        }
                        if (Array.isArray(children)) {
                          return children
                            .map((child) => getTextContent(child))
                            .join("");
                        }
                        if (
                          children &&
                          typeof children === "object" &&
                          children.props
                        ) {
                          return getTextContent(children.props.children);
                        }
                        return String(children || "");
                      };

                      const codeContent = getTextContent(children);

                      if (!inline && language) {
                        return (
                          <div className="relative my-4">
                            <div className="flex items-center justify-between bg-gray-800 text-gray-200 px-4 py-2 text-sm rounded-t-lg">
                              <span className="font-medium">{language}</span>
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(codeContent)
                                }
                                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
                              >
                                Copy
                              </button>
                            </div>
                            <SyntaxHighlighter
                              style={oneDark}
                              language={language}
                              PreTag="div"
                              className="rounded-b-lg"
                              {...rest}
                            >
                              {codeContent.replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          </div>
                        );
                      }

                      return (
                        <code
                          className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
                          {...rest}
                        >
                          {codeContent}
                        </code>
                      );
                    },
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-4 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-3 first:mt-0">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2 first:mt-0">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-800 leading-relaxed mb-4 last:mb-0">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-outside text-gray-800 mb-4 space-y-1 pl-6">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-outside text-gray-800 mb-4 space-y-1 pl-6">
                        {children}
                      </ol>
                    ),
                    hr: () => <hr className="my-8" />,
                    li: ({ children }) => (
                      <li className="text-gray-800 leading-relaxed">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">
                        {children}
                      </blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full border border-gray-200 rounded-lg">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-gray-50">{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-2 text-sm text-gray-800 border-b">
                        {children}
                      </td>
                    ),
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {children}
                      </a>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-900">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-gray-800">{children}</em>
                    ),
                  }}
                >
                  {part.text}
                </ReactMarkdown>
              </div>
            );
          }
        }
        return null;
      });
    };

    return (
      <div
        className={`group ${role === "user" ? "flex justify-end" : ""}`}
        role="article"
        aria-label={`${role === "user" ? "Your" : "Assistant"} message`}
      >
        <div className={`${role === "user" ? "max-w-2xl" : "max-w-4xl"}`}>
          <div
            className={`prose prose-gray max-w-none leading-relaxed break-words rounded-2xl px-4 py-2 ${
              role === "user"
                ? "bg-white border border-gray-200 text-gray-900 rounded-4xl"
                : "text-gray-800"
            }`}
            tabIndex={0}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }
);

Message.displayName = "Message";

export default Message;
