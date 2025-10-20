import { createMessage } from "@/lib/actions/message";
import { StreamingTextGenerationFromMessagesToResult, StreamingTextGenerationFromMessagesToResultWithErrorHandler } from "@/lib/ai/chatbot/chatbot";
import { messageUIToDB } from "@/lib/mapping/message";
import { UIMessage } from "ai";

export async function POST(req: Request) {
  const { messages, resourceIds, notebookId }: { messages: UIMessage[] , resourceIds: string | string[] , notebookId: string } = await req.json();

  //Get last message
  const lastMessage = messages[messages.length - 1];
  const convertedMessage = messageUIToDB(notebookId, lastMessage);
  await createMessage(notebookId, convertedMessage);

  const result = StreamingTextGenerationFromMessagesToResult(messages, resourceIds);

  // return createUIMessageStreamResponse({ stream: result });
  return result.toUIMessageStreamResponse({
    onFinish: async (data) => {
      //Save assistant message to database
      const lastMessage = data.messages[data.messages.length - 1];
      const convertedMessage = messageUIToDB(notebookId, lastMessage);
      await createMessage(notebookId, convertedMessage);
    }
  });
}

