// Types
import type { ColorFn, PolymorphicColor } from "@types";

// Classes
import { MogContext } from "@classes/core/MogContext/class.ts";

export type PrefixOptions = {
  value?: string | PrefixCallback;
  color?: PolymorphicColor;
  index?: number;
  name?: string;
};

export type StrictPrefixOptions = {
  value: string | PrefixCallback;
  color: PolymorphicColor;
  name: string;
};

export type NormalizedPrefixOptions = {
  value: PrefixCallback;
  color: ColorFn;
  name: string;
};

// Utility Types
export type PrefixCallback = (context: MogContext["context"]) => string;
