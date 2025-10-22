import { embed, embedMany } from "ai";
import { cosineDistance, desc, gt, sql, and, eq } from "drizzle-orm";
import { embeddings } from "@/lib/db/schema/embedding";
import { db } from "@/lib/db";
import { gptEmbedding } from "./model/openai";
import { geminiEmbedding } from "./model/google";

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

// Generate embeddings for multiple pieces of text
export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: gptEmbedding,
    values: chunks,
    providerOptions: {
      openai: {
        serviceTier: "flex",
      },
    },
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

// Generate embedding for a single piece of text
export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: gptEmbedding,
    value: input,
    providerOptions: {
      openai: {
        serviceTier: "flex",
      },
    },
  });
  return embedding;
};

// Find relevant content based on user query and resource IDs
export const findRelevantContent = async (userQuery: {
  query: string;
  resourceIds: string | string[];
}) => {
  const userQueryEmbedded = await generateEmbedding(userQuery.query);
  const similarity = sql<number>`${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded
  )}`;

  if (
    !userQuery.resourceIds ||
    (Array.isArray(userQuery.resourceIds) && userQuery.resourceIds.length === 0)
  ) {
    return [];
  }

  const resourceIds = Array.isArray(userQuery.resourceIds)
    ? userQuery.resourceIds
    : [userQuery.resourceIds];

  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(
      and(sql`${embeddings.resourceId} IN ${resourceIds}`, gt(similarity, 0.5))
    )
    .orderBy((t) => desc(t.similarity))
    .limit(200);

  return similarGuides;
};
