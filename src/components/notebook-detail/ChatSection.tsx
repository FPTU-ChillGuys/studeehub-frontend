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
        {messages.map((message) => {
          // Kiểm tra nếu là message cuối cùng từ assistant và đang streaming với nội dung trống
          const isLastMessage = messages[messages.length - 1]?.id === message.id;
          const messageText = message?.parts?.find((part) => part.type === "text")?.text || "";
          const isEmptyAssistantMessage = 
            message.role === "assistant" && 
            messageText.trim() === "" &&
            status === "streaming" &&
            isLastMessage;

          if (isEmptyAssistantMessage) {
            return (
              <div
                key={message.id}
                className={`max-w-[30%] rounded-lg p-3 bg-card border border-border text-foreground`}
              >
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  <p className="text-sm whitespace-pre-wrap">Đang phản hồi...</p>
                </div>
              </div>
            );
          }

          return <ChatMessage key={message.id} message={message} />;
        })}
        {(status !== "streaming" && status === "submitted") && (
            <div
              className={`max-w-[30%] rounded-lg p-3 bg-card border border-border text-foreground`}
            >
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                <p className="text-sm whitespace-pre-wrap">Đang chờ...</p>
              </div>
            </div>
        )}
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
