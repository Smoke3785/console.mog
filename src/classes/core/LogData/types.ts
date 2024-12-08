export type LogDataInput = {
  type: "log" | "info" | "warn" | "error" | "debug";
  timestamp: string | null;
  namespace: string | null;
  module: string | null;
  treePrefix: string;
  data: any | any[];
  raw?: boolean;
};
