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
import { geminiFlashLite } from "./model/google";

// const SYSTEM_PROMPT = `You are a helpful assistant. Check your knowledge base before answering any questions.
//     Only respond to questions using information from tool calls.'
//     Try to use the tool "getInformation" to get relevant information from your knowledge base to answer questions.
//     if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`;

const SYSTEM_PROMPT = `You are a helpful assistant. Check your knowledge base before answering any questions.
     Only respond to questions using information from tool calls.'
     Try to use the tool "getInformation" to get relevant information from your knowledge base to answer questions.
    if no relevant information is found in the tool calls, 
    please ask the user to provide more context or information.
    After receiving more context, re-attempt to find relevant information in the knowledge base using the tool.
    Respond what relevant information you have found in the tool calls, do not make up any information.`;

export function StreamingTextGenerationFromMessagesToResult(
  messages: UIMessage[],
  resourceIds: string | string[]
) {
  const result = streamText({
    model: geminiFlashLite,
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(100),
    tools: {
      getInformation: tool({
        description: `Get information from your knowledge base to answer questions.`,
        inputSchema: z.object({
          question: z.string().describe("The users question"),
        }),
        execute: async ({ question }) => {
          const response = findRelevantContent({ query: question, resourceIds });
          console.log("Response from findRelevantContent:", response);
          return response;
        },
      }),
    },
  });
  return result;
}

export function StreamingTextGenerationFromMessagesToResultWithErrorHandler(
  messages: UIMessage[],
  resourceIds: string | string[]
) {
  const stream = createUIMessageStream({
    async execute({ writer }) {
      let result;
      try {
        // Thử tạo stream text
        result = streamText({
          model: geminiFlashLite,
          system: SYSTEM_PROMPT,
          messages: convertToModelMessages(messages),
          stopWhen: stepCountIs(100),
          tools: {
            getInformation: tool({
              description: `Get information from your knowledge base to answer questions.`,
              inputSchema: z.object({
                question: z.string().describe("The users question"),
              }),
              execute: async ({ question }) =>
                findRelevantContent({ query: question, resourceIds }),
            }),
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
