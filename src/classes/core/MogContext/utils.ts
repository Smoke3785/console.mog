// import type { StrictModuleParam, ModuleParam } from "./types.ts";

// export function hexToRgb(hex: string): [number, number, number] {
//   const hexValue = hex.replace("#", "");
//   const r = parseInt(hexValue.substring(0, 2), 16);
//   const g = parseInt(hexValue.substring(2, 4), 16);
//   const b = parseInt(hexValue.substring(4, 6), 16);
//   return [r, g, b];
// }

// export function normalizeModuleConfig(
//   module: ModuleParam
// ): Partial<StrictModuleParam> {
//   if (typeof module !== "string") return module;

//   return {
//     enabled: true,
//     name: module,
//   };
// }
