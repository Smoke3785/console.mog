const env = process.env.NODE_ENV;

import { defineConfig, Options } from "tsup";
import glob from "tiny-glob";
import fs from "fs";

export default defineConfig(async () => {
  const entry = await glob("src/**/!(*.d|*.spec).{ts,tsx}");
  console.log({ entry });

  const config: Options = {
    splitting: false,
    sourcemap: env === "prod", // source map is only available in prod
    clean: true, // rimraf disr
    dts: true, // generate dts file for main module
    format: env === "production" ? "cjs" : "esm",
    minify: false,
    bundle: true, // This must be true, or path aliases break
    outExtension({ format }) {
      if (env === "production") return {}; // If generating cjs, don't change the extension
      return {
        dts: `.d.mts`,
        js: `.mjs`,
      };
    },
    // bundle: false,
    skipNodeModulesBundle: true,
    entryPoints: ["src/index.ts", "src/server.ts", "src/client.ts"],
    watch: env === "development",
    target: "es2020",
    outDir: env === "production" ? "cjs" : "esm",
    // entry: entry,
    entry: ["src/**/*.ts"],

    tsconfig: "tsconfig.json",
    external: ["react-devtools-core", "yoga-wasm-web"],
    esbuildOptions: (options) => {
      options.external = ["react-devtools-core", "yoga-wasm-web"];
      // options.outbase = "./src";
    },
    onSuccess: async () => {
      if (env !== "production") return;

      // Recurse over all files in the cjs directory and replace relative .js imports with .mjs
      const files = await glob("cjs/**/*.js");

      let filesCount = 0;
      for (const file of files) {
        filesCount++;
        console.log(
          `Replacing imports in ${filesCount} of ${files.length} files`
        );
        console.log({ file });
        const content = fs.readFileSync(file, "utf-8");
        const newContent = content.replace(/\.js/g, ".mjs");

        fs.writeFileSync(file, newContent);
      }

      console.log(`Replaced ${filesCount} .js imports with .mjs`);
    },
  };

  return [config];
});
