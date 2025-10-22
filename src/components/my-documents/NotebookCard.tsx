import Link from "next/link";
import { MoreVertical, Calendar, Edit, Trash2 } from "lucide-react";
import { Notebook } from "@/Types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatDateToString } from "@/lib/utils";

interface NotebookCardProps {
  notebook: Notebook;
  isEditing: boolean;
  editTitle: string;
  onEditTitleChange: (value: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  openDropdown: boolean;
  onDropdownChange: (open: boolean) => void;
}

export const NotebookCard = ({
  notebook,
  isEditing,
  editTitle,
  onEditTitleChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  openDropdown,
  onDropdownChange,
}: NotebookCardProps) => {
  return (
    <Link href={`/user/notebooks/${notebook.id}`}   >
      <div className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-all duration-200 cursor-pointer group min-h-[240px] flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="text-4xl">{notebook.thumbnail}</div>
          <DropdownMenu open={openDropdown} onOpenChange={onDropdownChange}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onStartEdit();
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit title
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1 flex flex-col">
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => onEditTitleChange(e.target.value)}
              onBlur={onSaveEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSaveEdit();
                } else if (e.key === "Escape") {
                  onCancelEdit();
                }
              }}
              autoFocus
              className="font-semibold text-foreground mb-2 text-lg"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          ) : (
            <h3
              className="font-semibold text-foreground mb-2 text-lg leading-tight line-clamp-2"
              title={notebook.title}
            >
              {notebook.title}
            </h3>
          )}

          {notebook.description && (
            <p className="text-base text-muted-foreground mb-3 line-clamp-2 flex-1">
              {notebook.description}
            </p>
          )}

          <div className="space-y-2.5 mt-auto">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Documents:</span>
              <span className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded text-sm font-medium">
                {notebook.documentsCount}
              </span>
            </div>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-medium">
                  {formatDate(notebook.lastModified)}
                </span>
              </div>
              <span className="pl-4 text-xs">
                {formatDateToString(notebook.lastModified)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
