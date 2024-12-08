import { BackgroundColorName, ForegroundColorName } from "chalk";

export type RGBColor = [number, number, number];
export type HexColor = string;

export type ColorFn = (...text: unknown[]) => string;

export type PolymorphicColor<
  Type extends "foreground" | "background" = "foreground",
> =
  | (Type extends "foreground" ? ForegroundColorName : BackgroundColorName)
  | RGBColor
  | HexColor
  | ColorFn;
