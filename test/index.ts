import { timeStamp, mfgStamp, logLevel } from "console.mog/prefixes";
import mog, { createPrefix } from "console.mog";

const thumbsUp = createPrefix({
  color: "green",
  value: "[👍]",
});

mog(console, {
  prefixes: [mfgStamp, thumbsUp, timeStamp, logLevel],
});

// const topLevel = console.log("This is the top level 👍");

// topLevel._$info("This is the second level 🤫 (1)");
// topLevel._error("This is the second level 🧏 (2)");
// topLevel._warn("This is the second level 🤫 (3)");
// topLevel._debug("This is the second level 🧏 (4)");
// console.newline();

// // topLevel.trace();

// console.log([1, 2, 3, 4]);
// console.log({ a: 1, b: 2, c: 3, d: 4 });

// let i = 0;
// setInterval(() => {
//   topLevel.update("This is the top level 👍", i++);
// }, 1000);
const start = performance.now();
const target = 1_000_000;

for (let i = 0; i < target + 1; i = i + 6) {
  console
    .log("This is a log message", i)
    ._debug("This is a debug message")
    ._error("This is an error message")
    ._info("This is an info message")
    ._warn("This is a warn message")
    .newline();
}

function f(n: number) {
  return Number(n.toFixed(2)).toLocaleString("en-US");
}

const perLogs = 1000;

const l1 = `Time taken: ${f(
  performance.now() - start
)}m for ${target.toLocaleString("en-US")} logs.`;

const l2 = `Average time of ${f(
  ((performance.now() - start) / target) * perLogs
)}ms per ${perLogs} logs`;

console.newline().hr().info(l1).info(l2).hr().newline();
