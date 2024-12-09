// Types
import type { TimeStampComponents } from "@instances/prefixes/TimeStamp.ts";
import type { PadType } from "@types";

// Utils
import { Transform } from "node:stream";
import { Console } from "node:console";

function validateArray(value: unknown): asserts value is any[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`Expected an array but received ${typeof value}`);
  }
}

function ensureMsLength(ms: number): string {
  return `${ms}`.padStart(3, "0");
}
type GetTimeStampOptions = {
  toLocaleStringOptions?: Intl.DateTimeFormatOptions;
  tsComponents: TimeStampComponents[];
  timestampMs?: number;
};
export function getTimestamp({
  toLocaleStringOptions,
  tsComponents,
  timestampMs,
}: GetTimeStampOptions): string {
  let finalComponents: string[] = [];

  const components = [tsComponents].flat();
  const now = timestampMs ? new Date(timestampMs) : new Date();

  if (components.includes("date")) {
    const date = now.toLocaleDateString(undefined, toLocaleStringOptions);
    finalComponents.push(date);
  }

  if (components.includes("time")) {
    let time = now.toLocaleTimeString(undefined, {
      ...toLocaleStringOptions,
      hour12: toLocaleStringOptions?.hour12 ?? false,
    });

    if (components.includes("milliseconds")) {
      time += `.${ensureMsLength(now.getMilliseconds())}`;
    }

    finalComponents.push(time);
  }

  return finalComponents.join(" ");
}
type PadFn = (str: string, length: number) => string;
export function resolvePadType(padType: PadType): PadFn {
  switch (padType) {
    case "left":
      return (str, length) => str.padStart(length);
    case "right":
      return (str, length) => str.padEnd(length);
    case "center":
      return (str, length) => str.padStart(length / 2).padEnd(length);
    case "none":
      return (str) => str;
  }
}

export function formatMs(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  let final = "";

  if (hours) final += `${hours}h `;
  if (minutes) final += `${minutes % 60}m `;
  if (seconds) final += `${seconds % 60}s `;
  final += `${ms % 1000}ms`;

  return final;
}

// const {
//   ArrayPrototypeJoin,
//   ArrayPrototypeMap,
//   MathCeil,
//   MathMax,
//   MathMaxApply,
//   ObjectPrototypeHasOwnProperty,
//   StringPrototypeRepeat,
// } = primordials;

import * as util from "util";

// The use of Unicode characters below is the only non-comment use of non-ASCII
// Unicode characters in Node.js built-in modules. If they are ever removed or
// rewritten with \u escapes, then a test will need to be (re-)added to Node.js
// core to verify that Unicode characters work in built-ins.
// Refs: https://github.com/nodejs/node/issues/10673
const tableChars = {
  /* eslint-disable node-core/non-ascii-character */
  middleMiddle: "─",
  rowMiddle: "┼",
  topRight: "┐",
  topLeft: "┌",
  leftMiddle: "├",
  topMiddle: "┬",
  bottomRight: "┘",
  bottomLeft: "└",
  bottomMiddle: "┴",
  rightMiddle: "┤",
  left: "│ ",
  right: " │",
  middle: " │ ",
  /* eslint-enable node-core/non-ascii-character */
};

function isString(str: unknown): str is string {
  return typeof str === "string";
}

function validateString(str: unknown) {
  if (!isString(str)) throw new TypeError("Expected a string");
}

/**
 * Remove all VT control characters. Use to estimate displayed string width.
 */
function stripVTControlCharacters(str: string) {
  const regex = new RegExp(
    "[\x1b\x9b\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]"
  );
  validateString(str);

  return regex ? str.replace(regex, "") : str;
  // return RegExpPrototypeSymbolReplace(ansi, str, '');
}

