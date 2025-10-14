import { getFlashcardsByNotebookId } from "@/lib/actions/flashcard";

export async function GET(request: Request, params: { params: { notebookId: string } }) {
    const { notebookId } = await params.params;

    const response = await getFlashcardsByNotebookId(notebookId);

    const flashcardsList  = response.map((flashcard) => {
        return {
            id : flashcard.id,
            title : flashcard.title || "Untitled",
            cardCount : flashcard.cards.length,
            cards : flashcard.cards || [],
        }
    });

    return new Response(
        JSON.stringify({
            success: true,
            flashcards: flashcardsList,
        }),
        { status: 200 }
    );

}