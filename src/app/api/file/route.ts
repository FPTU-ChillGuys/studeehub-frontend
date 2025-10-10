import { getResourcesByNotebookId } from "@/lib/actions/resources";


export async function GET(req: Request) {
    const { notebookId } = await req.json();

    //Get resources from database by notebookId
    const resourcesList = await getResourcesByNotebookId(notebookId);

    return new Response(
        JSON.stringify({
            success: true,
            resources: resourcesList,
        }),
        { status: 200 }
    );
}