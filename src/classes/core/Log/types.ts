import { DOM } from "@classes/DOM/class.ts";
import { Log, RawLog, PowerLog, MogLog } from "./index.ts";

export type LogVariantRegistry = {
  mogLog: MogLog;
  powerLog: PowerLog;
  rawLog: RawLog;
};

export type VariantName = keyof LogVariantRegistry;

export type LogType = "log" | "warn" | "error" | "info" | "debug";
export type LogParams = {
  parent: Log | DOM;
  type?: LogType;
};

export type CreateChildOptions<T extends VariantName = "mogLog"> = {
  variant: T;
  logParams: LogParams;
};
