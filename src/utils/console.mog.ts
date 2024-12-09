import type { MogContextConfigObject } from "../classes/core/MogContext/index.ts";
import { MogContext } from "../classes/core/MogContext/index.ts";

function getGlobal() {
  if (typeof window !== "undefined") {
    return window;
  }

  if (typeof global !== "undefined") {
    return global;
  }

  throw new Error("Unable to find global object");
}

// Scoped type guard function
export function mog<T extends MogContext = MogContext>(
  console: Console,
  options?: MogContextConfigObject
  // @ts-ignore
): asserts console is T {
  const mogContext = new MogContext(options, console); // Replace global console;
  const _global = getGlobal();

  if (!(_global.console instanceof MogContext)) {
    (_global.console as any) = mogContext;
  }

  global.console.log = mogContext.log;
}
