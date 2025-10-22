import { count, eq, inArray } from "drizzle-orm";
import { generateEmbeddings } from "../ai/chatbot/embedding";
import { db } from "../db";
import { embeddings } from "../db/schema/embedding";
import { InsertResourceParams, insertResourceSchema, resources } from "../db/schema/resource";


export const createResource = async (notebookId: string, input: InsertResourceParams) => {
  try {

    //Check validation
    const { content , fileName, type, url } = insertResourceSchema.parse(input);

    // Append the file name to the content
    const inputWithFileName =  content + `\n\nSource: ${fileName}`;

    //Tach input khoan 1000 từ 1 array
    const inputChunks = inputWithFileName.match(/(.|[\r\n]){1,1000}/g) || [];

    // Generate embeddings for the contents
    const embeddingResult: Array<{ embedding: number[]; content: string }> = [];
    for (const contentChunk of inputChunks) {
      const embedding = await generateEmbeddings(contentChunk);
      for (const emb of embedding) {
        embeddingResult.push(emb);
      }
    }
    
    // Insert resource into the database
    const [resource] = await db
      .insert(resources)
      .values({ content: inputWithFileName, notebookId, fileName, type, url })
      .returning();

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

export const getContentFromResourceId = async (resourceIds:  string[]) => {
  try {
    const resourceList = await db
      .select({
        content: resources.content,
      })
      .from(resources)
      .where(inArray(resources.id, resourceIds));
    return resourceList;
  } catch (e) {
    console.error("Error fetching resource content:", e);
    return [];
  }
};

export const deleteResourceById = async (resourceId: string) => {
  try {
    await db.delete(resources).where(eq(resources.id, resourceId));
    return { success: true };
  }
  catch (e) {
    console.error("Error deleting resource:", e);
    return { success: false };
  }
};

export const getResourceCountByNotebookId = async (notebookId: string) => {
  try {
    const countResult = await db.select({
      count : count(resources.id)
    })
    .from(resources)
    .where(eq(resources.notebookId, notebookId))

    return countResult[0].count;
  }
  catch (e) {
    console.error("Error counting resources:", e);
    return 0;
  }
};
