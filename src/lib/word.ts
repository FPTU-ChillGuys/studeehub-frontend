import WordExtractor from "word-extractor";

export const WordBufferToText = async (buffer: Buffer): Promise<string> => {
  const extractor = new WordExtractor();

  try {
    const result = await extractor.extract(buffer);
    return result.getBody();
  } catch (error) {
    console.error("Error parsing Word document:", error);
    return "";
  }
};
