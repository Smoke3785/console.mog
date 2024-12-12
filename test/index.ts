import {
  timeStamp,
  mfgStamp,
  logLevel,
  httpMethod,
} from "console.mog/prefixes";
import { anotherFunction } from "./other.ts";

import mog, { createPrefix, MogContext } from "console.mog";

const thumbsUp = createPrefix({
  color: "green",
  value: "[👍]",
});

mog(console, {
  overrideConsole: true,
  prefixes: [mfgStamp, thumbsUp, timeStamp, logLevel, httpMethod],
});

const atlasStyle = MogContext.toolkit.chalk.rgb(73, 69, 255);

console.log(atlasStyle("Hello, World!"));
