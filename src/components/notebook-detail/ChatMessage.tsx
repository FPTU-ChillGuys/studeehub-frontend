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
  
      </div>
    </div>
  );
};

export default ChatMessage;
