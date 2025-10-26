import React, { useMemo } from "react"; 
import { CitationList } from "./CitationList";
import { MarkdownContent } from "./MarkdownContent";
import { ChatMessageProps, ParsedContent } from "@/Types";



const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  // Parse JSON response if it's from assistant - memoized để tránh re-parse mỗi lần render
  const messageText = message?.parts?.find((part) => part.type === "text")?.text || "";
  
  const parsedContent = useMemo<ParsedContent | null>(() => {
    // Only parse for assistant messages
    if (message.role !== "assistant" || !messageText.trim()) {
      return null;
    }
    
    try {
      const parsed = JSON.parse(messageText);
      console.log("Parsed content:", parsed); 
      // Check for new format with results array
      if (parsed.results && Array.isArray(parsed.results)) {
        return parsed;
      }
      return null;
    } catch {
      // Not JSON, use as plain text
      return null;
    }
  }, [message.role, messageText]);

  // Extract text content từ incomplete JSON khi đang stream
  const displayText = useMemo(() => {
    if (parsedContent) return null; // Nếu đã parse được JSON hoàn chỉnh
    if (message.role !== "assistant") return messageText;

    // ⚡ Check ngay với messageText để detect JSON
    const trimmed = messageText.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      // Tìm "content":" và lấy text phía sau
      const contentStart = trimmed.indexOf('"content"');
      
      // Chỉ extract nếu đã có "content" field
      if (contentStart !== -1) {
        try {
          // Pattern 1: Tìm content field có thể chưa đóng quote
          let extractedText = '';
          
          const afterContent = trimmed.substring(contentStart);
          const colonIndex = afterContent.indexOf(':');
          if (colonIndex !== -1) {
            const afterColon = afterContent.substring(colonIndex + 1).trim();
            
            // Loại bỏ quote mở đầu nếu có
            let textContent = afterColon;
            if (textContent.startsWith('"')) {
              textContent = textContent.substring(1);
            }
            
            // Tìm quote đóng (nếu có) hoặc lấy hết
            let endIndex = textContent.length;
            
            // Tìm quote đóng không bị escape
            for (let i = 0; i < textContent.length; i++) {
              if (textContent[i] === '"' && (i === 0 || textContent[i - 1] !== '\\')) {
                endIndex = i;
                break;
              }
            }
            
            extractedText = textContent.substring(0, endIndex);
            
            // Decode escaped characters
            extractedText = extractedText
              .replace(/\\n/g, '\n')
              .replace(/\\"/g, '"')
              .replace(/\\\\/g, '\\')
              .replace(/\\t/g, '\t');
          }
          
          if (extractedText) {
            return extractedText;
          }
        } catch {
          // Nếu extract failed
        }
      }
      // ⚡ Nếu là JSON nhưng chưa có "content" field → return empty ngay lập tức
      return '';
    }
    
    return messageText;
  }, [parsedContent, message.role, messageText]);

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
        {/* Message Content */}
        <div 
          className="text-sm prose prose-sm dark:prose-invert max-w-none"
          style={{
            wordWrap: "break-word",
            overflowWrap: "break-word",
            wordBreak: "break-word"
          }}
        >
          {parsedContent ? (
            // Render multiple content blocks with citations
            <div className="space-y-4">
              {parsedContent.results.map((block, blockIndex) => (
                <div key={blockIndex} className="leading-relaxed">
                  <MarkdownContent content={block.content} />
                  <CitationList citations={block.citations} />
                </div>
              ))}
            </div>
          ) : displayText !== null && displayText !== '' ? (
            // Chỉ render khi displayText có content thực sự
            <MarkdownContent content={displayText} />
          ) : displayText === null && messageText ? (
            // Fallback: displayText = null (không phải JSON) → dùng messageText
            <MarkdownContent content={messageText} />
          ) : null}
        </div>
      </div>
    </div>
  );
});

// Custom comparison để tránh re-render khi message text không đổi
ChatMessage.displayName = "ChatMessage";

export default React.memo(ChatMessage, (prevProps, nextProps) => {
  const prevText = prevProps.message?.parts?.find((part) => part.type === "text")?.text || "";
  const nextText = nextProps.message?.parts?.find((part) => part.type === "text")?.text || "";
  
  // Chỉ re-render nếu text thực sự thay đổi
  // Hoặc nếu message ID khác (message mới)
  return (
    prevText === nextText &&
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.role === nextProps.message.role
  );
});
