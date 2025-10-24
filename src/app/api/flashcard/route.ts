import { FlashcardOptions } from "@/components/modals/CustomiseFlashcardModal";
import { createFlashcards } from "@/lib/actions/flashcard";
import { getContentFromResourceId } from "@/lib/actions/resources";
import { GenerateFlashcardsFromContent } from "@/lib/ai/chatbot/flashcard";

export async function POST(req: Request) {
  try {
    const {
      notebookId,
      resourceIds,
      options,
    }: {
      notebookId: string;
      resourceIds: string | string[];
      options: FlashcardOptions;
    } = await req.json();

    const flashcardOptions = options || {
      numberOfCards: "Medium",
      difficulty: "Medium",
      topic: "General",
    };

    const contents = await getContentFromResourceId(
      Array.isArray(resourceIds) ? resourceIds : [resourceIds]
    );
    const combinedContent = contents.map((c) => c.content).join("\n\n");
    const flashcardResponse = await GenerateFlashcardsFromContent(
      combinedContent,
      flashcardOptions
    );

    //Save flashcards to database
    const createFlashcardsResponse = await createFlashcards(
      notebookId,
      flashcardResponse.title,
      flashcardResponse.decks
    );

    return new Response(JSON.stringify({ flashcards: { id: createFlashcardsResponse?.flashcardId , ...flashcardResponse } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error processing request:", e);
  }
}
