import React from "react";
import useStateRef from "react-usestateref";
import "react-quizlet-flashcard/dist/index.css";
import { Deck } from "@/Types";
import { FlashcardArray, FlashcardArrayProps, IFlashcard } from "react-quizlet-flashcard";
import { Button } from "../ui/button";


interface FlashcardsPanelProps {
  onSetDecks: (decks : IFlashcard[]) => void;
}

const FlashcardsPanel: React.FC<FlashcardsPanelProps> = ({
  onSetDecks,
}) => {
  const [decks, setDecks, decksRef] = useStateRef<IFlashcard[]>([]);
 

  return (
    <div className="w-[20%] flex flex-col">
      <FlashcardArray deck={decksRef.current} />
      <Button onClick={() => setDecks([])}>Clear Deck</Button>
      <Button onClick={() => onSetDecks(decksRef.current)}>Create Deck</Button>
    </div>
  );
};

export default FlashcardsPanel;
