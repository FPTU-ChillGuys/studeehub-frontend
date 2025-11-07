import { getContentFromResourceId } from "@/lib/actions/resources";
import { NextRequest } from "next/server";

export async function GET (request: NextRequest, context: { params: Promise<{ id: string; }>; }) {
  const { id } = await context.params;

  const response = await getContentFromResourceId([id]);

  const content = response[0]?.content || "";

  return new Response(JSON.stringify({ content }), {
    status: 200,
  });
}