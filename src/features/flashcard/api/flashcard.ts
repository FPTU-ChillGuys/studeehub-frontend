import { commonDelete, commonGet, commonPost } from "@/features/common/api/common";


export const flashcardBaseURL = "/api/flashcard";

export const postFlashcard = (body?: any) => {
  return commonPost(`${flashcardBaseURL}`, body);
}

export const getFlashcards = (params? : string) => {
    return commonGet(`${flashcardBaseURL}/${params}`);
};

export const deleteFlashcard = (params? : string) => {
    return commonDelete(`${flashcardBaseURL}/${params}`);
};