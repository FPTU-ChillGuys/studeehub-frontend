import { Loader2 } from "lucide-react";

export const LoadingNotebookDetail = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] w-full">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">
        Loading Notebook...
      </h3>
      <p className="text-sm text-muted-foreground">
        Please wait while we prepare your workspace
      </p>
    </div>
  );
};
