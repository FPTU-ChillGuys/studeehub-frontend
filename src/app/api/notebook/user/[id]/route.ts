import { getNotebooksByUserId } from "@/lib/actions/notebook";
import { getResourceCountByNotebookId } from "@/lib/actions/resources";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id: userId } = await params;

  //Get notebooks from database by userId
  const notebooksList = await getNotebooksByUserId(userId);

  const notebooksWithResourceCount = [];
  for (let i = 0; i < notebooksList!.length; i++) {
    const notebook = notebooksList![i];
    const resourceCount = await getResourceCountByNotebookId(notebook.id);
    console.log(`Notebook ID: ${notebook.id}, Resource Count: ${resourceCount}`);
    notebooksWithResourceCount.push({
      ...notebook,
      resourceCount
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      notebooks: notebooksWithResourceCount,
    }),
    { status: 200 }
  );
}