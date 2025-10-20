import { createNotebook } from "@/lib/actions/notebook";


export async function POST (req: Request) {
    try {
        const { title, userId, description, thumbnail }: { title: string; userId: string; description?: string; thumbnail?: string } = await req.json();

        // Create a new notebook in the database
        const newNotebook = await createNotebook(userId,{
            title,
            description,
            thumbnail
        });

        return new Response(
            JSON.stringify({
                notebook: newNotebook
            }),
            { status: 201 }
        );
    } catch (e) {
        console.error("Error processing request:", e);
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );
    }
}