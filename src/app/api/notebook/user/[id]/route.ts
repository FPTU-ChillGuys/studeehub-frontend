import { getNotebooksByUserId } from "@/lib/actions/notebook";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id: userId } = await params;

  //Get notebooks from database by userId
  const notebooksList = await getNotebooksByUserId(userId);

  return new Response(
    JSON.stringify({
      success: true,
      notebooks: notebooksList,
    }),
    { status: 200 }
  );
}