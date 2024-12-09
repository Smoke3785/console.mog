// Types
import type { LogDataInput, OrganizedTableData } from "./types.ts";

// Classes
import { DOM } from "@classes/core/DOM/class.ts";
import { Log, TableLog } from "@classes/core/Log/index.ts";
import { memoizeDecorator } from "memoize";

// Utils
import wrapAnsi from "wrap-ansi";
import Table from "cli-table";
import util from "util";

import { normalizeTableData } from "./utils.ts";
import * as utils from "@utils";

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

  private joinComponents(
    components: Array<string | undefined | null>,
    joinString: string
  ): string {
    return components.filter((c) => c).join(joinString);
  }

  private getPrefixValues(): string[] {
    return this.root.config.prefixes.map((prefix) => {
      return prefix.getValue(this);
    });
  }

  @memoizeDecorator()
  memoizedLinesConsumed(key: number): number {
    // No silly algorithm now. We just rely on ansiWrap to tell us how many lines were consumed.
    return this.toString().split("\n").length;
  }

  @memoizeDecorator()
  private tableToString(dataKey: number): string {
    const { tableData } = this.log as TableLog;
    const data: OrganizedTableData = normalizeTableData(tableData);

    const table = new Table({
      style: { head: ["reset"] },
      head: data.headers,
      colors: false,
      // style: data.styles,
    });

    table.push(...data.data);

    return table.toString();
  }

  @memoizeDecorator()
  private memoizedToString(dataKey: number): string {
    const prefixComponents: Array<string | undefined | null> = [];
    const dataComponents: Array<string | undefined | null> = [];

    // Get configuration
    const { joinString, prefixMarginRight, applyToEmptyLogs } =
      this.root.config.prefixOptions;
    const spacing = " ".repeat(prefixMarginRight);

    // Destructure data
    const { treePrefix, data, type, raw } = this.data;
    const isEmpty = data.trim() === "";

    if (raw) {
      // These are logs intercepted from the console
      const line = this.joinData(data);
      return util.format(line);
    }

    if (type == "table") {
      process.stdout.write(util.format(data + "te"));
      return this.tableToString(dataKey);
    }

    // If the log is empty and the config says not to apply prefixes to empty logs, return an empty string
    if (isEmpty && !applyToEmptyLogs) return "";

    // Assembly the component arrays
    prefixComponents.push(...this.getPrefixValues());
    dataComponents.push(treePrefix, this.joinData(data)); // This doesn't need to be nested here, I don't think...

    // Construct the line
    const linePt1 = this.joinComponents(prefixComponents, joinString);
    const linePt2 = this.joinComponents(dataComponents, " ");
    const line = `${linePt1}${spacing}${linePt2}`;

    // Again, if the log is empty, return the line as is. We can skip expensive formatting.
    if (isEmpty) return line;

    // Format the string with util.format. Not certain if this changes anything.
    const nodeFormatted = util.format(line);

    // Wrap with ansi-wrap. This is a more predictable way to wrap than trying to derive from the terminal width.
    const ansiWrapped = this.wrapAnsi(nodeFormatted);
    this.lines = ansiWrapped.split("\n");

    return ansiWrapped;
  }

  public toString(): string {
    return this.memoizedToString(this.dataKey);
  }
}
