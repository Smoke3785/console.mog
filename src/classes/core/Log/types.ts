import { Log, RawLog, PowerLog, MogLog } from "./index.ts";
import { DOM } from "@classes/core/DOM/class.ts";

export type LogVariantRegistry = {
  mogLog: MogLog;
  powerLog: PowerLog;
  rawLog: RawLog;
};

export type VariantName = keyof LogVariantRegistry;

export type LogMethod = "log" | "_log" | "$log" | "_$log";
export type AddCtx = Record<string, any>;

export type LogType = "log" | "warn" | "error" | "info" | "debug" | "table";
export type LogParams = {
  additionalContext?: AddCtx;
  parent: Log | DOM;
  type?: LogType;
};

export type CreateChildOptions<T extends VariantName = "mogLog"> = {
  variant: T;
  logParams: LogParams;
};
