export * from "./console.mog.ts";
export * from "./formatting.ts";
export * from "./debugging.ts";
export * from "./prefixes.ts";
export * from "./utils.ts";

export function _<T extends object[]>(...u: T): T[number] {
  let _u = {} as T[number]; // Ensure _u is typed as the combined type of all input objects

  for (let i = 0; i < u.length; i++) {
    _u = { ..._u, ...u[i] };
  }

  return _u;
}
