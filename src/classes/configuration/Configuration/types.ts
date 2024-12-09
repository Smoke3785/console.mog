// Types
import type { PolymorphicColor, ColorFn } from "@types";
import type { XOR } from "@iliad.dev/ts-utils/@types";
import type { ChalkInstance } from "chalk";

// Classes
import { MogContext } from "@classes/core/MogContext/index.ts";
import { Prefix, PrefixOptions } from "@classes/core/Prefix/index.ts";

// ======================================
// CONFIGURATION OPTIONS VARIANTS
// Here we expose three variants of the configuration options:
// 1. The input configuration options, optionals and all
// 2. The strict configuration options, with all options required
// 3. The normalized configuration options, with all options required and coerced into a single type.
// NOTE: ILIAD: TODO: Is it worth making a library to handle this kind of thing?
// ======================================

export type MogContextInput = {
  prefixes?: Array<Prefix | PrefixOptions>;
  prefixOptions?: {
    prefixMarginRight?: number;
    applyToEmptyLogs?: boolean;
    joinString?: string;
  };
  spinnerOptions?: {
    defaultSpinnerColor: PolymorphicColor;
    spinnerFramesPerSecond: number;
  };
  overrideConsole?: boolean;
};

export type MogConfigStrict = {
  prefixes: Array<Prefix | PrefixOptions>;
  prefixOptions: {
    prefixMarginRight: number;
    applyToEmptyLogs: boolean;
    joinString: string;
  };
  spinnerOptions: {
    defaultSpinnerColor: PolymorphicColor;
    spinnerFramesPerSecond: number;
  };

  overrideConsole: boolean;
};

export type MogConfigNormalized = {
  prefixes: Array<Prefix>;
  prefixOptions: {
    applyToEmptyLogs?: boolean;
    prefixMarginRight: number;
    joinString: string;
  };
  spinnerOptions: {
    spinnerFramesPerSecond: number;
    defaultSpinnerColor: ColorFn;
  };

  overrideConsole: boolean;
};

// ======================================
// Utility types

export type LogFn = (chalk: ChalkInstance, ctx?: MogContext) => [...any];
export type FnLogGeneric = XOR<[LogFn], [...any]>;

export type LogTypes<CTS extends LogType[] = never> = {
  table: LogType;
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
