import { createFlashcards } from "@/lib/actions/flashcard";
import { getContentFromResourceId } from "@/lib/actions/resources";
import { GenerateFlashcardsFromContent } from "@/lib/ai/chatbot/flashcard";

export async function POST(req: Request) {
  try {
    const {
      notebookId,
      resourceIds,
    }: { notebookId: string; resourceIds: string | string[] } =
      await req.json();

    const contents = await getContentFromResourceId(
      Array.isArray(resourceIds) ? resourceIds : [resourceIds]
    );
    const combinedContent = contents.map((c) => c.content).join("\n\n");
    const flashcardResponse = await GenerateFlashcardsFromContent(
      combinedContent
    );

    //Save flashcards to database
    await createFlashcards(
      notebookId,
      flashcardResponse.title,
      flashcardResponse.decks
    );

    return new Response(JSON.stringify({ flashcards: flashcardResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error processing request:", e);
  }
}
