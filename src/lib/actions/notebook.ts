import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import {
  InsertNotebookParams,
  insertNotebookSchema,
  notebooks,
} from "../db/schema/notebook";

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
    console.log("Notebook created with ID:", createdNotebook.id);

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
    return { success: true };
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error:", e.message);
      return { success: false };
    }
  }
};
