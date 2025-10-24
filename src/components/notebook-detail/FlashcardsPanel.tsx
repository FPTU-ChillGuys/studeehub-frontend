import React from "react";
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
  isExpanded = false,
  onToggleExpand,
  isCollapsed = false,
  onToggleCollapse,
  isOtherPanelExpanded = false,
}) => {
  const [view, setView] = useStateRef<"list" | "detail">("list");
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

  // Detail View - Component mới sẽ unmount/remount khi selectedDeck thay đổi
  return selectedDeck ? (
    <FlashcardDetail
      key={selectedDeck.id} // Force remount khi chọn deck khác
      deck={selectedDeck}
      onBackToList={handleBackToList}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      isOtherPanelExpanded={isOtherPanelExpanded}
    />
  ) : null;
};

export default FlashcardsPanel;
