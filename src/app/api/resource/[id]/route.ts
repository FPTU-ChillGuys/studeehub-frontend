import { deleteResourceById } from "@/lib/actions/resources";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string; }>; }) {
  const { id } = await context.params;

  const response = await deleteResourceById(id);
  
  return new Response(JSON.stringify({}), {
    status: response.success ? 200 : 500,
  });
}
