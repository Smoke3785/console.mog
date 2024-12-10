// Classes
import { Prefix, PrefixOptions } from "@classes/core/Prefix/index.ts";
import { LogData } from "@classes/core/LogData/class.ts";

// Utils
import { resolvePadType } from "@utils";
import * as utils from "@utils";
import chalk from "chalk";

// Types
import { PolymorphicColor, ColorFn } from "@types";

type HttpMethodOptions = PrefixOptions & {
  padShorterMethods?: boolean;
  replaceLogLevel?: boolean;
  color?: PolymorphicColor;
};

const defaults = {
  padShorterMethods: false,
  replaceLogLevel: true,
  color: chalk.green,
};

export class HttpMethod extends Prefix {
  private replaceLogLevel: boolean;
  private padFn: (a: any, n: number) => any;
  private colorFn: ColorFn;

  constructor({
    padShorterMethods,
    replaceLogLevel,
    color,
    ...config
  }: HttpMethodOptions = {}) {
    super({ name: "httpMethod", ...config });

    this.padFn = padShorterMethods
      ? resolvePadType("left")
      : (a: any, n: number) => a;

    this.colorFn = utils.resolvePolymorphicColor(color);
    this.replaceLogLevel = replaceLogLevel ?? defaults.replaceLogLevel;
  }

  // This is where we specify options we want to expose to global context
  get config() {
    return {
      replaceLogLevel: this.replaceLogLevel,
    };
  }

  getValue(logData: LogData): string {
    if (!logData.additionalContext?.httpMethod) return "";
    const method = this.padFn(logData.additionalContext.httpMethod, 4);
    return `[${chalk.green(method)}]`;
  }
}

export const httpMethod = new HttpMethod(defaults);
