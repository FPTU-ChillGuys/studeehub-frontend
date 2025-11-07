import { updateFlashcardTitle } from "@/lib/actions/flashcard";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string; }>; }) {
    const { id } = await context.params;
    const { title } = await request.json();

    const response = await updateFlashcardTitle(id, title);

    return new Response(
        JSON.stringify({}),
        { status: response.success ? 200 : 500 }
    );
}
