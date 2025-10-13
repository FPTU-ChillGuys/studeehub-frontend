import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  deck,
  flashcard,
  InsertDeckParams,
  insertDeckSchema,
} from "../db/schema/flashcard";

export const createFlashcards = async (
  notebookId: string,
  inputDeckSchema: InsertDeckParams[]
) => {
  try {
    const validatedDecks = inputDeckSchema.map(deck => insertDeckSchema.parse({
      ...deck,
      notebookId,
    }));

    const [flashcards] = await db
      .insert(flashcard)
      .values({
        notebookId: notebookId,
      })
      .returning();

    const [decks] = await db
      .insert(deck)
      .values(validatedDecks.map(deck => ({
        flashcardId: flashcards.id,
        front: deck.front,
        back: deck.back,
      })))
      .returning();

    return {
      success: true,
      flashcardId: flashcards.id,
      deckId: decks.id,
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
    const flashcardsList = await db
      .select()
      .from(flashcard)
      .leftJoin(deck, eq(flashcard.id, deck.flashcardId))
      .where(eq(flashcard.notebookId, notebookId));

    return flashcardsList;
  } catch (e) {
    console.error("Error fetching flashcards:", e);
    return [];
  }
};
