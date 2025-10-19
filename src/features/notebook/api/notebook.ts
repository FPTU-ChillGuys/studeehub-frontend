
 const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

const notebookBaseURL = "/api/notebook";

export const postNotebook = (body?: any) => {
  return fetch(`${notebookBaseURL}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
};

export const getNotebook = (params? : string) => {
    return fetch(`${notebookBaseURL}/${params}`, {
        method: 'GET',
        headers,
    });
};

export const deleteNotebook = (params? : string) => {
    return fetch(`${notebookBaseURL}/${params}`, {
        method: 'DELETE',
        headers,
    });
};

export const putNotebook = (params? : string, body?: any) => {
    return fetch(`${notebookBaseURL}/${params}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
    });
};
