// Types
import { PolymorphicColor, ColorFn, RGBColor, HexColor, PadType } from "@types";

// Utils
import chalk, { ForegroundColorName, BackgroundColorName } from "chalk";
import * as u from "@utils";
import util from "util";
import { ThothConfigStrict } from "@classes/Configuration/types.ts";

export function formatToBuffer(args: unknown[]): Buffer {
  // Convert arguments to a string, separating by spaces, and add a newline
  const formattedString =
    args
      .map((arg) =>
        typeof arg === "object" && arg !== null
          ? JSON.stringify(arg)
          : String(arg),
      )
      .join(" ") + "\n";

  // Create a Buffer from the formatted string
  return Buffer.from(formattedString);
}
export const overwriteMerge = (
  destinationArray: any,
  sourceArray: any,
  options: any,
) => sourceArray;

export function formatToUint8Array(args: unknown[]): Uint8Array {
  // Convert arguments to a string, separating by spaces, and add a newline
  const formattedString =
    args
      .map((arg) =>
        typeof arg === "object" && arg !== null
          ? JSON.stringify(arg)
          : String(arg),
      )
      .join(" ") + "\n";

  // Convert the formatted string into a Uint8Array
  return new TextEncoder().encode(formattedString);
}

function isHex(color: PolymorphicColor): color is HexColor {
  return typeof color === "string" && color.startsWith("#");
}

function isRgb(color: PolymorphicColor): color is RGBColor {
  if (!Array.isArray(color)) return false;
  return color.length === 3;
}

function isChalkColorString(
  color: PolymorphicColor,
): color is ForegroundColorName | BackgroundColorName {
  if (typeof color !== "string") return false;
  if (isHex(color) || isRgb(color)) return false;

  return true;
}

function isColorFn(color: PolymorphicColor): color is ColorFn {
  return typeof color === "function";
}

export function resolvePolymorphicColor(color: PolymorphicColor): ColorFn {
  if (isColorFn(color)) return color;

  if (isChalkColorString(color)) return chalk[color];
  if (isRgb(color)) return chalk.rgb(...color);

  return chalk.hex(color);
}

export const normalizePolymorphicColor = resolvePolymorphicColor;

function ensureMsLength(ms: number): string {
  return `${ms}`.padStart(3, "0");
}

type TimestampComponents =
  ThothConfigStrict["prefix"]["timestamp"]["components"];

export function getTimestamp(
  tsComponents: TimestampComponents,
  timestampMs?: number,
): string {
  let finalComponents: string[] = [];

  let components = [tsComponents].flat();

  const now = timestampMs ? new Date(timestampMs) : new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString(undefined, {
    hour12: false,
  });

  if (components.includes("date")) {
    finalComponents.push(date);
  }

  if (components.includes("time")) {
    let timeString = time;
    if (components.includes("milliseconds")) {
      timeString += `.${ensureMsLength(now.getMilliseconds())}`;
    }
    finalComponents.push(timeString);
  }

  const joinedComponents = finalComponents.join(" ");

  return `[${joinedComponents}]`;
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

export const dmo = {
  arrayMerge: overwriteMerge,
};
