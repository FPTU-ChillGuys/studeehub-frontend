import { commonGet, commonPost } from "@/features/common/api/common";

export const chatbotBaseURL = "/api/chatbot";

export const postChatbot = (body?: any) => {
  return commonPost(`${chatbotBaseURL}`, body);
};

export const getChatbot = (params? : string) => {
    return commonGet(`${chatbotBaseURL}/${params}`);
};

