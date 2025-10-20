import { commonDelete, commonGet, commonPost, commonPut } from "@/features/common/api/common";

const notebookBaseURL = "/api/notebook";

export const postNotebook = (body?: any) => {
   return commonPost(`${notebookBaseURL}`, body);
};

export const getNotebook = (params? : string) => {
    return commonGet(`${notebookBaseURL}/${params}`);
};

export const deleteNotebook = (params? : string) => {
    return commonDelete(`${notebookBaseURL}/${params}`);
};

export const putNotebook = (params? : string, body?: any) => {
    return commonPut(`${notebookBaseURL}/${params}`, body);
};
