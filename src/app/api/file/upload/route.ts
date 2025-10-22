import { createResource } from "@/lib/actions/resources";
import { ExcelBufferToText } from "@/lib/excel";
import { PdfBufferToText } from "@/lib/pdf";
import { TxtBufferToText } from "@/lib/txt";
import { WordBufferToText } from "@/lib/word";
import { NextResponse } from "next/server";
import {
  EXTENSION_TO_TYPE,
  INVALID_FILE_TYPE_MESSAGE,
  type SupportedExtension,
  type DocumentType,
  isValidExtension,
} from "@/config/fileTypes";

// Constants
const ERROR_MESSAGES = {
  NO_FILES: "No files uploaded",
  INVALID_FILE_TYPE: INVALID_FILE_TYPE_MESSAGE,
  NO_NOTEBOOK_ID: "No notebookId provided",
  RESOURCE_CREATION_FAILED:
    "Failed to create resource. Please try again or try upload smaller files under 1000 words.",
  UPLOAD_FAILED: "File upload failed",
} as const;

interface ProcessedFile {
  text: string;
  fileName: string;
  type: DocumentType;
}

// Helper functions
const getFileExtension = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  return extension;
};

const getFileType = (extension: string): DocumentType | null => {
  if (!isValidExtension(extension)) {
    return null;
  }
  return EXTENSION_TO_TYPE[extension as SupportedExtension];
};

const isValidFileExtension = (fileName: string): boolean => {
  const extension = getFileExtension(fileName);
  return isValidExtension(extension);
};

const extractTextFromBuffer = async (
  buffer: Buffer,
  extension: string
): Promise<string> => {
  if (extension === "pdf") {
    return await PdfBufferToText(buffer);
  } else if (extension === "xlsx" || extension === "csv") {
    return await ExcelBufferToText(buffer);
  } else if (extension === "txt") {
    return await TxtBufferToText(buffer);
  }
  // Both DOC and DOCX use the same extractor
  return await WordBufferToText(buffer);
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Validate files
    const files = formData.getAll("files") as File[];
    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: ERROR_MESSAGES.NO_FILES },
        { status: 400 }
      );
    }

    // Validate file types
    const invalidFile = files.find((file) => !isValidFileExtension(file.name));
    if (invalidFile) {
      return NextResponse.json(
        { message: ERROR_MESSAGES.INVALID_FILE_TYPE },
        { status: 400 }
      );
    }

    // Validate notebookId
    const notebookId = formData.get("notebookId") as string;
    if (!notebookId) {
      return NextResponse.json(
        { message: ERROR_MESSAGES.NO_NOTEBOOK_ID },
        { status: 400 }
      );
    }

    // Process files: Extract text from all files in parallel
    const processedFiles = await Promise.all(
      files.map(async (file): Promise<ProcessedFile> => {
        const extension = getFileExtension(file.name);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const text = await extractTextFromBuffer(buffer, extension);
        const type = getFileType(extension)!;

        return {
          text,
          fileName: file.name,
          type,
        };
      })
    );

    // Create resources: Process all files sequentially to avoid overwhelming the database
    const resourceIds: string[] = [];

    for (const { text, fileName, type } of processedFiles) {
      const result = await createResource(notebookId, {
        content: text,
        fileName,
        type,
        url: "",
      });

      if (!result?.success) {
        return NextResponse.json(
          { message: ERROR_MESSAGES.RESOURCE_CREATION_FAILED },
          { status: 500 }
        );
      }

      if (result.resourceId) {
        resourceIds.push(result.resourceId);
      }
    }

    return NextResponse.json({ resourceIds }, { status: 200 });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      {
        message: ERROR_MESSAGES.UPLOAD_FAILED,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
