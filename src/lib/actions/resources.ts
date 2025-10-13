import { eq } from "drizzle-orm";
import { generateEmbeddings } from "../ai/chatbot/embedding";
import { db } from "../db";
import { embeddings } from "../db/schema/embedding";
import { InsertResourceParams, insertResourceSchema, resources } from "../db/schema/resource";


export const createResource = async (notebookId: string, input: InsertResourceParams) => {
  try {

    //Check validation
    const { content , fileName, type, url } = insertResourceSchema.parse(input);

    console.log("Inserting resource into database...");

    // Append the file name to the content
    const inputWithFileName =  content + `\n\nSource: ${fileName}`;

    // Insert resource into the database
    const [resource] = await db
      .insert(resources)
      .values({ content: inputWithFileName, notebookId, fileName, type, url })
      .returning();

    console.log("Resource inserted with ID:", resource.id);

    // Generate embeddings for the content
    const embeddingResult = await generateEmbeddings(content);
    console.log("Generated embeddings count:", embeddingResult.length);

    // Insert embeddings into the database
    if (embeddingResult.length > 0) {
      await db.insert(embeddings).values(
        embeddingResult.map((embedding) => ({
          resourceId: resource.id,
          content: embedding.content ?? "",
          embedding: embedding.embedding ?? [],
        }))
      );
    }

    console.log("Resource and embeddings created with ID:", resource.id);

    return { success: true, resourceId: resource.id };
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error:", e.message);
      return { success: false };
    }
  }
};

export const getResourcesByNotebookId = async (notebookId: string) => {
  try {
    const resourcesList = await db
      .select({
        id: resources.id,
        fileName: resources.fileName,
        type: resources.type,
        url: resources.url,
      })
      .from(resources)
      .where(eq(resources.notebookId, notebookId));
    return resourcesList;
  } catch (e) {
    console.error("Error fetching resources:", e);
    return [];
  }
};
