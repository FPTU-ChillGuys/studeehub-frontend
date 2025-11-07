import { deleteNotebookById, editNotebookTitleById, getNotebookById } from "@/lib/actions/notebook";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string; }>; }) {
  const { id: notebookId } = await context.params;
  //Get notebooks from database by notebookId
  const notebook = await getNotebookById(notebookId);
  if (!notebook) {
    return new Response(JSON.stringify({ message: "Notebook not found" }), {
      status: 404,
    });
  }
  return new Response(JSON.stringify({ notebook }), { status: 200 });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string; }>; }) {
  const { id: notebookId } = await context.params;

  //Delete all notebooks associated with the userId
  await deleteNotebookById(notebookId);

  return new Response(
    JSON.stringify({
      message: "Notebook deleted successfully",
    }),
    { status: 200 }
  );
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string; }>; }) {
  const { id: notebookId } = await context.params;
  const { title }: { title: string; } = await req.json();
  console.log("PUT request received for notebookId:", notebookId, "with title:", title);
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
