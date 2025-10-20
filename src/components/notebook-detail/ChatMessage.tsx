import React from "react";
import { ChatMessage as ChatMessageType, Document } from "@/Types";
import { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: UIMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // const sources = message.parts.filter(part => part.type === 'source-document');
  const messageText = message?.parts?.find((part) => part.type === "text")?.text || "";

  return (
    <div
      className={`flex w-full ${
        message.role == "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] min-w-0 rounded-lg p-3 ${
          message.role == "user"
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border text-foreground"
        }`}
        style={{
          wordWrap: "break-word",
          overflowWrap: "break-word",
          wordBreak: "break-word",
          overflow: "hidden"
        }}
      >
        <div 
          className="text-sm prose prose-sm dark:prose-invert max-w-none"
          style={{
            wordWrap: "break-word",
            overflowWrap: "break-word",
            wordBreak: "break-word"
          }}
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Customize rendering for specific elements
              p: ({ children }) => (
                <p className="mb-2 last:mb-0" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-2 space-y-1" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-2 space-y-1" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="ml-2" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                  {children}
                </li>
              ),
              code: ({ inline, children, ...props }: any) => 
                inline ? (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono" style={{ wordBreak: "break-all" }} {...props}>
                    {children}
                  </code>
                ) : (
                  <code className="block bg-muted p-2 rounded text-xs font-mono overflow-x-auto" style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }} {...props}>
                    {children}
                  </code>
                ),
              pre: ({ children }) => <pre className="bg-muted p-2 rounded my-2 overflow-x-auto">{children}</pre>,
              strong: ({ children }) => (
                <strong className="font-bold" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                  {children}
                </em>
              ),
              h1: ({ children }) => (
                <h1 className="text-lg font-bold mb-2" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-base font-bold mb-2" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-bold mb-1" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                  {children}
                </h3>
              ),
            }}
          >
            {messageText}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
