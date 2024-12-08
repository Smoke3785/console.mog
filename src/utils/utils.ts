// Types
import { PolymorphicColor, ColorFn, RGBColor, HexColor, PadType } from "@types";

// Utils
import chalk, { ForegroundColorName, BackgroundColorName } from "chalk";

export function formatToBuffer(args: unknown[]): Buffer {
  // Convert arguments to a string, separating by spaces, and add a newline
  const formattedString =
    args
      .map((arg) =>
        typeof arg === "object" && arg !== null
          ? JSON.stringify(arg)
          : String(arg)
      )
      .join(" ") + "\n";

  // Create a Buffer from the formatted string
  return Buffer.from(formattedString);
}
export const overwriteMerge = (
  destinationArray: any,
  sourceArray: any,
  options: any
) => sourceArray;

export function formatToUint8Array(args: unknown[]): Uint8Array {
  // Convert arguments to a string, separating by spaces, and add a newline
  const formattedString =
    args
      .map((arg) =>
        typeof arg === "object" && arg !== null
          ? JSON.stringify(arg)
          : String(arg)
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
  color: PolymorphicColor
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

export const dmo = {
  arrayMerge: overwriteMerge,
};
