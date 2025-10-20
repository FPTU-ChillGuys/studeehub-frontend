import { createMessage } from "@/lib/actions/message";
import { StreamingTextGenerationFromMessagesToResult, StreamingTextGenerationFromMessagesToResultWithErrorHandler } from "@/lib/ai/chatbot/chatbot";
import { messageUIToDB } from "@/lib/mapping/message";
import { createUIMessageStream, createUIMessageStreamResponse, UIMessage } from "ai";

export async function POST(req: Request) {
  const { messages, resourceIds, notebookId, fileNames }: { messages: UIMessage[] , resourceIds: string | string[] , notebookId: string, fileNames: string[] } = await req.json();

  //Get last message
  const lastMessage = messages[messages.length - 1];
  const convertedMessage = messageUIToDB(notebookId, lastMessage);
  await createMessage(notebookId, convertedMessage);

  const result = StreamingTextGenerationFromMessagesToResultWithErrorHandler(messages, resourceIds, notebookId, fileNames);

  // return createUIMessageStreamResponse({ stream: result });
  return createUIMessageStreamResponse({ stream: result });
}

