import { getContentFromResourceId } from "@/lib/actions/resources";

export async function GET (
  request: Request,
  params: { params: { id: string } }
) {
  const { id } = await params.params;

  const response = await getContentFromResourceId([id]);

  const content = response[0]?.content || "";

  return new Response(JSON.stringify({ content }), {
    status: 200,
  });
}