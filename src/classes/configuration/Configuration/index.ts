// Types
import { MogContextInput, MogConfigNormalized } from "./types.ts";

// Classes
import { Prefix } from "@classes/core/Prefix/index.ts";
import { MogContext } from "@classes/core/MogContext/index.ts";

// Utils - This is a stupid pattern.
import * as configUtils from "./utils.ts";

export class Configuration implements MogConfigNormalized {
  configObject: MogConfigNormalized;
  attachedContext: MogContext;
  prefixes: Array<Prefix>;

  constructor(thothConfigObject: MogContextInput, attachedContext: MogContext) {
    this.configObject = configUtils.normalizeConfig(
      thothConfigObject,
      attachedContext
    );

    this.prefixes = this.configObject.prefixes;
    this.attachedContext = attachedContext;
  }

  // Get functions from the config object that are called at different points in the log lifecycle.
  // ILIAD: TODO: Create lifecycle hooks
  private get bootstrap() {
    return {};
  }

  get spinnerOptions() {
    return this.configObject.spinnerOptions;
  }

  get prefixOptions() {
    return this.configObject.prefixOptions;
  }

  get overrideConsole(): boolean {
    return this.configObject.overrideConsole;
  }
}
