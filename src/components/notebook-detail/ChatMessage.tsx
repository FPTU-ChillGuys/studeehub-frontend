import React from "react";
import { ChatMessage as ChatMessageType, Document } from "@/Types";
import { UIMessage } from "ai";

interface ChatMessageProps {
  message: UIMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  
  const sources = message.parts.filter(part => part.type === 'source-document');
  const text = message.parts.find(part => part.type === 'text');

  return (
    <div
      className={`flex ${message.role == "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-lg p-3 ${
          message.role == "user"
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border text-foreground"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{text?.text}</p>
        {sources && sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/20">
            <p className="text-xs text-muted-foreground">
              Nguồn:{" "}
              {sources.map((source) => {
                    return source.filename;
                })
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
