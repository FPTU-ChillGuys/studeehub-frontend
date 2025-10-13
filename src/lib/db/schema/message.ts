import { generateId, UIMessage } from "ai";
import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable(
  "messages",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    notebookId: varchar("notebook_id").notNull(),
    createdAt: timestamp("created_at")
      .notNull()
      .$defaultFn(() => new Date()),
    text: varchar("text").notNull(),
    // Define role as 'user' | 'assistant' | 'system'
    role: varchar("role").$type<UIMessage["role"]>().notNull(),
  },
  (table) => [
    index("messages_notebook_id_idx").on(table.notebookId),
    index("messages_notebook_id_created_at_idx").on(
      table.notebookId,
      table.createdAt
    ),
  ]
);

export const insertMessageSchema = createInsertSchema(messages)
  .extend({})
  .omit({ createdAt: true });
export type InsertMessageParams = z.infer<typeof insertMessageSchema>;
