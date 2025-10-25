import React from "react";
import { Button } from "../ui/button";
import {
  Settings2,
  MoreVertical,
  Edit,
  Trash2,
  Maximize2,
  Minimize2,
  Square,
  ChevronRight,
} from "lucide-react";
import { FlashcardDeck } from "@/Types";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CollapsedPanelBar, { CollapsedItem } from "./CollapsedPanelBar";
import useStateRef from "react-usestateref";
import CustomiseFlashcardModal, {
  FlashcardOptions,
} from "../modals/CustomiseFlashcardModal";

interface FlashcardsListProps {
  flashcards: FlashcardDeck[];
  setFlashcards: React.Dispatch<React.SetStateAction<FlashcardDeck[]>>;
  isDisabled?: boolean;
  onDeckClick: (deck: FlashcardDeck) => void;
  onGenerateFlashcards: () => void;
  onDeleteDeck?: (deckId: string) => void;
  onGenerateCustomFlashcards?: (options: FlashcardOptions) => void;
  onUpdateDeckTitle?: (deckId: string, newTitle: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isOtherPanelExpanded?: boolean;
}

const FlashcardsList: React.FC<FlashcardsListProps> = ({
  flashcards,
  setFlashcards,
  isDisabled,
  onDeckClick,
  onGenerateFlashcards,
  onDeleteDeck,
  onGenerateCustomFlashcards,
  onUpdateDeckTitle,
  isExpanded = false,
  onToggleExpand,
  isCollapsed = false,
  onToggleCollapse,
  isOtherPanelExpanded = false,
}) => {
  const [isCustomiseModalOpen, setIsCustomiseModalOpen] = useStateRef(false);
  const [editingDeckId, setEditingDeckId] = useStateRef<string | null>(null);
  const [editingTitle, setEditingTitle, editingTitleRef] = useStateRef("");
  const [openDropdownId, setOpenDropdownId] = useStateRef<string | null>(null);

  const handleDeleteDeck = (deckId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (deckId && onDeleteDeck) onDeleteDeck(deckId);
    setFlashcards(flashcards.filter((deck) => deck.id !== deckId));
    setOpenDropdownId(null);
  };

  const handleEditDeck = (deck: FlashcardDeck, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setEditingDeckId(deck.id);
    setEditingTitle(deck.title);
    setOpenDropdownId(null);
  };

  const handleSaveTitle = (deckId: string) => {
    if (editingTitle.trim() === "") {
      setEditingDeckId(null);
      return;
    }

    // Update local state
    setFlashcards(
      flashcards.map((deck) =>
        deck.id === deckId ? { ...deck, title: editingTitle } : deck
      )
    );

    // Call parent callback for backend update
    if (onUpdateDeckTitle) {
      onUpdateDeckTitle(deckId, editingTitle);
    }

    setEditingDeckId(null);
  };

  const handleCancelEdit = () => {
    setEditingDeckId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, deckId: string) => {
    if (e.key === "Enter") {
      handleSaveTitle(deckId);
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleBlur = (deckId: string) => {
    handleSaveTitle(deckId);
  };

  const handleCustomiseFlashcards = (options: FlashcardOptions) => {
    if (onGenerateCustomFlashcards) {
      onGenerateCustomFlashcards(options);
    }
  };

  // Collapsed view - show only flashcard icons
  const collapsedItems: CollapsedItem[] = flashcards.map((deck) => ({
    id: deck.id,
    icon: Square,
    label: deck.title,
    subtitle: `${deck.cardCount} cards`,
    onClick: () => onDeckClick(deck),
  }));

  if (isCollapsed) {
    return (
      <div className="w-16 flex flex-col border-l border-border h-full bg-card ml-auto transition-all duration-300">
        <CollapsedPanelBar
          items={collapsedItems}
          side="right"
          onExpand={onToggleCollapse!}
          expandLabel="Expand Flashcards"
        />
      </div>
    );
  }

  return (
    <div
      className={`${
        isExpanded 
          ? "absolute inset-0 w-full z-50 bg-background" 
          : "w-[27%]"
      } ${
        isOtherPanelExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } flex flex-col border-l border-border overflow-hidden h-full transition-all duration-300 ml-auto`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-foreground">Flashcards</h2>
          <div className="flex items-center gap-1">
            {onToggleCollapse && !isExpanded && (
              <Button
                onClick={onToggleCollapse}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Collapse"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
            {onToggleExpand && (
              <Button
                onClick={onToggleExpand}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your flashcard decks
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Deck List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {flashcards.length > 0 ? (
            flashcards.map((deck) => (
              <div
                key={deck.id}
                onClick={() => {
                  if (editingDeckId !== deck.id) {
                    onDeckClick(deck);
                  }
                }}
                className="p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 mr-2">
                    {editingDeckId === deck.id ? (
                      <Input
                        value={editingTitleRef.current}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, deck.id)}
                        onBlur={() => handleBlur(deck.id)}
                        autoFocus
                        className="font-medium mb-1 h-8"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      />
                    ) : (
                      <h3 className="font-medium text-foreground mb-1 truncate">
                        {deck.title}
                      </h3>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {deck.cardCount} cards
                    </p>
                  </div>

                  <DropdownMenu
                    open={openDropdownId === deck.id}
                    onOpenChange={(open) =>
                      setOpenDropdownId(open ? deck.id : null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={(e) => handleEditDeck(deck, e)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit title
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteDeck(deck.id, e)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                <span className="text-3xl">🃏</span>
              </div>
              <h3 className="font-medium text-foreground mb-2">
                No flashcards yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate your first flashcard deck to get started
              </p>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <div className="p-4 border-t border-border space-y-2">
          <Button
            onClick={onGenerateFlashcards}
            className="w-full"
            disabled={isDisabled}
          >
            Generate Flashcards
          </Button>
          <Button
            onClick={() => setIsCustomiseModalOpen(true)}
            variant="outline"
            className="w-full"
            disabled={isDisabled}
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Customise
          </Button>
        </div>
      </div>

      {/* Customise Flashcard Modal */}
      <CustomiseFlashcardModal
        isOpen={isCustomiseModalOpen}
        onClose={() => setIsCustomiseModalOpen(false)}
        onGenerate={handleCustomiseFlashcards}
      />
    </div>
  );
};

export default FlashcardsList;
