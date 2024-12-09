# 💅🏻 console.mog 🤫🧏


## Critical for alpha
- Graceful failure. Currently crash reports are printed overtop of the console... can we wrap them to handle graceful failures?
- Make sure `console.mog` has parity with console.log - may need to just proxy stuff like chart to underlying functionality.
- Integrate my timestamp syntax to mirror native `console` implementation.
- Make native fallbacks for when this is run in the browser.
- Make readme
- Stress test

## Critical for literally anything useful
- Performance improvements. Obviously nowhere near as fast as native implementation, but there's *tremendous* room for performance improvements.
  - Currently dumb render starts from the top and goes down. That's silliness.
  - VSCode only renders 1,100-ish logs anyhow. Rendering only needs to be fancy for the last few thousand logs.
    - When the program exits / crashes, a static version of logs should be spat into the console. Nothing fancy.
  - Further testing has revealed that... this is going to need some work.

## Future features
- `console.promise(promise)` syntax, `console.promiseAll(promises)` syntax.
- Render boxes, links, rainbow text.
- Create Toolbox interface that contains chalk, link, etc. and can be passed to every log.
- Create Context interface that contains LogData, selected DOM information, etc.
- Alignment api. Left, center, right align. Unsure how I'm going to do this. `console.center(console.log())` possible?
- `SideEffect` class + `sideEffects` config option, that will do other stuff with your logs when they occur. Builtins:
  - `FileSystem` will dump your logs in a file, nuff said.
  - `Discord` will turn your logs into a discord webhook.
  - `SimpleRemote` simple api for duplicating your logs as HTTP requests
  - `SimpleWebhook` is this redundant with above?
- `console.tree()` for directly rendering nested structures. May need a callback fn to run on every node to get `children` and `label`.