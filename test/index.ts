import {
  timeStamp,
  mfgStamp,
  logLevel,
  httpMethod,
} from "console.mog/prefixes";
import { anotherFunction } from "./other.ts";

import mog, { createPrefix, MogContext } from "console.mog";
import { $ } from "zx";
import chalk from "chalk";

const thumbsUp = createPrefix({
  color: "green",
  value: "[👍]",
});

// mog(console, {
//   overrideConsole: true,
//   prefixes: [timeStamp, logLevel, httpMethod],
// });
// async function blab() {

//   console.hr(chalk.bold.hex("#00ace0")("We just mogged our console!"), "=");
//   console
//     .newline()
//     .log(
//       console.toolkit.chalk.bold(
//         "We can apply all sorts of prefixes to our logs!"
//       )
//     )
//     ._log("This is normal log.")
//     .warn("This is a warning!")
//     .error("This is an error!")
//     .info("Here is some info!")
//     .debug("Here is some debug info!");

//   const treeExample = console
//     .newline()
//     .log(console.toolkit.chalk.bold("Need to render a tree?"));
//   const firstLevel = treeExample._log("My Project");
//   const secondLevel = firstLevel
//     ._log("tsconfig.json")
//     .log(console.toolkit.chalk.blue("README.md"));
//   secondLevel
//     .log(console.toolkit.chalk.gray(".env"))
//     .log("src")
//     ._log("MyClass")
//     ._log(console.toolkit.chalk.yellow("index.ts"))
//     .log(console.toolkit.chalk.yellow("utils.ts"));

//   // treeExample._log("My Other Project").newline();

//   const atlasStyle = MogContext.toolkit.chalk.rgb(73, 69, 255);

//   // console.log(atlasStyle("Hello, World!"));

//   const promisesExample = console
//     .newline()
//     .log(
//       console.toolkit.chalk.bold(
//         `Represent ${chalk.magentaBright("promises")} in real-time...`
//       )
//     );

//   async function sleep(ms: number): Promise<string> {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         const randomNum = Math.floor(Math.random() * 1000);

//         if (randomNum < 500) {
//           // throw new Error("Random error!");
//           resolve(`Random resolve!`);
//         } else {
//           reject("Random reject!");
//         }
//       }, ms);
//     });
//   }

//   const min = 0;
//   const promiseA = sleep(1000 + min);
//   const promiseB = sleep(2000 + min);
//   const promiseC = sleep(3000 + min);
//   const promiseD = sleep(4000 + min);

//   let passed = 0;
//   const rootLevel = console.$log(`Evaluating ${chalk.yellow("4")} promises...`);
//   rootLevel
//     .promise(promiseA, "Promise A")
//     .then((log, value) => {
//       passed++;
//       rootLevel.update(
//         `Evaluating ${chalk.yellow("4")} promises... (${passed}/4)  passed`
//       );
//       log.succeed(`Explicitely handled: ${value}`);
//     })
//     .catch((log, error) => {
//       log.fail(`Explicitely handled: ${error}`);
//     });

//   rootLevel
//     .promise(promiseB, "Promise B")
//     .catch((log, error) => {
//       log.fail(`Explicitely handled: ${error}`);
//     })
//     .then((log, value) => {
//       passed++;
//       rootLevel.update(
//         `Evaluating ${chalk.yellow("4")} promises... (${passed}/4) passed`
//       );
//       log.succeed(`Explicitely handled: ${value}`);
//     });

//   rootLevel
//     .promise(promiseC, "Promise C")
//     .catch((log, error) => {
//       log.fail(error);
//     })
//     .then((log, value) => {
//       passed++;
//       rootLevel.update(
//         `Evaluating ${chalk.yellow("4")} promises... (${passed}/4) passed!`
//       );
//       log.succeed(`Explicitely handled: ${value}`);
//     });

//   rootLevel
//     .promise(promiseD, "Promise D")
//     .catch((log, error) => {
//       log.fail(`Explicitely handled: ${error}`);
//     })
//     .then((log, value) => {
//       passed++;
//       rootLevel.update(
//         `Evaluating ${chalk.yellow("4")} promises... (${passed}/4)  passed`
//       );
//       log.succeed(`Explicitely handled: ${value}`);
//     });

//   // @ts-ignore
//   console.newline().log(chalk.bold("And so much more!"));
//   console
//     .log(chalk.gray("Read the docs to see all the features!")) // @ts-ignore
//     .log(`This is a product of ${chalk.hex("#00ace0")("www.iliad.dev")}!`);
//   await Promise.allSettled([promiseA, promiseB, promiseC, promiseD])
//     .then(() => {
//       rootLevel.succeed("All promises resolved!");
//     })
//     .catch(() => {
//       // rootLevel.fail("One or more promises rejected!");
//     })
//     .finally(() => {
//       rootLevel.succeed("All promises resolved!");
//     });

//   await sleep(3000).catch(() => {});
//   console.clear();
//   await blab();
// }

// blab();

// const pipe = console.createPipe((data) => {
//   const lines = data.trim().split("\n");
//   return lines.map((line: string) => ({ method: "error", data: line }));
// });

const loggerA = new MogContext({
  prefixes: [createPrefix({ value: "[A]", color: "green" })],
});
$`ping google.com`.pipe(loggerA.pipe);
const loggerB = new MogContext({
  prefixes: [createPrefix({ value: "[B]", color: "yellow" })],
});

setInterval(() => {
  loggerA.log("Hello, World! 1");
}, 2000);

setTimeout(() => {
  setInterval(() => {
    loggerB.log("Hello, World! 2");
  }, 2000);
}, 1000);
