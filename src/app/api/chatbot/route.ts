import { StreamingTextGenerationFromMessagesToResultWithErrorHandler } from "@/lib/ai/chatbot/chatbot";
import { createUIMessageStreamResponse, UIMessage } from "ai";

export async function POST(req: Request) {
  const { messages, resourceIds }: { messages: UIMessage[] , resourceIds: string | string[] } = await req.json();

  const result = StreamingTextGenerationFromMessagesToResultWithErrorHandler(messages, resourceIds);

  return createUIMessageStreamResponse({ stream: result });
}