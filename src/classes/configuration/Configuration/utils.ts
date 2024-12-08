// Types
import {
  ThothConfigNormalized,
  ThothConfigStrict,
  ThothConfigInput,
} from "./types.ts";

// Utils
import deepmerge from "deepmerge";
import * as u from "@utils";

// Data
import { defaultThothConfig } from "./data.ts";
import { ColorFn, PolymorphicColor } from "@types";

export function normalizeConfig(
  config: ThothConfigInput,
): ThothConfigNormalized {
  const merged = mergeConfig(config);
  merged.prefix = normalizePrefixes(merged.prefix);
  merged.typeColors = normalizeColors(merged.typeColors);

  return merged as ThothConfigNormalized;
}

export function hexToRgb(hex: string): [number, number, number] {
  const hexValue = hex.replace("#", "");
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);
  return [r, g, b];
}

export function mergeConfig(config: ThothConfigInput): ThothConfigStrict {
  return deepmerge(config, defaultThothConfig, u.dmo) as ThothConfigStrict;
}

export function normalizeColors(
  colors: ThothConfigStrict["typeColors"],
): ThothConfigStrict["typeColors"] {
  const normalizedColors: Record<string, ColorFn> = {};
  for (const key in colors) {
    const color: PolymorphicColor = (colors as any)[key];
    normalizedColors[key] = u.normalizePolymorphicColor(color);
  }
  return normalizedColors;
}

export function normalizePrefixes(
  prefixes: ThothConfigStrict["prefix"],
): ThothConfigStrict["prefix"] {
  //  Recursive over object. If key is color, run normalizePolymorphicColor
  const { timestamp, namespace, module, ...rest } = prefixes;
  const defaultFn = (color: string) => color;

  return {
    ...rest,
    timestamp: {
      ...timestamp,
      color: u.normalizePolymorphicColor(timestamp.color),
      fn: timestamp?.fn || defaultFn,
    },
    namespace: {
      ...namespace,
      color: u.normalizePolymorphicColor(namespace.color),
      fn: namespace?.fn || defaultFn,
    },
    module: {
      ...module,
      color: u.normalizePolymorphicColor(module.color),
      fn: module?.fn || defaultFn,
    },
  };
}

// export function normalizeModuleConfig(
//   module: ModuleParam
// ): Partial<StrictModuleParam> {
//   if (typeof module !== "string") return module;

//   return {
//     enabled: true,
//     name: module,
//   };
// }
