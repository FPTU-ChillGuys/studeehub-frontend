import React from "react";
import { Upload, FileText, ArrowLeft, Maximize2, Minimize2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document } from "@/Types";
import DocumentCard from "./DocumentCard";
import DocumentSearch from "./DocumentSearch";
import SourceView from "./SourceView";
import Link from "next/link";
import CollapsedPanelBar, { CollapsedItem } from "./CollapsedPanelBar";

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
  handleDeleteResource: (docId: string) => void;
  handleViewSource: (doc: Document) => void;
  viewingDocument: Document | null;
  documentContent: string;
  isLoadingContent: boolean;
  handleBackFromSource: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isOtherPanelExpanded?: boolean;
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
  handleDeleteResource,
  handleViewSource,
  viewingDocument,
  documentContent,
  isLoadingContent,
  handleBackFromSource,
  isExpanded = false,
  onToggleExpand,
  isCollapsed = false,
  onToggleCollapse,
  isOtherPanelExpanded = false,
}) => {
  // If viewing a document, show source view
  if (viewingDocument) {
    return (
      <SourceView
        document={viewingDocument}
        content={documentContent}
        isLoading={isLoadingContent}
        onBack={handleBackFromSource}
      />
    );
  }

  // Collapsed view - show only icons
  const collapsedItems: CollapsedItem[] = documents.map((doc) => ({
    id: doc.id,
    icon: FileText,
    label: doc.name,
  }));

  if (isCollapsed) {
    return (
      <div className="w-16 flex flex-col border-r border-border h-full bg-card transition-all duration-300">
        <CollapsedPanelBar
          items={collapsedItems}
          side="left"
          onExpand={onToggleCollapse!}
          expandLabel="Expand Documents"
        />
      </div>
    );
  }

  return (
    <div className={`${
      isExpanded 
        ? 'absolute inset-0 w-full z-50 bg-background' 
        : 'w-[23%]'
    } ${
      isOtherPanelExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
    } flex flex-col border-r border-border h-full transition-all duration-300`}>
      {/* Documents Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3 mb-3">
          <Link href="/user/my-documents">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">Documents</h2>
          </div>
          {onToggleCollapse && !isExpanded && (
            <Button
              onClick={onToggleCollapse}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Collapse"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
          {onToggleExpand && (
            <Button
              onClick={onToggleExpand}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title={isExpanded ? "Minimize" : "Maximize"}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          )}
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2"
            size="sm"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage documents within this notebook
        </p>
      </div>

      {/* Selected Documents Info */}
      <div className="px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {selectedDocuments.size > 0
              ? `${selectedDocuments.size} documents selected for chat`
              : "Select documents to chat with AI and generate flashcards"}
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
              handleDeleteResource={handleDeleteResource}
              handleViewSource={handleViewSource}
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
