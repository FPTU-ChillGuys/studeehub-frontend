import { asc, eq } from "drizzle-orm";
import { db } from "../db";
import { InsertMessageParams, insertMessageSchema, messages } from "../db/schema/message";


export const createMessage = async (notebookId : string, message: InsertMessageParams) => {

    const validatedMessage = insertMessageSchema.parse({...message, notebookId});

    const [createdMessage] = await db
        .insert(messages)
        .values({
            notebookId: notebookId,
            text: validatedMessage.text,
            role: validatedMessage.role as "user" | "assistant" | "system",
        })
        .returning();

    console.log("Message created with ID:", createdMessage.id);

    return createdMessage;
}

export const getMessagesByNotebookId = async (notebookId: string) => {
    const messagesList = await db
        .select()
        .from(messages)
        .where(eq(messages.notebookId, notebookId))
        .orderBy(asc(messages.createdAt));

    return messagesList;
}