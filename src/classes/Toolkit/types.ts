import { ChalkInstance } from "chalk";
import { ColorFn } from "@types";

export type CustomColors = Record<string, ColorFn>;
export type ToolkitChalk<T extends CustomColors> = ChalkInstance & T;
