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

    //Temeporary: Only upload pdf files
    for (const file of files) {
      if (file.type !== "application/pdf") {
        return new Response(
          JSON.stringify({
            message: "Only PDF files are supported",
          }),
          { status: 400 }
        );
      }
    }

    const notebookId = formData.get("notebookId") as string;
    if (!notebookId) {
      return new Response(
        JSON.stringify({ message: "No notebookId provided" }),
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
      buffers.map(async (buffer) => await PdfBufferToText(buffer))
    );

    const resourceIds: string[] = [];

    //Save texts to database or process as needed
    for (const [index, text] of pdfTexts.entries()) {
      const result = await createResource(notebookId, {
        content: text,
        fileName: fileNames[index],
        type: "PDF",
        url: "",
      });

      // Check if resource creation was successful
      if (!result?.success) {
        return new Response(
          JSON.stringify({
            message: "Failed to create resource. Please try again or try upload smaller files under 1000 words.",
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
        resourceIds,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("File upload error:", error);
    return new Response(
      JSON.stringify({
        message: "File upload failed",
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
}
