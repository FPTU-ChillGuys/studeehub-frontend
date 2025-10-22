import * as xlsx from "xlsx";

export const ExcelBufferToText = async (buffer: Buffer) => {
  try {
    const workbook = xlsx.read(buffer, { type: "buffer" });
    let text = "";

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      text += xlsx.utils.sheet_to_csv(worksheet);
    });

    return text;
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    throw error;
  }
};
