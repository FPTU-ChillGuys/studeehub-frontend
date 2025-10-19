import { deleteResourceById } from "@/lib/actions/resources";


export async function DELETE(request: Request, params: { params: { id: string } }) {
    const { id } = await params.params;

    const response  = await deleteResourceById(id);
    
    return new Response(
        JSON.stringify({
            success: response.success,
        }),
        { status: response.success ? 200 : 500 }
    );
}

