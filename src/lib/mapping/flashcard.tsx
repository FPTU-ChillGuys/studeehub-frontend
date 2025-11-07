import { FlashcardDeck } from "@/Types";
import React from "react";

export interface FlashcardCardApiResponse {
  front: string;
  back: string;
}

export interface FlashcardDeckApiResponse {
  id: string;
  title: string;
  cardCount?: number;
  cards: FlashcardCardApiResponse[];
  decks?: FlashcardCardApiResponse[]; // Some APIs use 'decks' instead of 'cards'
}

export interface FlashcardGenerateApiResponse {
  id?: string;
  title: string;
  decks: FlashcardCardApiResponse[];
}

export const ConvertApiToFlashcardDeck = (data: FlashcardDeckApiResponse): FlashcardDeck => {
  const cardsList = data.cards || data.decks || [];
  
  return {
    id: data.id,
    title: data.title,
    cardCount: data.cardCount || cardsList.length,
    cards: cardsList.map((card, index) => ({
      id: index.toString(),
      front: {
        html: (
          <div className="flex items-center justify-center h-full w-full p-6">
            {card.front || "No content"}
          </div>
        ),
      },
      back: {
        html: (
          <div className="flex items-center justify-center h-full w-full p-6">
            {card.back || "No content"}
          </div>
        ),
      },
    })),
  };
};

export const ConvertGeneratedFlashcardToFlashcardDeck = (
  data: FlashcardGenerateApiResponse,
  generatedId?: string
): FlashcardDeck => {
  return {
    id: data.id || generatedId || Date.now().toString(),
    title: data.title,
    cardCount: data.decks?.length || 0,
    cards: data.decks?.map((fc, index) => ({
      id: index.toString(),
      front: {
        html: (
          <div className="flex items-center justify-center h-full w-full p-6">
            {fc.front}
          </div>
        ),
      },
      back: {
        html: (
          <div className="flex items-center justify-center h-full w-full p-6">
            {fc.back}
          </div>
        ),
      },
    })) || [],
  };
};

export const ConvertApiToFlashcardDecks = (dataArray: FlashcardDeckApiResponse[]): FlashcardDeck[] => {
  return dataArray.map(ConvertApiToFlashcardDeck);
};

// Helper to extract text from FlashcardDeck for API updates
export const ConvertFlashcardDeckToApi = (deck: FlashcardDeck) => {
  return {
    title: deck.title,
    cards: deck.cards.map((card) => ({
      front: extractTextFromReactElement(card.front.html),
      back: extractTextFromReactElement(card.back.html),
    })),
  };
};

// Helper function to extract text from React elements
function extractTextFromReactElement(element: any): string {
  if (typeof element === "string") return element;
  if (!element) return "";

  // If it's a React element
  if (React.isValidElement(element)) {
    const props = element.props as any;
    if (props && props.children) {
      if (typeof props.children === "string") return props.children;
      if (Array.isArray(props.children)) {
        return props.children
          .map((child: any) => extractTextFromReactElement(child))
          .join("");
      }
      return extractTextFromReactElement(props.children);
    }
  }

  return "";
}
