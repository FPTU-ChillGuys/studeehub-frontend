import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { nanoid } from "nanoid";
import { z } from "zod";



export const flashcard = pgTable("flashcards", { 
    id : varchar("id").primaryKey().$defaultFn(() => nanoid()),
    notebookId: varchar("notebook_id").notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull()
});

export const deck = pgTable("deck", {
    id : varchar("id").primaryKey().$defaultFn(() => nanoid()),
    flashcardId: varchar("flashcard_id").references(() => flashcard.id, {
        onDelete: "cascade"
    }),
    front : varchar("front").notNull(),
    back : varchar("back").notNull()
});

export const insertFlashcardSchema = createInsertSchema(flashcard).extend({}).omit({id: true, createdAt: true, updatedAt: true, notebookId: true});
export type InsertFlashcardParams = z.infer<typeof insertFlashcardSchema>;

export const insertDeckSchema = createInsertSchema(deck).extend({}).omit({id: true, flashcardId: true});
export type InsertDeckParams = z.infer<typeof insertDeckSchema>;