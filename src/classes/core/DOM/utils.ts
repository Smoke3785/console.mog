import type { PipeMessage } from "./types.ts";

type PipeMiddlewareReturn = PipeMessage | string | Array<PipeMessage | string>;

export function normalizePipeData(input: PipeMiddlewareReturn): PipeMessage[] {
  if (typeof input === "string") {
    return normalizePipeData({ data: input, method: "log" });
  }

  if (Array.isArray(input)) {
    return input.map((item) => normalizePipeData(item)).flat();
  }

  return [
    {
      method: input.method,
      data: input.data,
    },
  ];
}
