import { deleteFlashcardById, getFlashcardsByNotebookId, updateFlashcardDeck, updateFlashcardTitle } from "@/lib/actions/flashcard";

export async function GET(request: Request, params: { params: { id: string } }) {
    const { id } = await params.params;

    const response = await getFlashcardsByNotebookId(id);

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
            flashcards: flashcardsList,
        }),
        { status: 200 }
    );

}

export async function DELETE(request: Request, params: { params: { id: string } }) {
    const { id } = await params.params;

    const response = await deleteFlashcardById(id);

    return new Response(
        JSON.stringify({}),
        { status: response.success ? 200 : 500 }
    );
}



export async function PUT (request: Request, params: { params: { id: string } }) {
    const { id } = await params.params;
    const { updatePayload } = await request.json();

    console.log("Updating flashcard deck with id:", id);
    console.log("New flashcard data:", updatePayload);

    // Call API to update flashcard deck
    const responseUpdateCard = await updateFlashcardDeck(id, updatePayload.cards.map((card: any) => ({
        front: card.front,
        back: card.back,
    })));

    const responseUpdateTitle = await updateFlashcardTitle(id, updatePayload.title);

    console.log("Response from updating flashcard deck:", responseUpdateCard);
    console.log("Response from updating flashcard title:", responseUpdateTitle);

    if (!responseUpdateCard.success) {
        console.error("Failed to update flashcard deck");
        return new Response("Failed to update flashcard deck", { status: 500 });
    }

    console.log("Flashcard deck updated successfully");
    return new Response("Flashcard deck updated successfully", { status: 200 });
}
