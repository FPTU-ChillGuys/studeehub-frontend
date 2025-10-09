import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorDisplayProps {
  error?: string | string[] | null;
  className?: string;
}

export function ErrorDisplay({ error, className }: ErrorDisplayProps) {
  if (!error) return null;

  const errors = Array.isArray(error) ? error : [error];
  
  return (
    <div 
      className={cn(
        "p-3 bg-destructive/10 border border-destructive/30 text-destructive dark:text-destructive-foreground text-sm rounded-md space-y-1",
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          {errors.map((err, i) => (
            <div key={i} className="leading-tight">
              {err}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
