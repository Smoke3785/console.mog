




# 💅🏻 console.mog 🤫🧏

Looksmax your console. This is a powerful tool for building attractive logs that closely represent your data. It has a simple, declarative API and minimal dependencies.

[![Iliad Badge][iliad-img]][iliad-url]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

> [!IMPORTANT]  
This is in alpha (💪🐺), if that. This library is not ready for general use and won't be for a few weeks.


## Features / Todo 
Stuff I gotta do before shilling on reddit. 🤨😗

### Critical for alpha 🐺
- Graceful failure. Currently crash reports are printed overtop of the console... can we wrap them to handle graceful failures?
- Make sure `console.mog` has parity with console.log - may need to just proxy stuff like chart to underlying functionality.
  - ~~`console.group` seems like an uglier version of `console._log()`.~~
    - ~~Can I just hold something like "lastGroupParent" and then subsequent logs that aren't `console.groupEnd()` are filed under that~~
    - ~~I'd need to hold an array of logs so I could work my way back up the tree. Annoying...~~
  - `console.profile()` can just be an abstraction on the old `ThothTimestamp`.
    - Is it acceptable to use `performance.now()` under the hood?
  - ~~Chart~~ 
  - ~~`console.groupCollapsed()` doesn't do anything interesting in the terminal.~~
  - dir, dirxml - https://developer.mozilla.org/en-US/docs/Web/API/console/dir_static
  - `console.count` and `console.assert` should be trivial 
    - I was wrong: https://developer.mozilla.org/en-US/docs/Web/API/console#using_string_substitutions
  - 
- Integrate my timestamp syntax to mirror native `console` implementation.
- Make native fallbacks for when this is run in the browser.
- Make readme
- Stress test

### Critical for literally anything useful
- Performance improvements. Obviously nowhere near as fast as native implementation, but there's *tremendous* room for performance improvements.
  - Currently dumb render starts from the top and goes down. That's silliness.
  - VSCode only renders 1,100-ish logs anyhow. Rendering only needs to be fancy for the last few thousand logs.
    - When the program exits / crashes, a static version of logs should be spat into the console. Nothing fancy.
  - Further testing has revealed that... this is going to need some work.
- Determine interoperability with other logging libraries. 
- Determine interoperability with CLI tools that handle other stuff

### Future features
- `console.promise(promise)` syntax, `console.promiseAll(promises)` syntax.
- Render boxes, links, rainbow text.
  - `terminal.link()` - https://www.npmjs.com/package/terminal-link
- Create Toolbox interface that contains chalk, link, etc. and can be passed to every log.
- Create Context interface that contains LogData, selected DOM information, etc.
- Alignment api. Left, center, right align. Unsure how I'm going to do this. `console.center(console.log())` possible?
- `SideEffect` class + `sideEffects` config option, that will do other stuff with your logs when they occur. Builtins:
  - `FileSystem` will dump your logs in a file, nuff said.
  - `Discord` will turn your logs into a discord webhook.
  - `SimpleRemote` simple api for duplicating your logs as HTTP requests
  - `SimpleWebhook` is this redundant with above?
- `console.tree()` for directly rendering nested structures. May need a callback fn to run on every node to get `children` and `label`.
- Syntax highlighting in returned info - https://www.npmjs.com/package/cli-highlight
  - Can be explicit `console.highlight("json", fs.readFileSync('./package.json'))`
  - Or implicit `console.log({keyOne: "string", keyTwo: 5, keyThree: [1,2,3]})`
- `console.directory()`?? - https://github.com/athityakumar/colorls#readme
- `console.styledTable()` more control over neat looking console.


### Code cleanup
- I need to simplify the Log types and how they actually resolve their data. LogData should be generic.


<!-- Variables -->
[npm-image]: https://img.shields.io/npm/v/typescript-multiclass.svg
[npm-url]: https://npmjs.org/package/typescript-multiclass
[travis-image]: https://img.shields.io/travis/panates/typescript-multiclass/master.svg
[travis-url]: https://travis-ci.org/panates/typescript-multiclass
[coveralls-image]: https://img.shields.io/coveralls/panates/typescript-multiclass/master.svg
[coveralls-url]: https://coveralls.io/r/panates/typescript-multiclass
[downloads-image]: https://img.shields.io/npm/dm/typescript-multiclass.svg
[downloads-url]: https://npmjs.org/package/typescript-multiclass
[gitter-image]: https://badges.gitter.im/panates/typescript-multiclass.svg
[gitter-url]: https://gitter.im/panates/typescript-multiclass?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[dependencies-image]: https://david-dm.org/panates/typescript-multiclass/status.svg
[dependencies-url]:https://david-dm.org/panates/typescript-multiclass
[devdependencies-image]: https://david-dm.org/panates/typescript-multiclass/dev-status.svg
[devdependencies-url]:https://david-dm.org/panates/typescript-multiclass?type=dev
[quality-image]: http://npm.packagequality.com/shield/typescript-multiclass.png
[quality-url]: http://packagequality.com/#?package=typescript-multiclass
[iliad-img]: https://img.shields.io/badge/%E2%97%AD%20%20-Iliad.dev-00ace0?labelColor=04151f&cacheSeconds=https%3A%2F%2Filiad.dev%2F%3Ffrom%3Dgithub-badge
[iliad-url]: https://iliad.dev/?from=github-badge