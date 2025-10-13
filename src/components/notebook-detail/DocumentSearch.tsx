import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DocumentSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="p-4 border-b border-border">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search documents..."
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default DocumentSearch;
