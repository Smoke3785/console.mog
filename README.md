<div align="center">

<a href="https://iliad.dev/?from=console-mog" target="_blank" title="Check out Iliad.dev"><img width="440" alt="console.mog - looksmax your console" src="https://github.com/Smoke3785/console.mog/blob/master/readme-assets/banner.png?raw=true"></a>

<a name="readme-top"></a>

## A powerful tool for building attractive logs that closely represent your data. 
<br/>




[![Iliad Badge][iliad-img]][iliad-url]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

Welcome to **console.mog**, a transformative tool designed to take our beloved `console` from mundane to magnificent. This library gives you the ability to create gorgeous terminal readouts without adopting the technical overhead that comes with a dedicated CLI-builder.

<div align="center">

[See Features](#features)  |  [Get Started](#get-started)  |  [Should I Use?](#should-i-use)
</br>
</br>
</div>
</div>

### As simple as this...

```tsx
import mog from 'console.mog'; // Also supports CJS

mog(console); // And you're done!
```
### and now you have this...

<div align="center">

```tsx
// PRETTY GIF // PRETTY GIF // PRETTY GIF // PRETTY GIF 
// PRETTY GIF // PRETTY GIF // PRETTY GIF // PRETTY GIF 
// PRETTY GIF // PRETTY GIF // PRETTY GIF // PRETTY GIF 
// PRETTY GIF // PRETTY GIF // PRETTY GIF // PRETTY GIF 
// PRETTY GIF // PRETTY GIF // PRETTY GIF // PRETTY GIF 
// PRETTY GIF // PRETTY GIF // PRETTY GIF // PRETTY GIF 
// PRETTY GIF // PRETTY GIF // PRETTY GIF // PRETTY GIF 
// PRETTY GIF // PRETTY GIF // PRETTY GIF // PRETTY GIF 
// PRETTY GIF // PRETTY GIF // PRETTY GIF // PRETTY GIF 
// PRETTY GIF // PRETTY GIF // PRETTY GIF // PRETTY GIF 
```
</div>

> [!WARNING]  
This project is in alpha (💪🐺). It is not ready for production use and will not be for several more weeks/months. 

<br/>



## Features 💅🏻


#### 🚀 Transformative Logging Experience

- Looksmax your logs: Beautify your terminal output without breaking a sweat.
- Every native logging feature remains, but each has been [super](https://www.youtube.com/watch?v=dy2zB8bLSpk)charged with added functionality and a brand new look.
-	Minimal setup: A single function call is all it takes to supercharge your console, but the powerful API enables deep customization!
- Add colors, links, and rainbow text to your logs with ease.


#### 📊 Simple Declarative API

-	Works seamlessly with console.log, console.group, and other familiar methods.
-	Infinite method chaining to build complex reports quickly.
- Fully typed, for your convenience.
- Polyfills / fallbacks available for any environment[*](#faq) you find wanting for style.

#### 🌟 Represent any data or process
- Implicit and explicit syntax highlighting for structured data.
- Promise visualization: See how promises resolve or reject in real time, animations and all.
- Advanced tree and table rendering for nested or tabular data structures.


#### 🎯 Style + Substance
- Built-in integrations to send your logs whereever they need to go, and a powerful API to build your own. Built in:
  - Filesystem
  - Discord Webhooks
  - Generic Remote Server
  - Generic Webhooks

<br/>

> [!IMPORTANT]  
Full documentation available soon.


<br/>


## Pre-Launch Requirements
Stuff I gotta do before shilling on reddit. 🤨😗

This project is in the first phase of development. Here's a list of milestones to hit before releae:



### Critical for alpha 🐺
- Graceful failure. Currently crash reports are printed overtop of the console... can we wrap them to handle graceful failures?
- Make sure `console.mog` has parity with `console.log` - may need to just proxy stuff like chart to underlying functionality.
  - `console.time` and `console.profile` methods need hooks for the Timestamp system.
  - dir, dirxml - https://developer.mozilla.org/en-US/docs/Web/API/console/dir_static
  - `console.assert` https://developer.mozilla.org/en-US/docs/Web/API/console#using_string_substitutions
  - `console.count`
- Make native fallbacks for when this is run in the browser.
- Make readme

### Critical for literally anything useful
- Performance improvements. Obviously nowhere near as fast as native implementation, but there's *tremendous* room for performance improvements.
  - Currently dumb render starts from the top and goes down. That's silliness.
  - VSCode only renders 1,100-ish logs anyhow. Rendering only needs to be fancy for the last few thousand logs.
    - When the program exits / crashes, a static version of logs should be spat into the console. Nothing fancy.
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
- LogData should be generic - I need to simplify the Log types and how they actually resolve their data. 


<!-- Variables -->
[npm-image]: https://img.shields.io/npm/v/console.mog.svg
[npm-url]: https://npmjs.org/package/console.mog
[travis-image]: https://img.shields.io/travis/panates/console.mog/master.svg
[travis-url]: https://travis-ci.org/panates/console.mog
[coveralls-image]: https://img.shields.io/coveralls/panates/console.mog/master.svg
[coveralls-url]: https://coveralls.io/r/panates/console.mog
[downloads-image]: https://img.shields.io/npm/dm/console.mog.svg
[downloads-url]: https://npmjs.org/package/console.mog
[gitter-image]: https://badges.gitter.im/panates/console.mog.svg
[gitter-url]: https://gitter.im/panates/console.mog?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[dependencies-image]: https://david-dm.org/panates/console.mog/status.svg
[dependencies-url]:https://david-dm.org/panates/console.mog
[devdependencies-image]: https://david-dm.org/panates/console.mog/dev-status.svg
[devdependencies-url]:https://david-dm.org/panates/console.mog?type=dev
[quality-image]: http://npm.packagequality.com/shield/console.mog.png
[quality-url]: http://packagequality.com/#?package=console.mog
[iliad-img]: https://img.shields.io/badge/%E2%97%AD%20%20-Iliad.dev-00ace0?labelColor=04151f&cacheSeconds=https%3A%2F%2Filiad.dev%2F%3Ffrom%3Dgithub-badge
[iliad-url]: https://iliad.dev/?from=console-mog