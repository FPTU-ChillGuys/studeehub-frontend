import { getResourcesByNotebookId } from "@/lib/actions/resources";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest, context: { params: Promise<{ notebookId: string; }>}) {
    const { notebookId } = await context.params;

    //Get resources from database by notebookId
    const resourcesList = await getResourcesByNotebookId(notebookId);

    return new Response(
        JSON.stringify({
            resources: resourcesList,
        }),
        { status: 200 }
    );
}