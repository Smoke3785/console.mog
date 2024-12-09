// Types
export type TimeStampComponents = "date" | "time" | "milliseconds";

// Classes
import { Prefix, PrefixOptions } from "@classes/core/Prefix/index.ts";

// Utils
import { getTimestamp } from "@utils";

type TimestampOptions = PrefixOptions & {
  components: TimeStampComponents | TimeStampComponents[];
  toLocaleStringOptions?: Intl.DateTimeFormatOptions;
  updateOnLogUpdate?: boolean;
};

// Timestamp is re-calculated every time it is called
export class TimeStamp extends Prefix {
  private toLocaleStringOptions?: Intl.DateTimeFormatOptions;
  private components: TimeStampComponents[];
  private updateOnLogUpdate: boolean;

  private instantiationTime: number = Date.now();

  constructor({
    toLocaleStringOptions,
    updateOnLogUpdate,
    components,
    ...config
  }: TimestampOptions) {
    super(config);

    // Ensure components is an array
    this.components = [components].flat();
    this.toLocaleStringOptions = toLocaleStringOptions;
    this.updateOnLogUpdate = updateOnLogUpdate ?? false;
  }

  getValue(): string {
    const options: any = {
      toLocaleStringOptions: this.toLocaleStringOptions,
      tsComponents: this.components,
    };

    if (!this.updateOnLogUpdate) {
      options.timestampMs = this.instantiationTime;
    }

    return `[${getTimestamp(options)}]`;
  }
}

export const timeStamp = new TimeStamp({
  components: ["time"],
  color: "gray",
});
