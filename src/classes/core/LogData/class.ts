// Types
import type { LogDataInput } from "./types.ts";

// Classes
import { DOM } from "@classes/DOM/class.ts";
import { Log } from "@classes/Log/index.ts";
import { memoizeDecorator } from "memoize";

// Utils
import wrapAnsi from "wrap-ansi";
import * as u from "@utils";
import chalk from "chalk";
import util from "util";

// Data
import { wrapAnsiConfig } from "./data.ts";

// Holds data for each log node in the tree
// And holds the rendering logic for each log node
export class LogData {
  _data!: LogDataInput;
  root: DOM;
  log: Log; // The associated log node

  // Simple cache of the rendered lines. Produced as a side effect toString()
  lines: string[] = [];

  // Memoization keys
  private dataKey = 0; // This is used to invalidate memoized values

  constructor(root: DOM, log: Log, data: LogDataInput) {
    this.root = root;
    this.data = data;
    this.log = log;
  }

  set data(data: LogDataInput) {
    this._data = data;
    this.dataKey++;
  }

  get data(): LogDataInput {
    return this._data;
  }

  get mfgStamp(): boolean {
    return this.root.config.prefix.mfgStamp.enabled;
  }

  get linesConsumed(): number {
    return this.memoizedLinesConsumed(this.dataKey);
  }

  // =========================
  // Utility methods
  // ====------

  private joinData(...args: any[]): string {
    return args.join("");
  }

  private wrapAnsi(line: string): string {
    return wrapAnsi(line, process.stdout.columns, wrapAnsiConfig);
  }

  private joinComponents(components: Array<string | undefined | null>): string {
    return components.filter((c) => c).join("");
  }

  private getTypeString(type: LogDataInput["type"]): string {
    return {
      info: "INF",
      log: "LOG",
      warn: "WRN",
      error: "ERR",
      debug: "DBG",
    }[type];
  }

  private getTypePrefix(type: LogDataInput["type"]): string {
    const fn = this.root.config.typeColors[type];
    const typeString = this.getTypeString(type);

    return fn(`[${typeString}]`);
  }

  private getDateString(timestamp: number): string {
    const { components, color, fn } = this.root.config.prefix.timestamp;
    const stampString = u.getTimestamp(components, timestamp);

    return fn(color(stampString));
  }

  @memoizeDecorator()
  memoizedLinesConsumed(key: number): number {
    // No silly algorithm now. We just rely on ansiWrap to tell us how many lines were consumed.
    return this.toString().split("\n").length;
  }

  @memoizeDecorator()
  private memoizedToString(dataKey: number): string {
    const components: Array<string | undefined | null> = [];
    const { treePrefix, namespace, module, type, data, raw, timestamp } =
      this.data;

    // These are logs intercepted from the console
    if (raw) {
      const line = this.joinData(data);
      return util.format(line);
    }

    if (this.mfgStamp) {
      components.push(chalk.hex("#00ace0")("◭"), " ");
    }

    if (timestamp && !isNaN(Number(timestamp))) {
      components.push(this.getDateString(Number(timestamp)));
    }

    components.push(
      namespace,
      // module,
      `(${chalk.magentaBright(this.log.uid)}) `,
      this.getTypePrefix(type),
      treePrefix,
      " ",
      this.joinData(data),
    );

    const line = this.joinComponents(components); // Assemble components into a single string
    const nodeFormatted = util.format(line); // Format the string with util.format. Not certain if this changes anything.

    // Wrap with ansi-wrap. This is a more predictable way to wrap than trying to derive from the terminal width.
    const ansiWrapped = this.wrapAnsi(nodeFormatted);
    this.lines = ansiWrapped.split("\n");

    return ansiWrapped;
  }

  public toString(): string {
    return this.memoizedToString(this.dataKey);
  }
}
