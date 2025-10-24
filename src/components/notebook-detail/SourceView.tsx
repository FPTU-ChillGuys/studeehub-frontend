import React from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document } from "@/Types";

interface SourceViewProps {
  document: Document;
  content: string;
  isLoading: boolean;
  onBack: () => void;
}

const SourceView: React.FC<SourceViewProps> = ({
  document,
  content,
  isLoading,
  onBack,
}) => {
  return (
    <div className="w-[23%] flex flex-col border-r border-border">
      {/* Source View Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold text-foreground">Source</h2>
        </div>
        <p
          className="text-sm text-muted-foreground truncate"
          title={document.name}
        >
          {document.name}
        </p>
      </div>

      {/* Source Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap break-words text-xs bg-muted p-4 rounded-lg">
              {content || "No content available"}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SourceView;
