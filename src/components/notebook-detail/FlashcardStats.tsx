import React from "react";
import { Award, TrendingUp } from "lucide-react";
import { getDeckStatistics } from "@/lib/flashcardMastery";
import { Badge } from "../ui/badge";

interface FlashcardStatsProps {
  deckId: string;
}

const FlashcardStats: React.FC<FlashcardStatsProps> = ({ deckId }) => {
  const stats = getDeckStatistics(deckId);

  if (stats.totalReviews === 0) {
    return null; // Don't show stats if no practice yet
  }

  return (
    <div className="mt-2 pt-2 border-t border-border space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground flex items-center gap-1">
          <Award className="w-3 h-3" />
          Mastered:
        </span>
        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
          {stats.mastered}/{stats.totalCards}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Accuracy:
        </span>
        <span className="font-medium text-blue-600">{stats.accuracy}%</span>
      </div>
    </div>
  );
};

export default FlashcardStats;
