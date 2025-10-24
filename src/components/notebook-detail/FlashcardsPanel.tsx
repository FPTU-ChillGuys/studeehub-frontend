import React, { useState } from "react";
import { FlashcardDeck } from "@/Types";
import { FlashcardOptions } from "../modals/CustomiseFlashcardModal";
import useStateRef from "react-usestateref";
import FlashcardsList from "./FlashcardsList";
import FlashcardDetail from "./FlashcardDetail";

interface FlashcardsPanelProps {
  onGenerateFlashcards: () => void;
  flashcards: FlashcardDeck[];
  setFlashcards: React.Dispatch<React.SetStateAction<FlashcardDeck[]>>;
  isDisabled?: boolean;
  onDeleteDeck?: (deckId: string) => void;
  onGenerateCustomFlashcards?: (options: FlashcardOptions) => void;
  onUpdateDeckTitle?: (deckId: string, newTitle: string) => void;
}

const FlashcardsPanel: React.FC<FlashcardsPanelProps> = ({
  onGenerateFlashcards,
  flashcards,
  setFlashcards,
  isDisabled,
  onDeleteDeck,
  onGenerateCustomFlashcards,
  onUpdateDeckTitle,
}) => {
  const [view, setView] = useStateRef<"list" | "detail">("list");
  const [selectedDeck, setSelectedDeck] = useStateRef<FlashcardDeck | null>(null);

  const handleDeckClick = (deck: FlashcardDeck) => {
    setSelectedDeck(deck);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedDeck(null);
  };

  // List View
  if (view === "list") {
    return (
      <FlashcardsList
        flashcards={flashcards}
        setFlashcards={setFlashcards}
        isDisabled={isDisabled}
        onDeckClick={handleDeckClick}
        onGenerateFlashcards={onGenerateFlashcards}
        onDeleteDeck={onDeleteDeck}
        onGenerateCustomFlashcards={onGenerateCustomFlashcards}
        onUpdateDeckTitle={onUpdateDeckTitle}
      />
    );
  }

  // Detail View - Component mới sẽ unmount/remount khi selectedDeck thay đổi
  return selectedDeck ? (
    <FlashcardDetail
      key={selectedDeck.id} // Force remount khi chọn deck khác
      deck={selectedDeck}
      onBackToList={handleBackToList}
    />
  ) : null;
};

export default FlashcardsPanel;
