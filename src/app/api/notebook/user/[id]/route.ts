import { getNotebooksByUserId } from "@/lib/actions/notebook";
import { getResourceCountByNotebookId } from "@/lib/actions/resources";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string; }>; }) {
  const { id: userId } = await context.params;

  //Get notebooks from database by userId
  const notebooksList = await getNotebooksByUserId(userId);

  const notebooksWithResourceCount = [];
  for (let i = 0; i < notebooksList!.length; i++) {
    const notebook = notebooksList![i];
    const resourceCount = await getResourceCountByNotebookId(notebook.id);
    notebooksWithResourceCount.push({
      ...notebook,
      resourceCount
    });
  }

  return new Response(
    JSON.stringify({
      notebooks: notebooksWithResourceCount,
    }),
    { status: 200 }
  );
}