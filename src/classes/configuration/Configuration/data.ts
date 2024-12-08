import { ThothConfigStrict } from "./types.ts";

export const defaultThothConfig: ThothConfigStrict = {
  prefix: {
    prefixOrder: ["mfgStamp", "timestamp", "module", "namespace"],
    joinString: "",
    padType: "left",
    newLine: false,
    showTypes: true,
    timestamp: {
      components: ["time"],
      enabled: true,
      color: "gray",
      fn: undefined,
    },
    module: {
      color: "#900C3F",
      enabled: true,
      name: "(Meta)",
      fn: undefined,
    },
    namespace: {
      color: "#FDDA0D", // Cadmium Yellow
      enabled: true,
      name: "[Thoth]",
      fn: undefined,
    },
    mfgStamp: {
      enabled: true,
    },
  },
  typeColors: {
    log: "white",
    info: "blue",
    warn: "yellow",
    error: "red",
    debug: "green",
  },
  overrideConsole: false,
};
