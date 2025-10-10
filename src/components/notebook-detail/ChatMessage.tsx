import React from "react";
import { ChatMessage as ChatMessageType, Document } from "@/Types";
import { UIMessage } from "ai";
import { text } from "stream/consumers";

interface ChatMessageProps {
  message: UIMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // const sources = message.parts.filter(part => part.type === 'source-document');

  return (
    <div
      className={`flex ${
        message.role == "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] rounded-lg p-3 ${
          message.role == "user"
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border text-foreground"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">
          {message?.parts?.find((part) => part.type === "text")?.text || null}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
