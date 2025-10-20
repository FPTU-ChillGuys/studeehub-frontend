import { commonDelete, commonGet, commonPost } from "@/features/common/api/common";

export const fileBaseURL = "/api/file";

export const postFile = (body?: any) => {
  return commonPost(`${fileBaseURL}`, body);
};

export const getFile = (params? : string) => {
   return commonGet(`${fileBaseURL}/${params}`);
};

export const deleteFile = (params? : string) => {
  return commonDelete(`${fileBaseURL}/${params}`);
};