import pdf from "pdf-parse";

export const PdfBufferToText = async (buffer: Buffer) => {
  return await pdf(buffer)
    .then(function (data : { text: string }) {
      return data.text;
    })
    .catch((err) => {
      console.error("Error parsing PDF:", err);
      return "";
    });
};
