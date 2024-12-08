import { ThothConfigStrict } from "@classes/configuration/Configuration/types.ts";
import { PadType } from "@types";

function ensureMsLength(ms: number): string {
  return `${ms}`.padStart(3, "0");
}

type TimestampComponents =
  ThothConfigStrict["prefix"]["timestamp"]["components"];

export function getTimestamp(
  tsComponents: TimestampComponents,
  timestampMs?: number
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
