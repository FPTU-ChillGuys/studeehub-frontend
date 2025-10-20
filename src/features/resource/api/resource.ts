import { commonDelete } from "@/features/common/api/common";


export const resourceBaseURL = "/api/resource";

export const deleteResource = (params? : string) => {
  return commonDelete(`${resourceBaseURL}/${params}`);
}