import type { MogContextConfigObject } from "../classes/MogContext/index.ts";
import { MogContext } from "../classes/MogContext/index.ts";

function getGlobal() {
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }

  throw new Error("Unable to find global object");
}

const _global = getGlobal();

declare var console: MogContext;

declare global {
  type Console = MogContext;
  // var console: MogContext;
  // interface Console extends MogContext {}
  // export namespace console {
  //   type MogContextKeys = keyof MogContext;
  //   const console: { [K in MogContextKeys]: MogContext[K] };
  // }
  // // Add an optional type for console only after `mog` is invoked
  // // @ts-ignore
  // // var console: MogContext;
  // interface Console extends MogContext {}
  // // var console: MogContext;
}

// Scoped type guard function
export function mog<T extends MogContext = MogContext>(
  console: Console,
  options?: MogContextConfigObject,
  // @ts-ignore
): asserts console is T {
  const mogContext = new MogContext(options, console); // Replace global console;
  if (!(_global.console instanceof MogContext)) {
    (_global.console as any) = mogContext;
  }

  global.console.log = mogContext.log;
}
