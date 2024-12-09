import type { TableDataInput, OrganizedTableData } from "./types.ts";
import * as utils from "@utils";
import chalk from "chalk";

function isObject(value: any): value is Record<string, any> {
  return typeof value === "object" && value !== null;
}

function isNumber(value: any): value is number {
  return typeof value === "number" && !isNaN(value);
}

function isString(value: any): value is string {
  return typeof value === "string";
}

function isBoolean(value: any): value is boolean {
  return typeof value === "boolean";
}

function isFunction(value: any): value is Function {
  return typeof value === "function";
}

function isSymbol(value: any): value is symbol {
  return typeof value === "symbol";
}

function isBigInt(value: any): value is bigint {
  return typeof value === "bigint";
}

function isUndefined(value: any): value is undefined {
  return value === undefined;
}

function isNull(value: any): value is null {
  return value === null;
}

function style(value: any): string {
  if (isString(value)) {
    return chalk.green(value);
  }

  if (isNumber(value)) {
    return chalk.blue(value);
  }

  if (isBoolean(value)) {
    return chalk.yellow(value);
  }

  if (isFunction(value)) {
    return chalk.magenta(value);
  }

  if (isSymbol(value)) {
    return chalk.cyan(value);
  }

  if (isBigInt(value)) {
    return chalk.red(value);
  }

  if (isUndefined(value)) {
    return chalk.gray("undefined");
  }

  if (isNull(value)) {
    return chalk.gray("null");
  }

  if (isObject(value)) {
    return chalk.gray("[object Object]");
  }

  return chalk.gray(value);
}

export function normalizeTableData(
  data: TableDataInput,
  applyTypeStyles: boolean = true
): OrganizedTableData {
  let { headers, data: _data, styles, type } = data;
  let _headers: Array<number | string> = type === "array" ? _data[0] : [];
  let __data: Array<any[]> = type === "array" ? _data[1] : [];

  const typeFn = applyTypeStyles ? style : (a: any) => a;

  if (type !== "array") {
    if (Array.isArray(_data)) {
      // If _data is an array of objects, extract headers and values
      if (_data.every((item) => isObject(item))) {
        _headers = Array.from(
          new Set(_data.flatMap((item) => Object.keys(item)))
        );
        __data = _data.map((item) =>
          _headers.map((header) => (header in item ? item[header] : null))
        );
      } else {
        // _data is a simple array
        _headers = _data.map((_, index) => index);
        __data = [_data];
      }
    } else if (isObject(_data)) {
      // If _data is an object, process its entries
      for (let [key, value] of Object.entries(_data)) {
        _headers.push(key);
        if (Array.isArray(value)) {
          __data.push(value);
        } else if (isObject(value)) {
          __data.push(Object.values(value));
        } else {
          __data.push([value]); // Wrap non-object values into an array
        }
      }
    }
  }

  return {
    headers: (headers || _headers).map((header) =>
      chalk.bold(chalk.whiteBright(String(header)))
    ),
    data: __data.map((row) => row.map((cell) => typeFn(cell))),
    styles,
  };
}
