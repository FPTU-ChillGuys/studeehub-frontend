import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, Plus, Trash2 } from "lucide-react";
import { EditableCard, FlashcardDeck } from "@/Types";

interface EditFlashcardProps {
  deck: FlashcardDeck;
  onSave: (updatedDeck: FlashcardDeck) => void;
  onCancel: () => void;
  isExpanded?: boolean;
}

const EditFlashcard: React.FC<EditFlashcardProps> = ({
  deck,
  onSave,
  onCancel,
  isExpanded = false,
}) => {
  const [title, setTitle] = useState(deck.title);
  const [cards, setCards] = useState<EditableCard[]>(
    deck.cards.map((card, index) => ({
      id: index,
      front: extractTextFromHtml(card.front.html),
      back: extractTextFromHtml(card.back.html),
    }))
  );

  // Helper function to extract text from React element
  function extractTextFromHtml(htmlElement: any): string {
    if (typeof htmlElement === "string") return htmlElement;
    if (!htmlElement) return "";
    
    // If it's a React element, try to extract text from children
    if (htmlElement.props && htmlElement.props.children) {
      const children = htmlElement.props.children;
      if (typeof children === "string") return children;
      if (Array.isArray(children)) {
        return children.map(child => 
          typeof child === "string" ? child : extractTextFromHtml(child)
        ).join("");
      }
    }
    
    return "";
  }

  const handleAddCard = () => {
    const newId = Math.max(...cards.map(c => c.id), 0) + 1;
    setCards([
      ...cards,
      {
        id: newId,
        front: "",
        back: "",
      },
    ]);
  };

  const handleDeleteCard = (id: number) => {
    if (cards.length <= 1) return; // Không cho xóa nếu chỉ còn 1 card
    setCards(cards.filter((card) => card.id !== id));
  };

  const handleUpdateCard = (id: number, field: "front" | "back", value: string) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  const handleSave = () => {
    const updatedDeck: FlashcardDeck = {
      ...deck,
      title,
      cards: cards.map((card, index) => ({
        id: index.toString(),
        front: {
          html: (
            <div className="flex items-center justify-center h-full w-full p-6">
              {card.front}
            </div>
          ),
        },
        back: {
          html: (
            <div className="flex items-center justify-center h-full w-full p-6">
              {card.back}
            </div>
          ),
        },
      })),
      cardCount: cards.length,
    };
    onSave(updatedDeck);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Edit Flashcard Deck</h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Title input */}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Deck title"
          className="text-lg font-medium"
        />
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="border border-border rounded-lg p-4 bg-card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">
                Card {index + 1}
              </span>
              {cards.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCard(card.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Layout responsive: hàng ngang khi expanded, dọc khi không */}
            <div className={`grid gap-4 ${isExpanded ? "grid-cols-2" : "grid-cols-1"}`}>
              {/* Front */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Front (Term)
                </label>
                <Textarea
                  value={card.front}
                  onChange={(e) =>
                    handleUpdateCard(card.id, "front", e.target.value)
                  }
                  placeholder="Enter term..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Back */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Back (Definition)
                </label>
                <Textarea
                  value={card.back}
                  onChange={(e) =>
                    handleUpdateCard(card.id, "back", e.target.value)
                  }
                  placeholder="Enter definition..."
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add card button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleAddCard}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Card
        </Button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditFlashcard;
