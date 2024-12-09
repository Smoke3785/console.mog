// Types
import type { NormalizedPrefixOptions, PrefixOptions } from "./types.ts";

// Utils
import { memoized_resolvePolymorphicColor } from "@utils";
import { uid } from "uid";

export function normalizeOptions(
  options: PrefixOptions
): NormalizedPrefixOptions {
  const vCb = () => options.value as string;

  const colorCallback = options.color
    ? memoized_resolvePolymorphicColor(options.color)
    : () => "white";
  const valueCallback =
    typeof options.value !== "function" ? vCb : options.value;

  return {
    name: options?.name ?? uid(16),
    value: valueCallback,
    color: colorCallback,
  };
}