function isFullWidthCodePoint(code: number): boolean {
  return (
    (code >= 0x1100 && code <= 0x115f) || // Hangul Jamo
    (code >= 0x2329 && code <= 0x232a) || // Angle brackets
    // Additional ranges for full-width characters
    (code >= 0x2e80 && code <= 0x303e) || // CJK
    (code >= 0x3040 && code <= 0xa4cf) || // Japanese, Hangul
    (code >= 0xac00 && code <= 0xd7a3) || // Hangul
    (code >= 0xf900 && code <= 0xfaff) || // CJK Compatibility Ideographs
    (code >= 0xff01 && code <= 0xff60) || // Fullwidth Forms
    (code >= 0xffe0 && code <= 0xffe6) // Fullwidth currency symbols
  );
}

function isZeroWidthCodePoint(code: number): boolean {
  return (
    (code >= 0x200b && code <= 0x200f) || // Zero-width space and marks
    (code >= 0x2028 && code <= 0x202e) || // Line separators and direction marks
    code === 0xfeff // Byte Order Mark (BOM)
  );
}

function getStringWidth(str: string, removeControlChars = true): number {
  if (removeControlChars) {
    str = str.replace(/\x1B\[[0-9;]*m/g, ""); // Remove ANSI escape codes (VT control chars)
  }

  str = str.normalize("NFC");
  let width = 0;

  for (const char of str) {
    const code = char.codePointAt(0);
    if (code === undefined) continue;
    width += isFullWidthCodePoint(code)
      ? 2
      : isZeroWidthCodePoint(code)
      ? 0
      : 1;
  }

  return width;
}

const renderRow = (row: string[], columnWidths: number[]) => {
  let out = tableChars.left;

  for (let i = 0; i < row.length; i++) {
    const cell = row[i];
    // @ts-ignore
    const len = getStringWidth(cell);

    // @ts-ignore
    const needed = columnWidths[i] - len;

    // round(needed) + ceil(needed) will always add up to the amount
    // of spaces we need while also left justifying the output.
    out += cell + " ".repeat(Math.ceil(needed));
    if (i !== row.length - 1) out += tableChars.middle;
  }

  out += tableChars.right;
  return out;
};

const cliTable = (head: string[], columns: object[][]) => {
  const rows = [];
  const columnWidths = head.map((h) => getStringWidth(h));

  const longestColumn = Math.max(...columns.map((a) => a.length));

  for (let i = 0; i < head.length; i++) {
    const column = columns[i] as any;

    for (let j = 0; j < longestColumn; j++) {
      if (rows[j] === undefined) rows[j] = [];

      // @ts-ignore
      const value = (rows[j][i] = column.hasOwnProperty(j) ? column[j] : "");

      const width = columnWidths[i] || 0;
      const counted = getStringWidth(value);
      columnWidths[i] = Math.max(width, counted);
    }
  }

  const divider = columnWidths.map((i) => "-".repeat(i));

  let result =
    tableChars.topLeft +
    divider.join(tableChars.topMiddle) +
    tableChars.topRight +
    "\n" +
    renderRow(head, columnWidths) +
    "\n" +
    tableChars.leftMiddle +
    divider.join(tableChars.middleMiddle) +
    tableChars.rightMiddle +
    "\n";

  for (const row of rows) result += `${renderRow(row, columnWidths)}\n`;

  result +=
    tableChars.bottomLeft +
    divider.join(tableChars.bottomMiddle) +
    tableChars.bottomRight;

  return result;
};

const kGetInspectOptions = Symbol("kGetInspectOptions");

type Entry = [any, any];
type PreviewResult = [Entry[], boolean];

const keyKey = "Key";
const valuesKey = "Values";
const indexKey = "(index)";
const iterKey = "(iteration index)";

function previewEntries(
  value: any,
  isIterator: boolean = false
): PreviewResult {
  const entries: Entry[] = [];
  let isKeyValue = false;

  if (
    value instanceof Map ||
    (isIterator && value instanceof Map.prototype[Symbol.iterator])
  ) {
    isKeyValue = true;
    for (const [key, val] of value as Map<any, any>) {
      entries.push([key, val]);
    }
  } else if (
    value instanceof Set ||
    (isIterator && value instanceof Set.prototype[Symbol.iterator])
  ) {
    for (const val of value as Set<any>) {
      entries.push([val, val]);
    }
  } else {
    throw new Error("Unsupported data structure");
  }

  return [entries, isKeyValue];
}

class TableFormatter {
  private transform: Transform;
  private logger: Console;
  private [kGetInspectOptions]: (stdout: NodeJS.WritableStream) => object =
    () => ({});

  constructor() {
    this.transform = new Transform({
      transform(chunk, _enc, cb) {
        cb(null, chunk);
      },
    });

    this.logger = new Console({
      stdout: this.transform,
      inspectOptions: {
        colors: true,
      },
    });
  }

  format(data: any) {
    this.logger.table(data);
    return this.transform.read().toString();
  }

  table(tabularData: any, properties?: string[]) {
    if (properties !== undefined) validateArray(properties);

    if (tabularData === null || typeof tabularData !== "object") {
      return console.log(tabularData);
    }

    const final = (keys: string[], values: any[]) => {
      return cliTable(keys, values);
    };

    const _inspect = (value: any) => {
      const depth =
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length > 2
          ? -1
          : 0;

      // const options = {
      //   ...this[kGetInspectOptions](this.transform),
      //   maxArrayLength: 3,
      //   breakLength: Infinity,
      //   ...this[kGetInspectOptions](this._stdout),
      // };

      return util.inspect(value);
    };

    const getIndexArray = (length: number) =>
      Array.from({ length }, (_, i) => _inspect(i));

    const mapIter = util.types.isMapIterator(tabularData);
    let isKeyValue = false;
    let i = 0;

    if (mapIter) {
      const res = previewEntries(tabularData, true);
      tabularData = res[0];
      isKeyValue = res[1];
    }

    if (isKeyValue || util.types.isMap(tabularData)) {
      const keys: any[] = [];
      const values: any[] = [];
      let length = 0;

      if (mapIter) {
        for (; i < tabularData.length / 2; ++i) {
          keys.push(_inspect(tabularData[i * 2]));
          values.push(_inspect(tabularData[i * 2 + 1]));
          length++;
        }
      } else {
        for (const [key, value] of tabularData) {
          keys.push(_inspect(key));
          values.push(_inspect(value));
          length++;
        }
      }

      return final(
        [iterKey, keyKey, valuesKey],
        [getIndexArray(length), keys, values]
      );
    }

    const setIter = util.types.isSetIterator(tabularData);
    if (setIter) {
      tabularData = previewEntries(tabularData);
    }

    const setlike = setIter || mapIter || util.types.isSet(tabularData);
    if (setlike) {
      const values: any[] = [];
      let length = 0;

      for (const value of tabularData) {
        values.push(_inspect(value));
        length++;
      }

      return final([iterKey, valuesKey], [getIndexArray(length), values]);
    }

    const map: { [key: string]: any[] } = Object.create(null);
    let hasPrimitives = false;
    const valuesKeyArray: any[] = [];
    const indexKeyArray = Object.keys(tabularData);

    for (; i < indexKeyArray.length; i++) {
      const key = indexKeyArray[i];
      if (key === undefined) continue;
      const item = tabularData[key];
      const isPrimitive =
        item === null ||
        (typeof item !== "function" && typeof item !== "object");

      if (properties === undefined && isPrimitive) {
        hasPrimitives = true;
        valuesKeyArray[i] = _inspect(item);
      } else {
        const keys = properties || Object.keys(item);
        for (const key of keys) {
          map[key] ??= [];
          if (
            (isPrimitive && properties) ||
            !Object.prototype.hasOwnProperty.call(item, key)
          ) {
            map[key][i] = "";
          } else {
            map[key][i] = _inspect(item[key]);
          }
        }
      }
    }

    const keys = Object.keys(map);
    const values = Object.values(map);

    if (hasPrimitives) {
      keys.push(valuesKey);
      values.push(valuesKeyArray);
    }

    keys.unshift(indexKey);
    values.unshift(indexKeyArray);

    return final(keys, values);
  }
}

export function formatTable(data: any) {
  return new TableFormatter().table(data);
}
