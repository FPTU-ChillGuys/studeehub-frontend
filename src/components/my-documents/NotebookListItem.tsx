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

interface NotebookListItemProps {
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

export const NotebookListItem = ({
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
}: NotebookListItemProps) => {
  return (
    <Link href={`/user/notebooks/${notebook.id}`}>
      <div className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="text-3xl">{notebook.thumbnail}</div>
          <div className="flex-1 min-w-0">
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
                className="font-semibold text-foreground mb-1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
            ) : (
              <h3 className="font-semibold text-foreground truncate">
                {notebook.title}
              </h3>
            )}
            {notebook.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                {notebook.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>{notebook.documentsCount} documents</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium">
                    {formatDate(notebook.lastModified)}
                  </span>
                  <span className="text-[10px]">
                    {formatDateToString(notebook.lastModified)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs rounded ${
                notebook.status === "active"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {notebook.status}
            </span>
            <DropdownMenu open={openDropdown} onOpenChange={onDropdownChange}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
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
        </div>
      </div>
    </Link>
  );
};
