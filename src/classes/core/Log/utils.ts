import type {
  CreateChildOptions,
  LogVariantRegistry,
  VariantName,
  LogParams,
} from "./types.ts";
import { Log, PowerLog, RawLog, MogLog } from "./index.ts";
import { DOM } from "@classes/core/DOM/class.ts";

export function createChildOptions<T extends VariantName = "mogLog">(
  variant: T,
  logParams: LogParams
): CreateChildOptions<T> {
  return {
    variant: variant as T,
    logParams,
  };
}

export function createChildLog<T extends VariantName>(
  parent: Log | DOM,
  options: CreateChildOptions<T>,
  arguments_: any[] | string = ""
): LogVariantRegistry[T] {
  const { logParams, variant = "log" } = options;
  const arguments__ = [arguments_].flat(1);
  let child: Log;

  // No matter where the options were created,
  // We must explicitly set the parent
  logParams.parent = parent;

  switch (variant) {
    case "powerLog": {
      child = new PowerLog(logParams, arguments__[0]); // Power log is special, only takes a string.
      break;
    }
    case "mogLog": {
      child = new MogLog(logParams, arguments__);
      break;
    }
    case "rawLog": {
      child = new RawLog(logParams, arguments__);
      break;
    }
    default: {
      child = new MogLog(logParams, arguments__);
    }
  }

  return child as LogVariantRegistry[T];
}

export function centerTitleInHr(char: string, title?: string) {
  char = `${char}`;

  let cols = process.stdout.columns;
  let charNo = cols / char.length;

  if (!title) return char.repeat(charNo);

  const isOdd = cols % 2 !== 0;
  if (isOdd) cols -= 1;

  const eachSide = Math.floor((cols - title.length - 2) / 2);

  const baseSpace = isOdd ? " " : "";

  const leftChars = char.repeat(eachSide / char.length);
  const rightChars = [...leftChars].reverse().join("");

  return baseSpace + leftChars + ` ${title} ` + rightChars;
}
