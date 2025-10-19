import { Loader2 } from "lucide-react";

export const LoadingNotebooks = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">
        Loading your Notebooks...
      </h3>
      <p className="text-sm text-muted-foreground">
        Please wait while we fetch your notebooks
      </p>
    </div>
  );
};
