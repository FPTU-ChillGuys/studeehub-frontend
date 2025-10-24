import { commonDelete, commonGet } from "@/features/common/api/common";


export const resourceBaseURL = "/api/resource";

export const deleteResource = (params? : string) => {
  return commonDelete(`${resourceBaseURL}/${params}`);
}

export const getResource = async (params? : string) => {
  return commonGet(`${resourceBaseURL}/content/${params}`);
}