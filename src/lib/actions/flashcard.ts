import { eq, inArray } from "drizzle-orm";
import { db } from "../db";
import {
  decks,
  flashcard,
  InsertDeckParams,
  insertDeckSchema,
} from "../db/schema/flashcard";

export const createFlashcards = async (
  notebookId: string,
  title: string,
  inputDeckSchema: InsertDeckParams[]
) => {
  try {
    const validatedDecks = inputDeckSchema.map((deck) =>
      insertDeckSchema.parse({
        ...deck,
        notebookId,
      })
    );

    const [flashcards] = await db
      .insert(flashcard)
      .values({
        notebookId: notebookId,
        title: title,
      })
      .returning();

    const [deckList] = await db
      .insert(decks)
      .values(
        validatedDecks.map((deck) => ({
          flashcardId: flashcards.id,
          front: deck.front,
          back: deck.back,
        }))
      )
      .returning();

    return {
      success: true,
      flashcardId: flashcards.id,
      deckId: deckList.id,
    };
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error:", e.message);
      return { success: false };
    }
  }
};

export const getFlashcardsByNotebookId = async (notebookId: string) => {
  try {
    // Fetch flashcards and their associated decks in a single query
    const flashcardList = await db
      .select()
      .from(flashcard)
      .where(eq(flashcard.notebookId, notebookId));

    // Get all decks associated with the fetched flashcards
    const DeckList = await db
      .select()
      .from(decks)
      .where(
        inArray(
          decks.flashcardId,
          flashcardList.map((f) => f.id)
        )
      );

    // Map decks to their corresponding flashcards
    const flashcardsListWithDecks = flashcardList.map((flashcardItem) => {
      return {
        id: flashcardItem.id,
        title: flashcardItem.title,
        cards: DeckList.filter(
          (deckItem) => deckItem.flashcardId === flashcardItem.id
        ).map((deckItem) => {
          return {
            front: deckItem.front,
            back: deckItem.back,
          };
        }),
      };
    });

    return flashcardsListWithDecks;
  } catch (e) {
    console.error("Error fetching flashcards:", e);
    return [];
  }
};

export const deleteFlashcardById = async (flashcardId: string) => {
  try {
    // Delete decks associated with the flashcard
    await db.delete(flashcard).where(eq(flashcard.id, flashcardId));

    return { success: true };
  } catch (e) {
    console.error("Error deleting flashcard:", e);
    return { success: false };
  }
};

export const updateFlashcardTitle = async (
  flashcardId: string,
  newTitle: string
) => {
  try {
    await db
      .update(flashcard)
      .set({ title: newTitle })
      .where(eq(flashcard.id, flashcardId));
    return { success: true };
  } catch (e) {
    console.error("Error updating flashcard title:", e);
    return { success: false };
  }
};

export const updateFlashcardDeck = async (
  flashcardId: string,
  cards: { front: string; back: string }[]
) => {
  try {
    // First, delete existing decks for the flashcard
    await db.delete(decks).where(eq(decks.flashcardId, flashcardId));

    // Then, insert the updated decks
    await db.insert(decks).values(
      cards.map((card) => ({
        flashcardId: flashcardId,
        front: card.front,
        back: card.back,
      }))
    );

    return { success: true };
  } catch (e) {
    console.error("Error updating flashcard deck:", e);
    return { success: false };
  }
};
