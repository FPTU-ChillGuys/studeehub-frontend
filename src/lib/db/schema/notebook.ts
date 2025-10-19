import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { nanoid } from "nanoid";
import { z } from "zod";


export const notebooks = pgTable("notebooks", {
    id : varchar("id").$defaultFn(() => nanoid()).primaryKey(),
    title : varchar("title").notNull(),
    description: varchar("description").notNull().default(""),
    userId: varchar("user_id").notNull(),
    createdDate : timestamp("created_date").$defaultFn(() => new Date()).notNull(),
    updatedDate : timestamp("updated_date").$defaultFn(() => new Date()).notNull(),
    status : varchar("status").notNull().default("active"), // active, archived
    thumbnail : varchar("thumbnail").notNull().default("")
},
    (table) => [
        // You can define indexes here if needed
        index("notebooks_user_id_index").on(table.userId),
    ]
);


export const insertNotebookSchema = createInsertSchema(notebooks).extend({}).omit({id: true, createdDate: true, updatedDate: true, status: true, userId: true});
export type InsertNotebookParams = z.infer<typeof insertNotebookSchema>;