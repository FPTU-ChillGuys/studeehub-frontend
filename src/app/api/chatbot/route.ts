import { StreamingTextGenerationFromMessagesToResult, StreamingTextGenerationFromMessagesToResultWithErrorHandler } from "@/lib/ai/chatbot/chatbot";
import { createUIMessageStreamResponse, UIMessage } from "ai";

export async function POST(req: Request) {
  const { messages, resourceIds }: { messages: UIMessage[] , resourceIds: string | string[] } = await req.json();

  console.log("Resource IDs received in request:", resourceIds);

  const result = StreamingTextGenerationFromMessagesToResult(messages, resourceIds);

  // return createUIMessageStreamResponse({ stream: result });
  return result.toUIMessageStreamResponse();
}