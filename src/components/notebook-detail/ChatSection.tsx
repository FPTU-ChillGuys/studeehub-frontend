import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Notebook, ChatMessage as ChatMessageType } from "@/Types";
import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";
import { UIMessage } from "ai";

interface ChatSectionProps {
  notebook: Notebook;
  messages: UIMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  selectedDocuments: Set<string>;
  getFileIcon: (type: string) => React.ReactNode;
  status: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({
  notebook,
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  selectedDocuments,
  getFileIcon,
  status,
}) => {
  return (
    <div className="w-[70%] border-r border-border flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{notebook.thumbnail}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link href="/dashboard/my-documents">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h2 className="text-lg font-semibold text-foreground truncate">
                {notebook.title}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {notebook.documentsCount} documents •{" "}
              {notebook.totalQuestions} questions generated
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}
      </div>

      {/* Status */}
      {status === "streaming" || status === "submitted" && (
        <div className="p-4 border-t border-border bg-card text-sm text-muted-foreground">
          Đang tạo câu hỏi...
        </div>
      )}

      {/* Message Input */}
      <MessageInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        selectedDocuments={selectedDocuments}
        documents={notebook.documents}
        getFileIcon={getFileIcon}
      />
    </div>
  );
};

export default ChatSection;
