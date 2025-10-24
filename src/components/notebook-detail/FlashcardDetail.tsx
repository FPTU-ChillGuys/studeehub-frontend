import React, { useState } from "react";
import "react-quizlet-flashcard/dist/index.css";
import { FlashcardArray, useFlashcardArray } from "react-quizlet-flashcard";
import { Button } from "../ui/button";
import { ArrowLeft, RotateCcw, Zap } from "lucide-react";
import { FlashcardDeck } from "@/Types";
import PracticeMode from "./PracticeMode";

interface FlashcardDetailProps {
  deck: FlashcardDeck;
  onBackToList: () => void;
}

const FlashcardDetail: React.FC<FlashcardDetailProps> = ({
  deck,
  onBackToList,
}) => {
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  
  // Hook được khởi tạo mới mỗi khi component mount
  const flipArrayHook = useFlashcardArray({
    deckLength: deck.cards?.length || 0,
    showCount: false,
    showControls: true,
    cycle: false,
  });

  // If in practice mode, show practice component
  if (isPracticeMode) {
    return (
      <PracticeMode 
        deck={deck} 
        onBackToDetail={() => setIsPracticeMode(false)} 
      />
    );
  }

  return (
    <div className="w-[27%] flex flex-col border-l border-border overflow-hidden">
      {/* Header with Back Button */}
      <div className="p-4 border-b border-border bg-card">
        <button
          onClick={onBackToList}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </button>
        <h2 className="text-lg font-semibold text-foreground mb-1">
          {deck.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {deck.cardCount} cards
        </p>
      </div>

      {/* Flashcard Display */}
      {deck.cards && deck.cards.length > 0 && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-auto">
            <FlashcardArray
              className="max-w-80"
              deck={deck.cards}
              flipArrayHook={flipArrayHook}
            />
          </div>

          {/* Custom Controls */}
          <div className="p-4 border-t border-border bg-card space-y-3">
            {/* Progress */}
            <div className="text-center text-sm text-muted-foreground">
              Card {flipArrayHook.currentCard + 1} of {deck.cards.length}
            </div>

            {/* Practice Mode Button */}
            <Button
              onClick={() => setIsPracticeMode(true)}
              className="w-full"
              variant="default"
            >
              <Zap className="w-4 h-4 mr-2" />
              Practice Mode
            </Button>

            {/* Reset Button */}
            <Button
              onClick={() => {
                // Reset to first card by going back to card 0
                // while (flipArrayHook.currentCard > 0) {
                // }
                flipArrayHook.setCurrentCard(0);

              }}
              variant="outline"
              className="w-full"
              disabled={flipArrayHook.currentCard === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to First Card
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardDetail;
