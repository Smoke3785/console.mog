// Types
import type { PrefixCallback, PrefixOptions } from "./types.ts";
import type { ColorFn } from "@types";

// Classes
import { MogContext } from "../MogContext/class.ts";

// Utils
import { normalizeOptions } from "./utils.ts";
import { LogData } from "../LogData/class.ts";
import * as utils from "@utils";

export class Prefix {
  private valueCallback: PrefixCallback;
  private colorCallback: ColorFn;

  // This will be injected later, trust the plan.
  // This is an objectively stupid pattern, I know.
  private context!: MogContext;
  private name: string;

  constructor(options: PrefixOptions = {}) {
    // Normalize the options into callbacks
    const normalizedOptions = normalizeOptions(options);

    // Assign normalized options
    this.valueCallback = normalizedOptions.value;
    this.colorCallback = normalizedOptions.color;
    this.name = normalizedOptions.name;
  }

  // This is a stupid pattern. Refactor later.
  protected injectContext(context: MogContext): Prefix {
    this.context = context;
    return this;
  }

  // These aren't useful, but they're nice utility for when I extend this class.
  getValue(logData?: LogData): string {
    return this.colorCallback(this.valueCallback(this.context));
  }

  protected getContext(): MogContext["context"] {
    return this.context.context;
  }

  protected getColorFn(): ColorFn {
    return this.colorCallback;
  }

  protected defaultOptions(): PrefixOptions {
    return {
      value: () => "Default Value",
      name: "Default Name",
      color: "white",
    };
  }

  // This is the final getter that will be used by the MogContext
  get value(): string {
    const value = this.getValue();
    return this.colorCallback(value);
  }
}
