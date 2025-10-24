import React from "react";
import { Calendar, Eye, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document } from "@/Types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentCardProps {
  doc: Document;
  isSelected: boolean;
  onToggleSelect: (docId: string, selected: boolean) => void;
  getFileIcon: (type: string) => React.ReactNode;
  handleDeleteResource: (docId: string) => void;
  handleViewSource: (doc: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  doc,
  isSelected,
  onToggleSelect,
  getFileIcon,
  handleDeleteResource,
  handleViewSource,
}) => {

  return (
    <div
      className={`bg-card border rounded-lg p-4 hover:shadow-sm transition-all ${
        isSelected ? "border-primary bg-primary/5" : "border-border"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="flex items-center pt-1">
          <input
            type="checkbox"
            id={`doc-${doc.id}`}
            checked={isSelected}
            onChange={(e) => onToggleSelect(doc.id, e.target.checked)}
            disabled={doc.status !== "completed"}
            className="w-4 h-4 text-primary border-2 border-border rounded focus:ring-2 focus:ring-primary focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* File Icon */}
        <div className="p-2 bg-primary/10 rounded-lg">
          {getFileIcon(doc.type)}
        </div>

        {/* Document Info */}
        <div className="flex-1 min-w-0">
          <label
            htmlFor={`doc-${doc.id}`}
            className="font-medium text-foreground truncate cursor-pointer block"
            title={doc.name}
          >
            {doc.name}
          </label>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>{doc.type}</span>
            <span>•</span>
            <span>{doc.size}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{doc.uploadDate}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`px-2 py-1 text-xs rounded ${
                doc.status === "completed"
                  ? "bg-green-500/10 text-green-500"
                  : doc.status === "processing"
                  ? "bg-yellow-500/10 text-yellow-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {doc.status === "completed"
                ? "Processed"
                : doc.status === "processing"
                ? "Processing"
                : "Error"}
            </span>
            {doc.questionsGenerated && doc.questionsGenerated > 0 && (
              <span className="text-xs text-muted-foreground">
                {doc.questionsGenerated} questions
              </span>
            )}
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                disabled={doc.status !== "completed"}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewSource(doc)}>
                <Eye className="w-4 h-4 mr-2" />
                View Source
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteResource(doc.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
