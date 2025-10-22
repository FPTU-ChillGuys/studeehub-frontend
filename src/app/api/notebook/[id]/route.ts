import { deleteNotebookById, editNotebookTitleById, getNotebookById } from "@/lib/actions/notebook";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id: notebookId } = await params;
  //Get notebooks from database by notebookId
  const notebook = await getNotebookById(notebookId);
  if (!notebook) {
    return new Response(JSON.stringify({ message: "Notebook not found" }), {
      status: 404,
    });
  }
  return new Response(JSON.stringify({ notebook }), { status: 200 });
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
      message: "Notebook deleted successfully",
    }),
    { status: 200 }
  );
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id: notebookId } = await params;
  const { title }: { title: string; description?: string; thumbnail?: string } = await req.json();
  // Update notebook in the database
  const updatedNotebook = await editNotebookTitleById(notebookId, title);
  if (!updatedNotebook) {
    return new Response(
      JSON.stringify({ message: "Failed to update notebook" }),
      { status: 500 }
    );
  }
  return new Response(
    JSON.stringify({ notebook: updatedNotebook }),
    { status: 200 }
  );
}
