import { generateObject } from "ai";
import { geminiFlashLite } from "./model/google";
import { z } from "zod";
import { FlashcardOptions } from "@/components/modals/CustomiseFlashcardModal";

const prompt = (
  content: string,
  options?: FlashcardOptions
) => 
`You are an expert educator creating high-quality flashcards for studying. Based on the following content, generate any flashcards that will help students learn and retain the key concepts.

CONTENT:
${content}

OPTIONS:
${options ? `- Number of Cards Preference: ${options.numberOfCards}
- Difficulty Level: ${options.difficulty}
- Topic Focus: ${options.topic}` : "- No specific options provided"}

INSTRUCTIONS:
1. Create flashcards that test understanding, not just memorization
2. Front side should be:
   - Clear, specific questions or key terms
   - Focus on important concepts, definitions, relationships
   - Use "What is...", "How does...", "Why does...", "Define..." formats when appropriate
3. Back side should be:
   - Concise but complete answers
   - Include relevant examples when helpful
   - Use clear, simple language
   - Maximum 2-3 sentences for complex concepts

EXAMPLES OF GOOD FLASHCARDS:
- Front: "What is the relationship between matter and consciousness in dialectical materialism?"
- Back: "In dialectical materialism, matter is primary and consciousness is secondary, meaning consciousness arises from and is determined by material conditions."

Generate flashcards that capture the most important learning points from the content above.`;

export async function GenerateFlashcardsFromContent(content: string, options? : FlashcardOptions) {
  const { object: flashcardObject } = await generateObject({
    model: geminiFlashLite,
    schema: z.object({
      title: z.string().max(100).describe("The title of the flashcard set"),
      decks: z
        .array(
          z.object({
            front: z
              .string()
              .describe(
                "The front side of the flashcard - should be a clear, concise question, term, or concept that tests understanding"
              ),
            back: z
              .string()
              .describe(
                "The back side of the flashcard - should be a comprehensive but concise answer, definition, or explanation"
              ),
          })
        )
        .describe("Array of flashcards generated from the content"),
    }),
    prompt: prompt(content, options),
  });

  return flashcardObject;
}
