// 백엔드 호출은 상대 경로 /api/... 로 한다 (next.config.ts rewrites가 백엔드로 프록시).

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  if (!response.ok) {
    throw new ApiError(await errorMessage(response), response.status);
  }
  return response.json() as Promise<T>;
}

/** 백엔드 ProblemDetail의 detail을 그대로 보여준다. */
async function errorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: string };
    if (body.detail) return body.detail;
  } catch {
    // 본문이 JSON이 아니면 상태 코드로 대신한다
  }
  return `요청에 실패했습니다 (${response.status})`;
}

/** SWR fetcher */
export function fetcher<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, { method: "DELETE" });
}
