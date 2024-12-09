// Types
import {
  MogConfigNormalized,
  MogConfigStrict,
  MogContextInput,
} from "./types.ts";

// Classes
import { MogContext } from "@classes/core/MogContext/class.ts";
import { Prefix } from "@classes/core/Prefix/class.ts";

// Utils
import deepmerge from "deepmerge";
import * as u from "@utils";

// Data
import { defaultMogConfig } from "./data.ts";
import { ColorFn, PolymorphicColor } from "@types";
import { PrefixOptions } from "@classes/core/Prefix/types.ts";

export function normalizeConfig(
  config: MogContextInput,
  attachedContext: MogContext
): MogConfigNormalized {
  const merged = mergeConfig(config);

  if (!merged.prefixes) merged.prefixes = [];
  merged.prefixes = merged.prefixes.map((prefix) => {
    const _prefix = prefix instanceof Prefix ? prefix : new Prefix(prefix);
    // @ts-ignore
    return _prefix.injectContext(attachedContext);
  });

  merged.spinnerOptions.defaultSpinnerColor = u.normalizePolymorphicColor(
    merged.spinnerOptions.defaultSpinnerColor
  );

  return merged as MogConfigNormalized;
}

export function hexToRgb(hex: string): [number, number, number] {
  const hexValue = hex.replace("#", "");
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);
  return [r, g, b];
}

export function mergeConfig(config: MogContextInput): MogConfigStrict {
  const merged = deepmerge(config, defaultMogConfig, u.dmo) as MogConfigStrict;
  merged.prefixes = [config.prefixes]
    .flat()
    .filter((x): x is PrefixOptions => !!x);

  return merged;
}

// export function normalizeColors(
//   colors: MogConfigStrict["typeColors"]
// ): MogConfigStrict["typeColors"] {
//   const normalizedColors: Record<string, ColorFn> = {};
//   for (const key in colors) {
//     const color: PolymorphicColor = (colors as any)[key];
//     normalizedColors[key] = u.normalizePolymorphicColor(color);
//   }
//   return normalizedColors;
// }

// export function normalizePrefixes(
//   prefixes: MogConfigStrict["prefix"]
// ): MogConfigStrict["prefix"] {
//   //  Recursive over object. If key is color, run normalizePolymorphicColor
//   const { timestamp, namespace, module, ...rest } = prefixes;
//   const defaultFn = (color: string) => color;

//   return {
//     ...rest,
//     timestamp: {
//       ...timestamp,
//       color: u.normalizePolymorphicColor(timestamp.color),
//       fn: timestamp?.fn || defaultFn,
//     },
//     namespace: {
//       ...namespace,
//       color: u.normalizePolymorphicColor(namespace.color),
//       fn: namespace?.fn || defaultFn,
//     },
//     module: {
//       ...module,
//       color: u.normalizePolymorphicColor(module.color),
//       fn: module?.fn || defaultFn,
//     },
//   };
// }

// export function normalizeModuleConfig(
//   module: ModuleParam
// ): Partial<StrictModuleParam> {
//   if (typeof module !== "string") return module;

//   return {
//     enabled: true,
//     name: module,
//   };
// }
