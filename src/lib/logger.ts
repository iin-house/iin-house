import { randomUUID } from "crypto";

export function getRequestId(): string {
  return randomUUID();
}

export function logRequest(req: Request, startTime: number, extra: Record<string, any> = {}) {
  const duration = Date.now() - startTime;
  const url = new URL(req.url);
  console.log({
    type: "request",
    method: req.method,
    path: url.pathname,
    duration: `${duration}ms`,
    ...extra,
  });
}

export function logError(error: unknown, context: Record<string, any> = {}) {
  console.error({
    type: "error",
    message: (error as Error).message,
    stack: (error as Error).stack,
    ...context,
  });
}
