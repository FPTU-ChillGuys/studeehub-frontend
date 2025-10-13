import { createFlashcards } from "@/lib/actions/flashcard";
import { getContentFromResourceId } from "@/lib/actions/resources";
import { GenerateFlashcardsFromContent } from "@/lib/ai/chatbot/flashcard";


export async function POST(req : Request) {
    try {
        const { notebookId, resourceIds } : { notebookId : string , resourceIds : string | string[] } = await req.json();

        console.log("Resource IDs received in request:", resourceIds);

        const contents = await getContentFromResourceId(Array.isArray(resourceIds) ? resourceIds : [resourceIds]);
        const combinedContent = contents.map(c => c.content).join("\n\n");

        console.log("Combined content length:", combinedContent.length);

        const flashcardResponse = await GenerateFlashcardsFromContent(combinedContent);

        //Save flashcards to database
        await createFlashcards(notebookId, flashcardResponse.flashcards);

        return new Response(JSON.stringify({ success: true, flashcards: flashcardResponse }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (e) {
        console.error("Error processing request:", e);
    }
}