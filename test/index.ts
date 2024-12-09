import { timeStamp, mfgStamp, logLevel } from "console.mog/prefixes";
import mog, { createPrefix } from "console.mog";
const thumbsUp = createPrefix({
  color: "green",
  value: "[👍]",
});

mog(console, {
  prefixes: [mfgStamp, thumbsUp, timeStamp, logLevel],
});

console.group("Group A");
console.log("Hello, world!");
console.info("Hello, world!");
console.warn("Hello, world!");
console.error("Hello, world!");
console.group("Group B");
console.$log("Hello, world!");
console.$info("Hello, world!");
console.$warn("Hello, world!");
console.$error("Hello, world!");
console.groupEnd();
console.log("Hello, world!");
console.info("Hello, world!");
console.warn("Hello, world!");
console.error("Hello, world!");
console.groupEnd();
console.log("Hello, world!");
console.info("Hello, world!");
console.warn("Hello, world!");
console.error("Hello, world!");
// console.debug("Hello, world!")._log("Hello, world!");

const testData = [
  // test data
  {
    name: "John",
    age: 30,
    city: "New York",
    country: "USA",
  },
  {
    name: "Jane",
    age: 25,
    city: "Toronto",
    country: "Canada",
  },
  {
    name: "Doe",
    age: 35,
    city: "Sydney",
    country: "Australia",
  },
  {
    name: "Smith",
    age: 40,
    city: "London",
    country: "UK",
  },
  {
    name: "Doe",
    age: 35,
    city: "Sydney",
    country: "Australia",
  },
  {
    name: "Smith",
    age: 40,
    city: "London",
    country: "UK",
  },
  {
    name: "Doe",
    age: 35,
    city: "Sydney",
    country: "Australia",
  },
  {
    name: "Smith",
    age: 40,
    city: "London",
    country: "UK",
  },
  {
    name: "Doe",
    age: 35,
    city: "Sydney",
    country: "Australia",
  },
  {
    name: "Smith",
    age: 40,
    city: "London",
    country: "UK",
  },
  {
    name: "Doe",
    age: 35,
    city: "Sydney",
    country: "Australia",
  },
  {
    name: "Smith",
    age: 40,
    city: "London",
    country: "UK",
  },
  {
    name: "Doe",
    age: 35,
    city: "Sydney",
    country: "Australia",
  },
  {
    name: "Smith",
    age: 40,
    city: "London",
    country: "UK",
  },
  {
    name: "Doe",
    age: 35,
    city: "Sydney",
    country: "Australia",
  },
  {
    name: "Smith",
    age: 40,
    city: "London",
    country: "UK",
  },
  {
    name: "Doe",
    age: 35,
    city: "Sydney",
    country: "Australia",
  },
];

// console.log("testing");

// console.table(testData);

// const formatted = utils.formatTable(testData);

// process.stdout.write(table.toString());
