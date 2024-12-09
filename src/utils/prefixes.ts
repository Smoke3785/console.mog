import { Prefix, PrefixOptions } from "@classes/core/Prefix/index.ts";

// NOTE: ILIAD: TODO: This whole prefix API needs to be clarified a bit. Createprefix should be a callback that returns a prefix object.
// That can be instantiated as a class later, internally.
export function createPrefix(options: PrefixOptions): Prefix {
  return new Prefix(options);
}
