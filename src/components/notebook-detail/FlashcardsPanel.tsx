import React from "react";
import "react-quizlet-flashcard/dist/index.css";
import { FlashcardArray, IFlashcard } from "react-quizlet-flashcard";
import { Button } from "../ui/button";

interface FlashcardsPanelProps {
  onSetDecks: () => void;
  onClearDecks: () => void;
  decks: IFlashcard[];
}

const FlashcardsPanel: React.FC<FlashcardsPanelProps> = ({
  onSetDecks,
  onClearDecks,
  decks,
}) => {
  return (
    <>
      <div className="w-[30%] flex flex-col p-6 border-l border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Flashcard
              </h2>
                <p className="text-sm text-muted-foreground">
                  Manage documents within this notebook
                </p>
              </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 overflow-auto px-4">
          {decks?.length > 0 && (
            <div>
              <FlashcardArray deck={decks} className="max-w-80" />
            </div>
          )}
          <div className="flex flex-col gap-2 w-full max-w-80">
            <Button onClick={() => onClearDecks()}>Clear Deck</Button>
            <Button onClick={() => onSetDecks()}>Create Deck</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlashcardsPanel;
