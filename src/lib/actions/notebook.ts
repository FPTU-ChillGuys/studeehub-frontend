import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import {
  InsertNotebookParams,
  insertNotebookSchema,
  notebooks,
} from "../db/schema/notebook";
import { flashcard } from "../db/schema/flashcard";
import { resources } from "../db/schema/resource";
import { messages } from "../db/schema/message";

export const createNotebook = async (
  userId: string,
  data: InsertNotebookParams
) => {
  try {
    const validatedNotebook = insertNotebookSchema.parse({ ...data, userId });

    const [createdNotebook] = await db
      .insert(notebooks)
      .values({
        title: validatedNotebook.title,
        description: validatedNotebook.description || "",
        userId: userId,
        thumbnail: validatedNotebook.thumbnail || "",
      })
      .returning();

    return createdNotebook;
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error:", e.message);
      return null;
    }
  }
};

export const getNotebooksByUserId = async (userId: string) => {
  try {
    const notebooksList = await db
      .select()
      .from(notebooks)
      .where(eq(notebooks.userId, userId))
      .orderBy(desc(notebooks.createdDate));
    return notebooksList;
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error:", e.message);
      return [];
    }
  }
};

export const getNotebookById = async (notebookId: string) => {
  try {
    const [notebook] = await db
      .select()
      .from(notebooks)
      .where(eq(notebooks.id, notebookId));
    return notebook;
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error:", e.message);
      return null;
    }
  }
};

export const deleteNotebookById = async (notebookId: string) => {
  try {
    await db.delete(notebooks).where(eq(notebooks.id, notebookId));
    //Delete flashcard
    await db.delete(flashcard).where(eq(flashcard.notebookId, notebookId));
    //Delete resources
    await db.delete(resources).where(eq(resources.notebookId, notebookId));
    //Delete messages and related data if needed (not implemented here)
    await db.delete(messages).where(eq(messages.notebookId, notebookId));
    return { success: true };
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error:", e.message);
      return { success: false };
    }
  }
};

export const editNotebookTitleById = async (notebookId : string, title: string) => {
  try {
    const [updatedNotebook] = await db
      .update(notebooks)
      .set({ title , updatedDate: new Date() })
      .where(eq(notebooks.id, notebookId))
      .returning();
    return { success: true, notebook: updatedNotebook };
  } catch (e) { 
    if (e instanceof Error) {
      console.error("Error:", e.message);
      return { success: false };
    }
  }
}
