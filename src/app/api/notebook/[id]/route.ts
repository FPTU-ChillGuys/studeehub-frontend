import {
  deleteNotebookById,
  getNotebookById,
} from "@/lib/actions/notebook";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id: notebookId } = await params;
  //Get notebooks from database by notebookId
  const notebook = await getNotebookById(notebookId);
  if (!notebook) {
    return new Response(
      JSON.stringify({ success : false, message: "Notebook not found" }),
      { status: 404 }
    );
  }
  return new Response(JSON.stringify({ success: true, notebook }), { status: 200 });
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id: notebookId } = await params;

  //Delete all notebooks associated with the userId
  await deleteNotebookById(notebookId);

  return new Response(
    JSON.stringify({
      success: true,
    }),
    { status: 200 }
  );
}
