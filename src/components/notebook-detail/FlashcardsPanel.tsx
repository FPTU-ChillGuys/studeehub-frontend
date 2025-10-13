import React, { useState } from "react";
import "react-quizlet-flashcard/dist/index.css";
import { FlashcardArray, IFlashcard } from "react-quizlet-flashcard";
import { Button } from "../ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";

interface FlashcardsPanelProps {
  onSetDecks: () => void;
  onClearDecks: () => void;
  decks: IFlashcard[];
}

interface FlashcardDeck {
  id: string;
  title: string;
  createdAt: string;
  cardCount: number;
  cards: IFlashcard[];
}

const FlashcardsPanel: React.FC<FlashcardsPanelProps> = ({
  onSetDecks,
}) => {
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  
  // Sample flashcard decks - replace with real data later
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>([
    {
      id: "1",
      title: "Philosophy Basics",
      createdAt: "2024-10-10",
      cardCount: 5,
      cards: [
        {
          front: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-lg font-medium">What is Dialectical Materialism?</p>
              </div>
            )
          },
          back: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-base">A philosophical approach that views matter as the fundamental substance in nature, and mind or consciousness as the result of material processes.</p>
              </div>
            )
          }
        },
        {
          front: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-lg font-medium">Who developed the concept of Dialectical Materialism?</p>
              </div>
            )
          },
          back: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-base">Karl Marx and Friedrich Engels developed this philosophical framework in the 19th century.</p>
              </div>
            )
          }
        },
        {
          front: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-lg font-medium">What are the three laws of dialectics?</p>
              </div>
            )
          },
          back: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-base">1. Unity and conflict of opposites<br/>2. Transformation of quantity into quality<br/>3. Negation of negation</p>
              </div>
            )
          }
        },
        {
          front: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-lg font-medium">What is materialism in philosophy?</p>
              </div>
            )
          },
          back: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-base">Materialism is the philosophical view that all phenomena, including mental states and consciousness, can be explained by material causes and processes.</p>
              </div>
            )
          }
        },
        {
          front: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-lg font-medium">What is the difference between dialectics and metaphysics?</p>
              </div>
            )
          },
          back: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-base">Dialectics views things in motion and change, considering their internal contradictions. Metaphysics views things as static and unchanging.</p>
              </div>
            )
          }
        }
      ]
    },
    {
      id: "2",
      title: "Historical Context",
      createdAt: "2024-10-12",
      cardCount: 3,
      cards: [
        {
          front: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-lg font-medium">When was The Communist Manifesto published?</p>
              </div>
            )
          },
          back: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-base">The Communist Manifesto was published in 1848.</p>
              </div>
            )
          }
        },
        {
          front: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-lg font-medium">What historical period influenced Marx&apos;s work?</p>
              </div>
            )
          },
          back: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-base">The Industrial Revolution and its social consequences greatly influenced Marx&apos;s philosophical and economic theories.</p>
              </div>
            )
          }
        },
        {
          front: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-lg font-medium">What is historical materialism?</p>
              </div>
            )
          },
          back: {
            html: (
              <div className="flex items-center justify-center h-full w-full p-6">
                <p className="text-center text-base">Historical materialism is the application of dialectical materialism to the study of society and history, emphasizing economic factors as the driving force of social change.</p>
              </div>
            )
          }
        }
      ]
    }
  ]);

  const handleDeckClick = (deck: FlashcardDeck) => {
    setSelectedDeck(deck);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedDeck(null);
  };

  const handleDeleteDeck = (deckId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlashcardDecks(flashcardDecks.filter(deck => deck.id !== deckId));
  };

  const handleGenerateFlashcards = () => {
    onSetDecks();
  };

  // List View
  if (view === "list") {
    return (
      <div className="w-[30%] flex flex-col border-l border-border overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Flashcards
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your flashcard decks
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Deck List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {flashcardDecks.length > 0 ? (
              flashcardDecks.map((deck) => (
                <div
                  key={deck.id}
                  onClick={() => handleDeckClick(deck)}
                  className="p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">
                        {deck.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {deck.cardCount} cards
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created: {deck.createdAt}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteDeck(deck.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-destructive/10 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
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
          <div className="p-4 border-t border-border">
            <Button 
              onClick={handleGenerateFlashcards} 
              className="w-full"
            >
              Generate Flashcards
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Detail View
  return (
    <div className="w-[30%] flex flex-col border-l border-border overflow-hidden">
      {/* Header with Back Button */}
      <div className="p-4 border-b border-border bg-card">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {selectedDeck?.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {selectedDeck?.cardCount} cards
          </p>
        </div>
      </div>

      {/* Flashcard Display */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-auto">
        {selectedDeck && selectedDeck.cards.length > 0 && (
          <div >
            <FlashcardArray className="max-w-80" deck={selectedDeck.cards} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardsPanel;
