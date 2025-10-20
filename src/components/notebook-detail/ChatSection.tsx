import React, { useEffect, useRef } from "react";
import { Notebook } from "@/Types";
import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";
import { UIMessage } from "ai";

interface ChatSectionProps {
  notebook: Notebook;
  messages: UIMessage[];
  handleSendMessage: (message: string) => void;
  selectedDocuments: Set<string>;
  getFileIcon: (type: string) => React.ReactNode;
  status: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({
  notebook,
  messages,
  handleSendMessage,
  selectedDocuments,
  getFileIcon,
  status,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status]);

  return (
    <div className="w-[50%] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{notebook.thumbnail}</div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground truncate">
              {notebook.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {status === "streaming" ||
        (status === "submitted" && (
            <div
              className={`max-w-[30%] rounded-lg p-3 bg-card border border-border text-foreground`}
            >
              <p className="text-sm whitespace-pre-wrap"> Đang chờ...</p>
            </div>
        ))}
        {/* Invisible element at the end for scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        handleSendMessage={handleSendMessage}
        selectedDocuments={selectedDocuments}
        documents={notebook.documents}
        getFileIcon={getFileIcon}
      />
    </div>
  );
};

export default ChatSection;
