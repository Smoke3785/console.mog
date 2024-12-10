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

export function stripAnsi(str: string) {
  return str.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "");
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
