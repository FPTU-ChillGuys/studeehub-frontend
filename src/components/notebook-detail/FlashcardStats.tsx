import React from "react";

interface FlashcardStatsProps {
  deckId: string;
  totalCards: number;
}

const FlashcardStats: React.FC<FlashcardStatsProps> = ({ totalCards }) => {
  return (
    <div className="text-xs text-muted-foreground">
      {totalCards} {totalCards === 1 ? 'card' : 'cards'}
    </div>
  );
};

export default FlashcardStats;
