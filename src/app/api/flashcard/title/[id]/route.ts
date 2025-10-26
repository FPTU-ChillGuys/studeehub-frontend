import { updateFlashcardTitle } from "@/lib/actions/flashcard";

export async function PUT(request: Request, params: { params: { id: string } }) {
    const { id } = await params.params;
    const { title } = await request.json();

    const response = await updateFlashcardTitle(id, title);

    return new Response(
        JSON.stringify({}),
        { status: response.success ? 200 : 500 }
    );
}
