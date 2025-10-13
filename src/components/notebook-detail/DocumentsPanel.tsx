import React from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document } from "@/Types";
import DocumentCard from "./DocumentCard";
import DocumentSearch from "./DocumentSearch";

interface DocumentsPanelProps {
  documents: Document[];
  selectedDocuments: Set<string>;
  onToggleDocument: (docId: string, selected: boolean) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setIsUploadModalOpen: (open: boolean) => void;
  getFileIcon: (type: string) => React.ReactNode;
  completedDocsCount: number;
}

const DocumentsPanel: React.FC<DocumentsPanelProps> = ({
  documents,
  selectedDocuments,
  onToggleDocument,
  onSelectAll,
  onClearSelection,
  searchTerm,
  setSearchTerm,
  setIsUploadModalOpen,
  getFileIcon,
  completedDocsCount,
}) => {
  return (
    <div className="w-[23%] flex flex-col">
      {/* Documents Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Documents
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage documents within this notebook
            </p>
          </div>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2"
            size="sm"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Selected Documents Info */}
      <div className="px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {selectedDocuments.size > 0
              ? `${selectedDocuments.size} documents selected for chat`
              : "Select documents to chat with AI"}
          </p>
          {completedDocsCount > 0 && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={onSelectAll}
              >
                Select All
              </Button>
              {selectedDocuments.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={onClearSelection}
                >
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <DocumentSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              isSelected={selectedDocuments.has(doc.id)}
              onToggleSelect={onToggleDocument}
              getFileIcon={getFileIcon}
            />
          ))}
        </div>

        {documents.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm
                ? "No matching documents found"
                : "No documents in this notebook yet"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-4"
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload first document
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPanel;
