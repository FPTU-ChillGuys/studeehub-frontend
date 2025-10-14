import { createFlashcards, getFlashcardsByNotebookId } from "@/lib/actions/flashcard";
import { getContentFromResourceId } from "@/lib/actions/resources";
import { GenerateFlashcardsFromContent } from "@/lib/ai/chatbot/flashcard";
import { FlashcardDeck } from "@/Types";


export async function POST(req : Request) {
    try {
        const { notebookId, resourceIds } : { notebookId : string , resourceIds : string | string[] } = await req.json();

        console.log("Resource IDs received in request:", resourceIds);

        const contents = await getContentFromResourceId(Array.isArray(resourceIds) ? resourceIds : [resourceIds]);
        const combinedContent = contents.map(c => c.content).join("\n\n");

        console.log("Combined content length:", combinedContent.length);

        const flashcardResponse = await GenerateFlashcardsFromContent(combinedContent);

        //Save flashcards to database
        await createFlashcards(notebookId, flashcardResponse.title, flashcardResponse.flashcards);

        return new Response(JSON.stringify({ success: true, flashcards: flashcardResponse }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (e) {
        console.error("Error processing request:", e);
    }
}

export async function GET(params : { params: { notebookId: string } }) {
    const { notebookId } = await params.params;

    const response = await getFlashcardsByNotebookId(notebookId);

    const flashcardsList  = response.map((flashcard) => {
        return {
            id : flashcard.flashcard.id,
            title : flashcard.flashcard.title,
            cardCount : response.filter(f => f.flashcard.id === flashcard.flashcard.id).length,
            cards : response.filter(f => f.flashcard.id === flashcard.flashcard.id).map(f => ({
                front : f.decks?.front || "" ,
                back : f.decks?.back || "",
            })) 
        }
    })

    return new Response(
        JSON.stringify({
            success: true,
            flashcards: flashcardsList,
        }),
        { status: 200 }
    );

}