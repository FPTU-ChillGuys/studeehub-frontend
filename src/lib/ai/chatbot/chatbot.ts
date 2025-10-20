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
import { geminiFlashLite } from "./model/google";
import { messageUIToDB } from "@/lib/mapping/message";
import { createMessage } from "@/lib/actions/message";
import { getContentFromResourceId } from "@/lib/actions/resources";

// const SYSTEM_PROMPT = `You are a helpful assistant. Check your knowledge base before answering any questions.
//     Only respond to questions using information from tool calls.'
//     Try to use the tool "getInformation" to get relevant information from your knowledge base to answer questions.
//     if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`;

const SYSTEM_PROMPT = `You are a helpful assistant. Check your knowledge base before answering any questions.
     Only respond to questions using information from tool calls.'
     Try to use the tool "getInformation" to get relevant information from your knowledge base to answer questions.
     Or use the tool "getContent" to get all content for summarization or analysis.
     If user asks for a summary or analysis, use the tool "getAllContentToSummarizeOrAnalyze" to get all content. Remember if user ask for summary or analysis from files, you don't need to know which files, just get all content.
    if no relevant information is found in the tool calls, 
    please ask the user to provide more context or information.
    After receiving more context, re-attempt to find relevant information in the knowledge base using the tool.
    Respond what relevant information you have found in the tool calls, do not make up any information.
    The files are: `;

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
          const response = findRelevantContent({
            query: question,
            resourceIds,
          });
          return response;
        },
      }),
    },
  });
  return result;
}

export function StreamingTextGenerationFromMessagesToResultWithErrorHandler(
  messages: UIMessage[],
  resourceIds: string | string[],
  notebookId: string,
  fileNames: string[]
) {
  const stream = createUIMessageStream({
    async execute({ writer }) {
      let result;
      try {
        // Thử tạo stream text
        result = streamText({
          model: geminiFlashLite,
          system: SYSTEM_PROMPT + fileNames.join(", "),
          messages: convertToModelMessages(messages),
          stopWhen: stepCountIs(100),
          tools: {
            getInformation: tool({
              description: `Get information from your knowledge base to answer questions.`,
              inputSchema: z.object({
                question: z.string().describe("The users question"),
              }),
              execute: async ({ question }) => {
                const response = findRelevantContent({
                  query: question,
                  resourceIds,
                });
                return response;
              },
            }),
            getAllContentToSummarizeOrAnalyze: tool({
              description: `Get all content to summarize or analyze.`,
              inputSchema: z.object({}),
              execute: async () => {
                const resourceIdsArray = Array.isArray(resourceIds)
                  ? resourceIds
                  : [resourceIds];
                const response = await getContentFromResourceId(resourceIdsArray);
                return response;
              },
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
          onFinish: async (data) => {
            //Save assistant message to database
            const lastMessage = data.messages[data.messages.length - 1];
            const convertedMessage = messageUIToDB(notebookId, lastMessage);
            await createMessage(notebookId, convertedMessage);
          },
        })
      );
    },
  });

  return stream;
}
