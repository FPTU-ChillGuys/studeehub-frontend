import { PDFParse } from 'pdf-parse';


export const PdfBufferToText = async (buffer: Buffer) => {
   const parser = new PDFParse({data: buffer});

  parser.getText().then((result ) => {
    return result.text;
  }).finally(async () => {
    await parser.destroy();
  });

  return "";
};
