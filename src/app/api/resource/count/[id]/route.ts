import { getResourceCountByNotebookId } from "@/lib/actions/resources";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string; }>; }) {
    const { id } = await context.params;

    //Get resource count from database by notebookId
    const resourceCount = await getResourceCountByNotebookId(id);

    return new Response(
        JSON.stringify({
            count: resourceCount,
        }),
        { status: 200 }
    );
}