import { createResource } from "@/lib/actions/resources";
import { PdfBufferToText } from "@/lib/pdf";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    //Get files from form data
    const files = formData.getAll("files") as File[];
    if (files.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No files uploaded" }),
        { status: 400 }
      );
    }

    //Get resourceId from form data
    const resourceId = formData.get("resourceId") as string;
    if (!resourceId) {
      return new Response(
        JSON.stringify({ success: false, message: "No resourceId provided" }),
        { status: 400 }
      );
    }

    //Get file names from form data
    const fileNames = files.map((file) => file.name);

    //Get buffers from files
    const fileBuffers = await Promise.all(
      files.map((file) => file.arrayBuffer())
    );
    const buffers = fileBuffers.map((buffer) => Buffer.from(buffer));

    //Convert buffers to text
    const pdfTexts = await Promise.all(
      buffers.map((buffer) => PdfBufferToText(buffer))
    );

    const resourceIds: string[] = [];

    //Save texts to database or process as needed
    for (const [index, text] of pdfTexts.entries()) {
      const result = await createResource(resourceId, {
        content: text,
        fileName: fileNames[index],
        type: "PDF",
        url: "",
      });

      // Check if resource creation was successful
      if (!result?.success) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Failed to create resource",
          }),
          { status: 500 }
        );
      }

      // Collect the created resource ID
      if (result.resourceId) {
        resourceIds.push(result.resourceId);
      }
    }

    // Return the created resource IDs
    return new Response(
      JSON.stringify({
        success: true,
        resourceIds,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("File upload error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "File upload failed",
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
}
