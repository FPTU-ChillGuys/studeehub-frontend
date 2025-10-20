import { BaseResponse } from "@/Types";

export const headers: HeadersInit = {
  "Content-Type": "application/json",
};

export async function commonFetch(
  url: string,
  method: string,
  body?: any,
  headersOverride?: HeadersInit
): Promise<BaseResponse> {
  // Don't set Content-Type header if body is FormData
  // Browser will automatically set it with proper boundary
  const finalHeaders = body instanceof FormData 
    ? headersOverride 
    : { ...headers, ...headersOverride };

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : null,
  });

  if (!response.ok || response.status < 200 || response.status >= 300) {
    return {
      success: false,
      message: `HTTP error! status: ${response.status}`,
      errors: null,
    } as BaseResponse;
  }

  const data = await response.json();

  return {
    success: true,
    message: "Request successful",
    errors: null,
    data,
  } as BaseResponse;
}

export async function commonGet(url: string): Promise<BaseResponse> {
  return commonFetch(url, "GET");
}

export async function commonPost(
  url: string,
  body?: any,
  headersOverride?: HeadersInit
): Promise<BaseResponse> {
  return commonFetch(url, "POST", body, headersOverride);
}

export async function commonPut(
  url: string,
  body?: any,
  headersOverride?: HeadersInit
): Promise<BaseResponse> {
  return commonFetch(url, "PUT", body, headersOverride);
}

export async function commonDelete(url: string): Promise<BaseResponse> {
  return commonFetch(url, "DELETE");
}
