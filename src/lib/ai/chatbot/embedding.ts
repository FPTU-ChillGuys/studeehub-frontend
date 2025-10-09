import { embed, embedMany } from "ai";
import { embeddingModel } from "./model/ollama";
import { cosineDistance, desc, gt, sql, and, eq } from "drizzle-orm";
import { embeddings } from "@/lib/db/schema/embedding";
import { db } from "@/lib/db";

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: { query: string; resourceId: string | string[] }) => {
    const userQueryEmbedded = await generateEmbedding(userQuery.query);
    const similarity = sql<number>`${cosineDistance(
        embeddings.embedding,
        userQueryEmbedded,
    )}`;
    
    const resourceIds = Array.isArray(userQuery.resourceId) 
        ? userQuery.resourceId 
        : [userQuery.resourceId];
    
    const similarGuides = await db
        .select({ name: embeddings.content, similarity })
        .from(embeddings)
        .where(and(
            sql`${embeddings.resourceId} IN ${resourceIds}`,
            gt(similarity, 0.5)
        ))
        .orderBy(t => desc(t.similarity))
        .limit(200);
    return similarGuides;
};