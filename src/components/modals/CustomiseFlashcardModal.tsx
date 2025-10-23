import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, X } from "lucide-react";

interface CustomiseFlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: FlashcardOptions) => void;
}

export interface FlashcardOptions {
  numberOfCards: "fewer" | "standard" | "more";
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

const CustomiseFlashcardModal: React.FC<CustomiseFlashcardModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [numberOfCards, setNumberOfCards] = useState<"fewer" | "standard" | "more">("standard");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [topic, setTopic] = useState("");

  const handleGenerate = () => {
    onGenerate({
      numberOfCards,
      difficulty,
      topic,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[600px] max-h-[90vh] bg-background border border-border rounded-lg shadow-lg overflow-hidden mx-4">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-xl font-semibold text-foreground">
                Customise flashcards
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Number of cards */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Number of cards
            </label>
            <div className="flex gap-3">
              <Button
                variant={numberOfCards === "fewer" ? "default" : "outline"}
                onClick={() => setNumberOfCards("fewer")}
                className="flex-1"
              >
                Fewer
              </Button>
              <Button
                variant={numberOfCards === "standard" ? "default" : "outline"}
                onClick={() => setNumberOfCards("standard")}
                className="flex-1"
              >
                Standard (default)
              </Button>
              <Button
                variant={numberOfCards === "more" ? "default" : "outline"}
                onClick={() => setNumberOfCards("more")}
                className="flex-1"
              >
                More
              </Button>
            </div>
          </div>

          {/* Level of difficulty */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Level of difficulty
            </label>
            <div className="flex gap-3">
              <Button
                variant={difficulty === "easy" ? "default" : "outline"}
                onClick={() => setDifficulty("easy")}
                className="flex-1"
              >
                Easy
              </Button>
              <Button
                variant={difficulty === "medium" ? "default" : "outline"}
                onClick={() => setDifficulty("medium")}
                className="flex-1"
              >
                Medium (default)
              </Button>
              <Button
                variant={difficulty === "hard" ? "default" : "outline"}
                onClick={() => setDifficulty("hard")}
                className="flex-1"
              >
                Hard
              </Button>
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              What should the topic be?
            </label>
            <div className="relative">
              <Textarea
                placeholder="Things to try&#10;• The flashcards must be restricted to a specific source (e.g. 'the article about Italy')&#10;• The flashcards must focus on a specific topic like 'Newton's second law'&#10;• The card fronts must be short (1–5 words) for memorisation"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="min-h-[120px] resize-none border-primary focus:border-primary pr-10"
                style={{
                  borderWidth: "2px",
                }}
              />
              <div className="absolute top-3 right-3 pointer-events-none">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Generate Button */}
        <div className="p-6 border-t border-border bg-muted/50">
          <Button
            onClick={handleGenerate}
            className="w-full"
            size="lg"
          >
            Generate
          </Button>
        </div>
      </div>
    </>
  );
};

export default CustomiseFlashcardModal;
