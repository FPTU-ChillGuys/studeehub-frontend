import React, { useMemo } from "react";
import { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardTrigger,
  InlineCitationCardBody,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselItem,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselPrev,
  InlineCitationCarouselNext,
  InlineCitationSource,
  InlineCitationQuote,
} from "@/components/ai-elements/inline-citation";

interface Citation {
  number: string;
  title: string;
  url: string;
  description?: string;
  quote?: string;
}

interface ParsedContent {
  content: string;
  citations: Citation[];
}

interface ChatMessageProps {
  message: UIMessage;
}

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
      if (parsed.content && parsed.citations) {
        return parsed;
      }
      return null;
    } catch {
      // Not JSON, use as plain text
      return null;
    }
  }, [message.role, messageText]);

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
            // Render with inline citations using AI Elements
            <div className="leading-relaxed">
              {parsedContent.content.split(/(\[\d+\])/).map((part, index) => {
                const citationMatch = part.match(/\[(\d+)\]/);
                if (citationMatch) {
                  const citationNumber = citationMatch[1];
                  const citation = parsedContent.citations.find(
                    (c) => c.number === citationNumber
                  );

                  if (citation) {
                    return (
                      <InlineCitation key={index}>
                        <InlineCitationCard>
                          <InlineCitationCardTrigger sources={[citation.url]} />
                          <InlineCitationCardBody>
                            <InlineCitationCarousel>
                              <InlineCitationCarouselHeader>
                                <InlineCitationCarouselPrev />
                                <InlineCitationCarouselNext />
                                <InlineCitationCarouselIndex />
                              </InlineCitationCarouselHeader>
                              <InlineCitationCarouselContent>
                                <InlineCitationCarouselItem>
                                  <InlineCitationSource
                                    title={citation.title}
                                    url={citation.url}
                                    description={citation.description}
                                  />
                                  {citation.quote && (
                                    <InlineCitationQuote>
                                      {citation.quote}
                                    </InlineCitationQuote>
                                  )}
                                </InlineCitationCarouselItem>
                              </InlineCitationCarouselContent>
                            </InlineCitationCarousel>
                          </InlineCitationCardBody>
                        </InlineCitationCard>
                      </InlineCitation>
                    );
                  }
                }
                return <span key={index}>{part}</span>;
              })}
            </div>
          ) : (
            // Render plain markdown without citations
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
          )}
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
