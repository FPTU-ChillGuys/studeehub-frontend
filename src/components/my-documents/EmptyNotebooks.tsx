import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyNotebooksProps {
  hasFilters: boolean;
  onCreateClick?: () => void;
}

export const EmptyNotebooks = ({
  hasFilters,
  onCreateClick,
}: EmptyNotebooksProps) => {
  return (
    <div className="text-center py-12">
      <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">
        No notebooks found
      </h3>
      <p className="text-muted-foreground mb-4">
        {hasFilters
          ? "Try changing your filters or search terms"
          : "You don't have any notebooks yet"}
      </p>
      {onCreateClick && (
        <Button onClick={onCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          Create your first notebook
        </Button>
      )}
    </div>
  );
};
