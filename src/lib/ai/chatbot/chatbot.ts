import { convertToModelMessages, stepCountIs, streamText, tool, UIMessage } from "ai";
import { findRelevantContent } from "./embedding";
import { z } from "zod";
import { qwen3 } from "./model/ollama";

const SYSTEM_PROMPT = `You are an AI assistant that helps people find information and answer questions. You are given a user question, and you have access to a tool that can get information from your knowledge base to answer questions. If you don't know the answer, just say you don't know. Do not try to make up an answer.`;


export function StreamingTextGenerationFromMessagesToResult(
  messages: UIMessage[]
) {
  const result = streamText({
    model: qwen3,
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(100),
    tools: {
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        inputSchema: z.object({
          question: z.string().describe("the users question"),
          resourceId: z.array(z.string()).describe("the resource IDs to search within"),
        }),
        execute: async ({ question , resourceId }) => findRelevantContent({ query: question, resourceId }),
      }),
    },
  });

  return result;
}