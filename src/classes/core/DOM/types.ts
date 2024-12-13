import type { LogType } from "../Log/index.ts";

export type ShouldFullRenderCtx = {
  specialKey?: string;
  full?: boolean;
};

export type PipeMessage = {
  method: LogType;
  data: string;
};

export type PipeMiddleware = (
  data: string
) => PipeMessage | string | Array<PipeMessage | string>;
