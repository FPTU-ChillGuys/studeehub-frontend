import { UIMessage } from "ai";
import { InsertMessageParams } from "../db/schema/message";

export const messageUIToDB = (notebookId : string, messageUI: UIMessage) : InsertMessageParams => {
  return {
    id: messageUI.id,
    notebookId: notebookId,
    text: messageUI.parts.map((part) => part.type === "text" ? part.text : "").join(""),
    role: messageUI.role,
  };
}

export const messageDBToUI = (messageDB: InsertMessageParams) : UIMessage => {
  return {
    id: messageDB.id ?? "",
    role: messageDB.role as "system" | "user" | "assistant",
    parts: [
      { type: "text", text: messageDB.text }
    ]
  };
};