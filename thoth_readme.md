# Thoth

Logging library. Makes logs pretty, standard, project-agnostic. Provides utilities for logging locally, externall, via webhooks, etc.

ty JJ 🥰

## Time to lock in

New idea is to make the library called console.mog. Wojack puns ensue.
- Virgin console.log (lame, old, gross) vs chad console.mog (modern, owesome, gorgeous)
- Tired of boring old console.logs? Time to looksmaxx your console.


## V2 Notes

This current approach is not maintainable, so a rewrite will be necessary. Basic features:
`Logger` class. Just means that it has the ability to make new `Log`s with the `console.log` API + has power loggers.
`Basic Log` class. Holds the recursion logic, but isn't stored in virtual dom, probably?
`Log` extends `BasicLog` class. Can be a power logger. Has an optional `parent` field and `children` field. Every log has a uid, stores itself in virtual dom as side effect.
    - get siblings() returns parent.children.
    - isSibling(): boolean returns parent.children.length.
`LogRenderer` React component. Recursive component that renders out `Log`.
`Virtual DOM` Basically just a big object stored in `@preact/signal` state probably. Unsure how rendering will work in the non-ink environment. I'll probably just do away with PowerLog features and just create siblings / children.

## Features

- Utility function that can be called to override console.log + provide typing
- Exports default instance of Thoth as default, but can be Instantiated as well.
- `hanging()` logs (api? `thoth.hanging(options).log()`?). Uses ORA to make spinner, can be resolved, timed out, failed, warned, etc.
- Project-level prefix, (config.thoth.ts?), Iliad prefix **◭**, timestamp w. formats.
- Thoth extends event emitter, allowing for side-effects (?)
- Add ability to provide text snippets / internationalisation. Autocomplete possible.
- Possible add ability to provide markup/down tags? <code> <strong> <italic> etc could be useful.

## API

```tsx
import thoth from '@iliad.dev/thoth`;


thoth.log(...args);

// IDEA: Normal api .log, .warn, .error, etc.
// Power API: $log, $warn, $error

// Hanging log API?
const i_log = thoth.$log("Waiting for thing").stamp(); // Outputs loading spinner, creates timestamp.

// const {data, error} = await thing();
if(error !== undefined) i_log.fail("Thing failed!") // Fail emoji...

if(true) {
    i_log.$succeed((details: DetailsAboutEvent)=> {
        return `Event concluded in ${details.totalTime}`
    })
} else {
    i_log.resolve("Event concluded, but we don't know how long it took :/")
}


```

## Questions

- What the heck are logging levels?
- How am I going to handle subprocesses? Can I take the algorithm from `atlas-strapi-instance`?
