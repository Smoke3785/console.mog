import {
  TimeStampComponents,
  PolymorphicColor,
  PadType,
  ColorFn,
} from "@types";

export type MogContextInput = {
  prefix?: {
    prefixOrder?: StandardPrefix[];
    joinString?: string;
    showTypes?: boolean;
    padType?: PadType;
    newLine?: boolean;
    timestamp: {
      components?: TimeStampComponents | TimeStampComponents[];
      color?: PolymorphicColor;
      fn?: (s: string) => string; // The last function in the chain should return a string.
      enabled: boolean;
    };
    // Whether or not to show the namespace (e.g. Iliad, Thoth, Atlas, Gcollective, etc.)
    module?: {
      fn?: (s: string) => string; // The last function in the chain should return a string.
      color?: PolymorphicColor;
      enabled: boolean;
      name?: string;
    };
    // Whether or not to show the namespace (e.g. Iliad, Thoth, Atlas, Gcollective, etc.)
    namespace?: {
      fn?: (s: string) => string; // The last function in the chain should return a string.
      color?: PolymorphicColor;
      enabled: boolean;
      name?: string;
    };
    // Whether or not to show the manufacturer stamp (Iliad)
    mfgStamp?: {
      enabled?: boolean;
    };
  };
  overrideConsole?: boolean;
};

import { XOR, Optional } from "@iliad.dev/ts-utils/@types";
import { MogContext } from "@classes/MogContext/index.ts";
import { ChalkInstance } from "chalk";

export type LogTypes<CTS extends LogType[] = never> = {
  debug: LogType;
  error: LogType;
  info: LogType;
  warn: LogType;
  log: LogType;
} & {
  [K in CTS[number]["name"]]: CTS[number];
};

export type FinalLogConfig<CTS extends LogType[] = never> = {
  ext?: XOR<"subLogger", "powerLogger">;
  type: keyof LogTypes<CTS>;
  topLevel?: boolean;
  spinner?: boolean;
  fn?: LogFn;
};

export type LogType = {
  name: string;
};

export type StandardPrefix = "mfgStamp" | "timestamp" | "module" | "namespace";

export type ThothConfigStrict = {
  prefix: {
    prefixOrder: StandardPrefix[];
    joinString: string;
    showTypes: boolean;
    newLine: boolean;
    padType: PadType;
    timestamp: {
      components: TimeStampComponents | TimeStampComponents[];
      fn: Optional<(s: string) => string>; // The last function in the chain should return a string.
      color: PolymorphicColor;
      enabled: boolean;
    };
    // Whether or not to show the namespace (e.g. Iliad, Thoth, Atlas, Gcollective, etc.)
    module: {
      fn: Optional<(s: string) => string>; // The last function in the chain should return a string.
      color: PolymorphicColor;
      enabled: boolean;
      name: string;
    };
    // Whether or not to show the namespace (e.g. Iliad, Thoth, Atlas, Gcollective, etc.)
    namespace: {
      fn: Optional<(s: string) => string>; // The last function in the chain should return a string.
      color: PolymorphicColor;
      enabled: boolean;
      name: string;
    };
    // Whether or not to show the manufacturer stamp (Iliad)
    mfgStamp: {
      enabled: boolean;
    };
  };
  typeColors: Record<keyof LogTypes, PolymorphicColor>;
  overrideConsole: boolean;
};

export type ThothConfigNormalized = {
  prefix: {
    prefixOrder: StandardPrefix[];
    joinString: string;
    showTypes: boolean;
    newLine: boolean;
    padType: PadType;
    timestamp: {
      components: TimeStampComponents | TimeStampComponents[];
      fn: (s: string) => string; // The last function in the chain should return a string.
      enabled: boolean;
      color: ColorFn;
    };
    // Whether or not to show the namespace (e.g. Iliad, Thoth, Atlas, Gcollective, etc.)
    module: {
      fn: (s: string) => string; // The last function in the chain should return a string.
      enabled: boolean;
      color: ColorFn;
      name: string;
    };
    // Whether or not to show the namespace (e.g. Iliad, Thoth, Atlas, Gcollective, etc.)
    namespace: {
      fn: (s: string) => string; // The last function in the chain should return a string.
      enabled: boolean;
      color: ColorFn;
      name: string;
    };
    // Whether or not to show the manufacturer stamp (Iliad)
    mfgStamp: {
      enabled: boolean;
    };
  };
  typeColors: Record<keyof LogTypes, ColorFn>;
  overrideConsole: boolean;
};

export type LogFn = (chalk: ChalkInstance, ctx?: MogContext) => [...any];
export type FnLogGeneric = XOR<[LogFn], [...any]>;

// export type ModuleParam =
//   | string
//   | {
//       fn?: (s: string) => string; // The last function in the chain should return a string.
//       color?: PolymorphicColor;
//       name?: string;
//     };

// export type StrictModuleParam = {
//   fn: undefined | ((s: string) => string); // The last function in the chain should return a string.
//   color: PolymorphicColor;
//   enabled: boolean;
//   name: string;
// };
