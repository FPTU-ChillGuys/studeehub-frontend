import { boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { nanoid } from 'nanoid'

export const resources = pgTable("resources", {
    id: varchar("id").primaryKey().$defaultFn(() => nanoid()).notNull(),
    fileName : varchar("file_name").notNull(),
    url: varchar("url").notNull(),
    type: varchar("type").notNull(),
    content : varchar("content").notNull(),
    createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
    updatedAt: timestamp("updated_at")
        .notNull()
        .$defaultFn(() => new Date()),
    isActive: boolean("is_active").notNull().default(true),
});

export const insertResourceSchema = createInsertSchema(resources).extend({}).omit({id: true, createdAt: true, updatedAt: true, isActive: true});
export type InsertResourceParams = z.infer<typeof insertResourceSchema>;