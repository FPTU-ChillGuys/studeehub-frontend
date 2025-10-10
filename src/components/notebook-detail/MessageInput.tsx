import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Document } from "@/Types";

interface MessageInputProps {
  handleSendMessage: (message: string) => void;
  selectedDocuments: Set<string>;
  documents: Document[];
  getFileIcon: (type: string) => React.ReactNode;
}

const MessageInput: React.FC<MessageInputProps> = ({
  handleSendMessage,
  selectedDocuments,
  documents,
  getFileIcon,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  

  const onSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
    setInputMessage("");
  };

  return (
    <div className="p-4 border-t border-border">
      {/* Selected Documents Display */}
      {selectedDocuments.size > 0 && (
        <div className="mb-3 p-2 bg-muted/50 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground mb-2">
            Chatting with {selectedDocuments.size} documents:
          </p>
          <div className="flex flex-wrap gap-1">
            {Array.from(selectedDocuments).map((docId) => {
              const doc = documents.find((d) => d.id === docId);
              return doc ? (
                <span
                  key={docId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                >
                  {getFileIcon(doc.type)}
                  <span className="max-w-[120px] truncate">{doc.name}</span>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      <form onSubmit={onSend} className="flex gap-2">
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            selectedDocuments.size > 0
              ? "Ask about the content of the selected documents..."
              : "Select documents to start chatting..."
          }
          // disabled={selectedDocuments.size === 0}
          className="flex-1"
        />
        <Button
          type="submit"
          // disabled={selectedDocuments.size === 0 || !inputMessage.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
