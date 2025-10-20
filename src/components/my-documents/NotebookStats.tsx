import { BookOpen, FileText } from "lucide-react";

interface NotebookStatsProps {
  total: number;
  active: number;
  totalDocuments: number;
}

export const NotebookStats = ({
  total,
  active,
  totalDocuments,
}: NotebookStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 truncate">
              Total Notebooks
            </p>
            <p className="text-xl font-bold text-foreground">{total}</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 ml-2">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 truncate">
              Active
            </p>
            <p className="text-xl font-bold text-foreground">{active}</p>
          </div>
          <div className="p-2 bg-green-500/10 rounded-lg flex-shrink-0 ml-2">
            <BookOpen className="w-5 h-5 text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 truncate">
              Documents
            </p>
            <p className="text-xl font-bold text-foreground">
              {totalDocuments}
            </p>
          </div>
          <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0 ml-2">
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
