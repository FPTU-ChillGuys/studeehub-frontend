import {
  convertToModelMessages,
  createUIMessageStream,
  Output,
  stepCountIs,
  streamText,
  tool,
  UIMessage,
} from "ai";
import { findRelevantContent } from "./embedding";
import { z } from "zod";
import { gpt5nano } from "./model/openai";
import { messageUIToDB } from "@/lib/mapping/message";
import { createMessage } from "@/lib/actions/message";
import { getContentFromResourceId } from "@/lib/actions/resources";

// const SYSTEM_PROMPT = `You are a helpful assistant. Check your knowledge base before answering any questions.
//     Only respond to questions using information from tool calls.'
//     Try to use the tool "getInformation" to get relevant information from your knowledge base to answer questions.
//     if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`;

const SYSTEM_PROMPT = `You are a helpful assistant with access to a knowledge base of documents.

IMPORTANT CONTEXT:
- The user has already selected specific files for this conversation.
- The selected files are automatically available to you through the tools.
- You DO NOT need to ask which files to use - they are already chosen.
- The selected files are: `;

const SYSTEM_INSTRUCTIONS = `

INSTRUCTIONS:
1. When the user asks questions, use the "getInformation" tool to search for relevant content from the selected files.
2. When the user asks for summary, analysis, or needs full content from files, use the "getAllContentToSummarizeOrAnalyze" tool - it will automatically get content from ALL selected files.
3. DO NOT ask the user which files to use - the files are already selected and shown above.
4. If the user asks "Can you help me summarize this file?" or "Analyze these documents", immediately use the appropriate tool without asking for clarification.
5. Only respond using information retrieved from the tools.
6. If no relevant information is found after using the tools, politely inform the user and suggest they provide more specific questions or select different files.
7. Be concise and helpful in your responses.

Remember: The files listed above are already selected and ready to use. Start working with them immediately when asked.`;

const citationSchema = z.object({
  content: z.string(),
  citations: z.array(
    z.object({
      number: z.string(),
      title: z.string(),
      url: z.string(),
      description: z.string().optional(),
      quote: z.string().optional(),
    }),
  ),
})


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
          model: gpt5nano,
          system: SYSTEM_PROMPT + fileNames.join(", ") + SYSTEM_INSTRUCTIONS,
          messages: convertToModelMessages(messages),
          stopWhen: stepCountIs(10),
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

export function StreamingTextGenerationFromMessagesToResultWithErrorHandlerAndCitation(
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
          model: gpt5nano,
          system: SYSTEM_PROMPT + fileNames.join(", ") + SYSTEM_INSTRUCTIONS,
          messages: convertToModelMessages(messages),
          stopWhen: stepCountIs(10),
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
          experimental_output: Output.object({
            schema: citationSchema,
          }),
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

}


// export function StreamingTextGenerationFromMessagesToResult(
//   messages: UIMessage[],
//   resourceIds: string | string[]
// ) {
//   const result = streamText({
//     model: geminiFlashLite,
//     system: SYSTEM_PROMPT,
//     messages: convertToModelMessages(messages),
//     stopWhen: stepCountIs(100),
//     tools: {
//       getInformation: tool({
//         description: `Get information from your knowledge base to answer questions.`,
//         inputSchema: z.object({
//           question: z.string().describe("The users question"),
//         }),
//         execute: async ({ question }) => {
//           const response = findRelevantContent({
//             query: question,
//             resourceIds,
//           });
//           return response;
//         },
//       }),
//     },
//   });
//   return result;
// }


