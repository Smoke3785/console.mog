// Utility Types
import "@iliad.dev/ts-utils/@types";

// Import Prefixes
export * from "./instances/prefixes/index.ts";

// Import public utils
import { MogContext } from "./classes/core/MogContext/index.ts";
import { Prefix } from "@classes/core/Prefix/class.ts";
import { mog, createPrefix } from "@utils";

// Utility functions
export { createPrefix, Prefix };

// OOP stuff
export { MogContext };

// Default export
export default mog;
export { mog };
