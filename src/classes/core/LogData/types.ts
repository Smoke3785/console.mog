import type { LogType } from "@classes/core/Log/types.ts";

export type LogDataInput = {
  treePrefix: string;
  data: any | any[];
  type: LogType;
  raw?: boolean;
};

export type TableDataInput = {
  type: "unknown" | "array" | "object";
  data: any[] | Record<string, any>[];
  headers?: Array<number | string>;
  styles: {};
};

export type OrganizedTableData = {
  headers: Array<string>;
  data: Array<any>;
  styles: {};
};
export type TableData = {};
