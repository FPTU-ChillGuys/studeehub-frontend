import { StreamingTextGenerationFromMessagesToResultWithErrorHandler } from "@/lib/ai/chatbot/chatbot";
import { createUIMessageStreamResponse, UIMessage } from "ai";

export async function POST(req: Request) {
  const { messages, resourceId }: { messages: UIMessage[] , resourceId: string | string[] } = await req.json();

  const result = StreamingTextGenerationFromMessagesToResultWithErrorHandler(messages, resourceId);

  return createUIMessageStreamResponse({ stream: result });
}