import { PDFParse } from "pdf-parse";
import 'pdfjs-dist/build/pdf.worker.mjs';

export const PdfBufferToText = async (buffer: Buffer): Promise<string> => {
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    await parser.destroy();
    return "";
  }
};
