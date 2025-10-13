import { createMessage, getMessagesByNotebookId } from "@/lib/actions/message";
import { messageUIToDB } from "@/lib/mapping/message";

//Load existing chat messages 
export async function GET(_req: Request, props : { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id: notebookId } = params;

    if (!notebookId) {
        console.error("Missing notebookId parameter in request");
        return new Response(
            JSON.stringify({
                success: false,
                error: "Missing notebookId parameter",
            }),
            { status: 400 }
        );
    }

    // Fetch messages from the database
    const messages = await getMessagesByNotebookId(notebookId);

    return new Response(
        JSON.stringify({
            success: true,
            data: messages,
        }),
        { status: 200 }
    );
}

export const POST = async (req: Request, props : { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    const { id: notebookId } = params;

    if (!notebookId) {
        console.error("Missing notebookId parameter in request");
        return new Response(
            JSON.stringify({
                success: false,
                error: "Missing notebookId parameter",
            }),
            { status: 400 }
        );
    }

    // Handle message sending logic here
    const { lastMessage } = await req.json();

    //Save last message to database
    //Convert to InsertMessageParams type
    const convertedMessage = messageUIToDB(notebookId, lastMessage);
    await createMessage(notebookId, convertedMessage);

    return new Response(
        JSON.stringify({
            success: true,
            data: lastMessage,
        }),
        { status: 200 }
    );
}