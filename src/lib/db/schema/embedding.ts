import { index, pgTable, varchar, vector } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { resources } from "./resource";

export const embeddings = pgTable(
  "embeddings",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),

    resourceId: varchar("resource_id").references(() => resources.id, {
      onDelete: "cascade",
    }),
    content: varchar("content").notNull(),
    embedding: vector("vector", { dimensions: 1536 }).notNull(),
  },
  (table) => [
    index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  ]
);
