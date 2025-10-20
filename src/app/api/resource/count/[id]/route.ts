import { getResourceCountByNotebookId } from "@/lib/actions/resources";

export async function GET(request: Request, params: { params: { id: string } }) {
    const { id } = await params.params;

    //Get resource count from database by notebookId
    const resourceCount = await getResourceCountByNotebookId(id);

    return new Response(
        JSON.stringify({
            count: resourceCount,
        }),
        { status: 200 }
    );
}