import {
  convertToModelMessages,
  createUIMessageStream,
  stepCountIs,
  streamText,
  tool,
  UIMessage,
} from "ai";
import { findRelevantContent } from "./embedding";
import { z } from "zod";
import { qwen3 } from "./model/ollama";

const SYSTEM_PROMPT = `You are an AI assistant that helps people find information and answer questions. You are given a user question, and you have access to a tool that can get information from your knowledge base to answer questions. If you don't know the answer, just say you don't know. Do not try to make up an answer.`;

export function StreamingTextGenerationFromMessagesToResult(
  messages: UIMessage[],
  resourceId: string | string[]
) {
  const result = streamText({
    model: qwen3,
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(100),
    tools: {
      getInformation: getInformationTool(resourceId),
    },
  });
  return result;
}

export function StreamingTextGenerationFromMessagesToResultWithErrorHandler(
  messages: UIMessage[],
  resourceId: string | string[]
) {
  const stream = createUIMessageStream({
    async execute({ writer }) {
      let result;
      try {
        // Thử tạo stream text
        result = streamText({
          model: qwen3,
          system: SYSTEM_PROMPT,
          messages: convertToModelMessages(messages),
          stopWhen: stepCountIs(100),
          tools: {
            getInformation: getInformationTool(resourceId),
          },
        });
      } catch (error) {
        // Nếu lỗi xảy ra khi streaming, gửi phần lỗi này lên
        writer.write({
          type: "error",
          errorText: "Hệ thống hiện đang có lỗi, vui lòng thử lại sau.",
        });
        return;
      }

      writer.merge(
        result.toUIMessageStream({
          onError: () => {
            // Nếu lỗi xảy ra trong quá trình stream, override phần lỗi gửi lên
            return "Hệ thống đang quá tải, vui lòng thử lại sau.";
          },
        })
      );
    },
  });

  return stream;
}

// Ghi tool o day
export const getInformationTool = (resourceId: string | string[]) =>
  tool({
    description: `Get information from your knowledge base to answer questions.`,
    inputSchema: z.object({
      question: z.string().describe("The users question"),
      resourceId: z
        .array(z.string())
        .describe("The resource IDs to search within"),
    }),
    execute: async ({ question }) =>
      findRelevantContent({ query: question, resourceId }),
  });
