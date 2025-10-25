import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = React.memo(({ content }) => {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={{
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
          <h1 className="text-lg font-bold mb-2 mt-3" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold mb-2 mt-3" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold mb-1 mt-2" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
            {children}
          </h3>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-2">
            <table className="min-w-full border-collapse border border-border">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-muted">
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody>
            {children}
          </tbody>
        ),
        tr: ({ children }) => (
          <tr className="border-b border-border">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="border border-border px-3 py-2 text-left font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border px-3 py-2">
            {children}
          </td>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 italic my-2 text-muted-foreground">
            {children}
          </blockquote>
        ),
        hr: () => (
          <hr className="my-4 border-border" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
});

MarkdownContent.displayName = "MarkdownContent";
