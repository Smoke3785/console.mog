import {
  timeStamp,
  mfgStamp,
  logLevel,
  httpMethod,
} from "console.mog/prefixes";
import { anotherFunction } from "./other.ts";

import mog, { createPrefix } from "console.mog";
const thumbsUp = createPrefix({
  color: "green",
  value: "[👍]",
});

mog(console, {
  overrideConsole: true,
  prefixes: [mfgStamp, thumbsUp, timeStamp, logLevel, httpMethod],
});

anotherFunction();

console.log("log before fail");
// throw new Error("test error");

async function sleep(ms: number): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const randomNum = Math.floor(Math.random() * 1000);
      reject("Explicit reject!\n test2");
      return;
      if (randomNum < 300) {
        // throw new Error("Random error!");
        resolve(`Random resolve! ${randomNum}`);
      } else if (randomNum > 600) {
        resolve("Random resolve!");
      } else {
        reject("Random reject!");
      }
    }, ms);
  });
}

const test = console._$log("Hello, world!");

test._$log("Hello, world!")._$log("Hello, world!")._log("Hello, world!");

test._log("log after fail");

const min = 0;
const promiseA = sleep(1000 + min);
const promiseB = sleep(2000 + min);
const promiseC = sleep(3000 + min);
const promiseD = sleep(4000 + min);

const rootLevel = console.log("Evaluating promises...");
rootLevel.promise(promiseA, "Promise A").report("Result: ");
rootLevel
  .promise(promiseB, "Promise B")
  .catch((log, error) => {
    log.succeed(`Explicitely handled: ${error}`);
  })
  .then((log, value) => {
    log.succeed(`Explicitely handled: ${value}`);
  });
rootLevel.promise(promiseC, "Promise C").catch((log, error) => {
  log.fail(error);
});
rootLevel.promise(promiseD, "Promise D").report((value: string) => {
  return `Result: ${value}`;
});

// console
//   .promise(sleep(1000), "Sleeping...")
//   .then((log, value) => {
//     log.succeed("Done!");
//   })
//   .catch((log, error) => {
//     log.fail("Error!");
//   });

console.hr(undefined, "0");

console
  .withContext({
    httpMethod: "GET",
  })
  .log("Hello, world!")
  .log("Testing!");

// console.group("Group A");
// console.log("Hello, world!");
// console.info("Hello, world!");
// console.warn("Hello, world!");
// console.error("Hello, world!");
// console.group("Group B");
// console.$log("Hello, world!");
// console.$info("Hello, world!");
// console.$warn("Hello, world!");
// console.$error("Hello, world!");
// console.groupEnd();
// console.log("Hello, world!");
// console.info("Hello, world!");
// console.warn("Hello, world!");
// console.error("Hello, world!");
// console.groupEnd();
// console.log("Hello, world!");
// console.info("Hello, world!");
// console.warn("Hello, world!");
// console.error("Hello, world!");
// // console.debug("Hello, world!")._log("Hello, world!");

// const testData = [
//   // test data
//   {
//     name: "John",
//     age: 30,
//     city: "New York",
//     country: "USA",
//   },
//   {
//     name: "Jane",
//     age: 25,
//     city: "Toronto",
//     country: "Canada",
//   },
//   {
//     name: "Doe",
//     age: 35,
//     city: "Sydney",
//     country: "Australia",
//   },
//   {
//     name: "Smith",
//     age: 40,
//     city: "London",
//     country: "UK",
//   },
//   {
//     name: "Doe",
//     age: 35,
//     city: "Sydney",
//     country: "Australia",
//   },
//   {
//     name: "Smith",
//     age: 40,
//     city: "London",
//     country: "UK",
//   },
//   {
//     name: "Doe",
//     age: 35,
//     city: "Sydney",
//     country: "Australia",
//   },
//   {
//     name: "Smith",
//     age: 40,
//     city: "London",
//     country: "UK",
//   },
//   {
//     name: "Doe",
//     age: 35,
//     city: "Sydney",
//     country: "Australia",
//   },
//   {
//     name: "Smith",
//     age: 40,
//     city: "London",
//     country: "UK",
//   },
//   {
//     name: "Doe",
//     age: 35,
//     city: "Sydney",
//     country: "Australia",
//   },
//   {
//     name: "Smith",
//     age: 40,
//     city: "London",
//     country: "UK",
//   },
//   {
//     name: "Doe",
//     age: 35,
//     city: "Sydney",
//     country: "Australia",
//   },
//   {
//     name: "Smith",
//     age: 40,
//     city: "London",
//     country: "UK",
//   },
//   {
//     name: "Doe",
//     age: 35,
//     city: "Sydney",
//     country: "Australia",
//   },
//   {
//     name: "Smith",
//     age: 40,
//     city: "London",
//     country: "UK",
//   },
//   {
//     name: "Doe",
//     age: 35,
//     city: "Sydney",
//     country: "Australia",
//   },
// ];

// // console.log("testing");

// // console.table(testData);

// // const formatted = utils.formatTable(testData);

// // process.stdout.write(table.toString());
