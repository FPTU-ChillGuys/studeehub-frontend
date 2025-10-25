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

const SYSTEM_CITATION_PROMPT = `
CITATION INSTRUCTIONS:
You must respond in a structured JSON format with proper citations. Your response should follow this structure:

RESPONSE FORMAT:
{
  "results": [
    {
      "content": "Your response content here using proper Markdown formatting",
      "citations": [
        {
          "number": "1",
          "title": "Source document title",
          "url": "document-id or path",
          "description": "Brief description of the source",
          "quote": "EXACT quote from the source that supports this citation"
        }
      ]
    }
  ]
}

IMPORTANT RULES FOR CITATIONS:
1. Break your response into MULTIPLE content blocks if covering different topics or using different sources
2. Each content block should have its own set of citations
3. DO NOT use inline citation markers like [1], [2] in the content text - citations are automatically linked
4. For EACH citation, you MUST include:
   - number: The citation number as a string (sequential: "1", "2", "3", etc.)
   - title: The filename or document title from the retrieved content
   - url: The document ID or source identifier
   - quote: The EXACT text snippet from the source that you're citing (NOT a paraphrase - copy the actual text)
   - description: (optional) A brief note about what this source provides

5. When you retrieve content from tools:
   - Extract the EXACT quote/passage that supports your statement
   - Use that exact text in the "quote" field
   - Include the source filename in the "title" field
   - The quote should be specific, not generic - show WHERE in the document this information came from

6. MARKDOWN FORMATTING in content:
   - Use **bold** for emphasis
   - Use *italic* for subtle emphasis
   - Use # for headings (# H1, ## H2, ### H3)
   - Use - or * for bullet lists
   - Use 1. 2. 3. for numbered lists
   - Use \`code\` for inline code
   - Use \`\`\`language for code blocks
   - Use > for blockquotes
   - Use | for tables
   - Use --- for horizontal rules
   - Use [text](url) for links (though citations are handled separately)
   
7. Content structure examples:
   - Simple answer: Single paragraph with proper formatting
   - Complex answer: Use headings, lists, and multiple paragraphs
   - Technical content: Use code blocks, tables when appropriate
   - Comparisons: Use tables or structured lists

8. Multiple content blocks:
   - Use separate content blocks for different aspects of your answer
   - Example:
     * Block 1: Overview with brief introduction
     * Block 2: Detailed explanation with lists/tables
     * Block 3: Examples or additional notes

9. Quality of citations:
   - DO: Include specific quotes that prove your point
   - DO: Reference the exact section of the document
   - DON'T: Use vague or generic descriptions
   - DON'T: Cite without providing the actual quote

EXAMPLE GOOD RESPONSE:
{
  "results": [
    {
      "content": "## John Williams - Nhà Soạn Nhạc Huyền Thoại\n\nJohn Williams là một trong những nhà soạn nhạc điện ảnh vĩ đại nhất mọi thời đại. Ông đã sáng tác nhạc phim cho nhiều tác phẩm kinh điển của Hollywood.\n\n**Các tác phẩm nổi bật:**\n- Star Wars\n- Indiana Jones  \n- Jurassic Park\n- Harry Potter",
      "citations": [
        {
          "number": "1",
          "title": "JohnWilliam.pdf",
          "url": "JohnWilliam.pdf",
          "description": "Tiểu sử và sự nghiệp",
          "quote": "John Williams là nhà soạn nhạc và nhạc trưởng người Mỹ, một trong những nhạc sĩ điện ảnh có ảnh hưởng nhất. Ông nổi tiếng với nhạc phim cho các tác phẩm của Steven Spielberg và George Lucas, đóng thời sáng tác cả concerto và các tác phẩm nhạc cổ điển như 1980–1993"
        }
      ]
    },
    {
      "content": "### Thành Tựu Và Giải Thưởng\n\nOng Williams đã nhận được **hơn 50 đề cử Oscar**, nhiều hơn bất kỳ người nào còn sống. Danh sách giải thưởng của ông bao gồm:\n\n| Giải thưởng | Số lượng |\n|------------|----------|\n| Grammy | 26 |\n| Oscar | 5 |\n| BAFTA | 7 |\n| Emmy | 3 |\n| Golden Globe | 4 |\n\n> Williams là biểu tượng của nhạc phim và âm nhạc giao hưởng với sự nghiệp lẫy lừng.",
      "citations": [
        {
          "number": "1",
          "title": "JohnWilliam.pdf",
          "url": "JohnWilliam.pdf",
          "description": "Danh sách giải thưởng",
          "quote": "26 giải Grammy; 5 giải Oscar; 7 giải BAFTA; 3 Emmy; 4 Golden Globes. 54 đề cử Oscar (là người được đề cử nhiều thứ hai sau Walt Disney)"
        },
        {
          "number": "2",
          "title": "JohnWilliam.pdf",
          "url": "JohnWilliam.pdf",
          "description": "Di sản nghệ thuật",
          "quote": "John Williams là một biểu tượng của nhạc phim và đan nhạc. với sự nghiệp lẫy lừng và tác động sâu rộng đến nhạc phim và cả âm nhạc concert"
        }
      ]
    }
  ]
}

Remember: 
- DO NOT use [1], [2] markers in content - citations are handled separately
- Use proper Markdown formatting for better readability
- Always extract EXACT quotes from the retrieved content
- Use multiple content blocks for complex answers
- Each citation must have a specific quote, not a general description
- The quote field is mandatory and must contain actual text from the source
`;

const citationSchema = z.object({
  results: z.array(
    z.object({
      content: z.string(),
      citations: z.array(
        z.object({
          number: z.string(),
          title: z.string(),
          url: z.string(),
          description: z.string().optional(),
          quote: z.string().optional(),
        })
      ),
    })
  ),
});


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
      } catch {
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
          system: SYSTEM_PROMPT + fileNames.join(", ") + SYSTEM_INSTRUCTIONS + SYSTEM_CITATION_PROMPT,
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
      } catch {
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


