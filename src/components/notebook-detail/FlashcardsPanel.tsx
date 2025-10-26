import React, { useEffect } from "react";
import { FlashcardDeck } from "@/Types";
import { FlashcardOptions } from "../modals/CustomiseFlashcardModal";
import useStateRef from "react-usestateref";
import FlashcardsList from "./FlashcardsList";
import FlashcardDetail from "./FlashcardDetail";
import EditFlashcard from "./EditFlashcard";

interface FlashcardsPanelProps {
  onGenerateFlashcards: () => void;
  flashcards: FlashcardDeck[];
  setFlashcards: React.Dispatch<React.SetStateAction<FlashcardDeck[]>>;
  isDisabled?: boolean;
  onDeleteDeck?: (deckId: string) => void;
  onGenerateCustomFlashcards?: (options: FlashcardOptions) => void;
  onUpdateDeckTitle?: (deckId: string, newTitle: string) => void;
  onUpdateDeck?: (deckId: string, updatedDeck: FlashcardDeck) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isOtherPanelExpanded?: boolean;
}

const FlashcardsPanel: React.FC<FlashcardsPanelProps> = ({
  onGenerateFlashcards,
  flashcards,
  setFlashcards,
  isDisabled,
  onDeleteDeck,
  onGenerateCustomFlashcards,
  onUpdateDeckTitle,
  onUpdateDeck,
  isExpanded = false,
  onToggleExpand,
  isCollapsed = false,
  onToggleCollapse,
  isOtherPanelExpanded = false,
}) => {
  const [view, setView] = useStateRef<"list" | "detail" | "edit">("list");
  const [selectedDeck, setSelectedDeck] = useStateRef<FlashcardDeck | null>(
    null
  );

  const handleDeckClick = (deck: FlashcardDeck) => {
    // If collapsed, expand first then show detail
    if (isCollapsed && onToggleCollapse) {
      onToggleCollapse();
    }
    setSelectedDeck(deck);
    setView("detail");
  };

  const handleEditDeck = (deck: FlashcardDeck) => {
    setSelectedDeck(deck);
    setView("edit");
  };

  const handleSaveEdit = (updatedDeck: FlashcardDeck) => {
    if (onUpdateDeck && selectedDeck) {
      onUpdateDeck(selectedDeck.id, updatedDeck);
      // Update selectedDeck với deck mới để Detail/Practice mode nhận được data mới
      setSelectedDeck(updatedDeck);
    }
    setView("detail");
  };

  const handleCancelEdit = () => {
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
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        isOtherPanelExpanded={isOtherPanelExpanded}
      />
    );
  }

  // Edit View
  if (view === "edit" && selectedDeck) {
    // Get latest deck from flashcards array
    const currentDeck = flashcards.find(d => d.id === selectedDeck.id) || selectedDeck;
    return (
      <EditFlashcard
        deck={currentDeck}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      />
    );
  }

  // Detail View - Luôn lấy deck mới nhất từ flashcards array
  if (selectedDeck) {
    const currentDeck = flashcards.find(d => d.id === selectedDeck.id) || selectedDeck;
    return (
      <FlashcardDetail
        key={selectedDeck.id} // Force remount khi chọn deck khác
        deck={currentDeck}
        onBackToList={handleBackToList}
        onEditDeck={handleEditDeck}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        isOtherPanelExpanded={isOtherPanelExpanded}
      />
    );
  }
  
  return null;
};

export default FlashcardsPanel;
