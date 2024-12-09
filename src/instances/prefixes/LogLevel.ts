// Types
import type { LogTypes } from "@classes/configuration/Configuration/types.ts";
import type { PolymorphicColor, ColorFn } from "@types";

// Classes
import { Prefix, PrefixOptions } from "@classes/core/Prefix/index.ts";
import { LogData } from "@classes/core/LogData/class.ts";

// Utils
import { getTimestamp, resolvePolymorphicColors } from "@utils";
import deepmerge from "deepmerge";

// typeColors: Record<keyof LogTypes, ColorFn>; // Move this to the prefix object?
//   typeColors: Record<keyof LogTypes, PolymorphicColor>;
//   log: "white",
//   info: "blue",
//   warn: "yellow",
//   error: "red",
//   debug: "green",
type LogLevelOptions = PrefixOptions & {
  typeColors?: Record<keyof LogTypes, PolymorphicColor>;
  typeLabels?: Record<keyof LogTypes, string>;
};

const defaults = {
  typeColors: {
    warn: "yellow",
    debug: "green",
    info: "blue",
    error: "red",
    log: "white",
  },
  typeLabels: {
    debug: "DBG",
    error: "ERR",
    warn: "WRN",
    info: "INF",
    log: "LOG",
  },
};
export class LogLevel extends Prefix {
  private typeColors: Record<keyof LogTypes, ColorFn>;
  private typeLabels: Record<keyof LogTypes, string>;

  constructor({ typeColors, typeLabels, ...config }: LogLevelOptions = {}) {
    super(config);

    typeColors = deepmerge(typeColors || {}, defaults.typeColors);
    typeLabels = deepmerge(typeLabels || {}, defaults.typeLabels);

    this.typeColors = resolvePolymorphicColors(typeColors);
    this.typeLabels = typeLabels;
  }

  private getTypeColor(type: keyof LogTypes): ColorFn {
    return this.typeColors[type];
  }

  private getTypeLabel(type: keyof LogTypes): string {
    return this.typeLabels[type];
  }

  getValue(logData: LogData): string {
    const { type } = logData.data;

    const colorFn = this.getTypeColor(type);
    const label = this.getTypeLabel(type);

    return colorFn(`[${label}]`);
  }
}

export const logLevel = new LogLevel(defaults);
