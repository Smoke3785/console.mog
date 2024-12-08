import * as path from "path";
import * as fs from "fs";
import util from "util";

// Clear dev stream
fs.writeFileSync(
  path.resolve(process.cwd(), `./debug/log-dev.log`),
  "debug log - cleared on start\n\n",
);

const stream = fs.createWriteStream(
  path.resolve(process.cwd(), `./debug/log-${Date.now()}.log`),
  {
    flags: "a",
  },
);

const devStreamP = fs.createWriteStream(
  path.resolve(process.cwd(), `./debug/${process.pid}-log-dev.log`),
  {
    flags: "a",
  },
);
const devStream = fs.createWriteStream(
  path.resolve(process.cwd(), `./debug/log-dev.log`),
  {
    flags: "a",
  },
);

const debugWriteStream = new console.Console(stream, stream);
const devWriteStream = new console.Console(devStream, devStream);
const devWriteStreamP = new console.Console(devStreamP, devStreamP);

export function log(...args: any[]): void {
  const fmt = util.format(...args, "\n");

  // debugWriteStream.log(fmt);
  devWriteStreamP.log(fmt);
  devWriteStream.log(fmt);
}

export function dLog(depth: number, ...args: any[]): void {
  depth *= 2;
  const fmt = util.format(...args, "\n");
  const formatted = fmt
    .split("\n")
    .map((line) => " ".repeat(depth) + line)
    .join("\n");

  // debugWriteStream.log(formatted);
  devWriteStreamP.log(formatted);
  devWriteStream.log(formatted);
}
