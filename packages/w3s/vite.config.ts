import path from "node:path";

import { configureReact as configure } from "@beardeddudes/vite-config"
import { partytownRollup } from "@qwik.dev/partytown/utils";

/**
 * Retrieves the value of an environment variable.
 *
 * @function
 * @template T The type of the default value (if provided).
 * @param {keyof typeof process.env} key The name of the environment variable to retrieve.
 * @param {T} [defaultValue] An optional default value to return if the environment variable is
 * undefined or not set.
 *
 * @example
 * ```tsx
 * // Assuming process.env.NODE_ENV = "production"
 * const envValue = env("NODE_ENV"); // Returns "production"
 *```
 *
 * @example
 * ```tsx
 * // Assuming process.env.MISSING_ENV_VAR is undefined
 * const defaultEnvValue = env("MISSING_ENV_VAR", "defaultValue"); // Returns "defaultValue"
 * ```
 *
 * @example
 * ```tsx
 * // Assuming process.env.MISSING_ENV_VAR is undefined and no default value is provided
 * const nullEnvValue = env("MISSING_ENV_VAR"); // Returns null
 * ```
 *
 * @returns {string | T | null} The value of the environment variable, the default value if provided
 * and the variable is not set, or `null` if neither is available.
 */
const env: <T>(key: keyof typeof process.env, defaultValue?: T) => string | T | null = (key, defaultValue) =>
  process.env?.[key] ?? defaultValue ?? null

const nodeEnv = JSON.stringify(env<string>("NODE_ENV", "development"))

export default configure(
  {
    appType: "spa",
    base: "/",
    build: {
      outDir: "dist",
      manifest: false,
      modulePreload: {
        polyfill: true,
      },
      rollupOptions: {
        output: {
          assetFileNames: assetInfo => {
            if (assetInfo.name) {
              const extension = assetInfo.name.split(".").pop() || ""
              if (["svg"].includes(extension)) {
                return `assets/images/${extension}/[name][extname]`
              }
            }
            return "assets/[name]-[hash][extname]"
          },
        },
        plugins: [
          partytownRollup({
            dest: path.join(__dirname, "public", "~partytown"),
          })
        ]
      },
      sourcemap: nodeEnv === "development",
      target: "esnext",
    },
    json: { stringify: true },
    server: { hmr: { overlay: nodeEnv === "development" } },
    worker: { format: "es" },
  },
  {
    analytics: { enableDev: nodeEnv === "development" },
    buildInfo: { enabled: nodeEnv === "development" },
    lint: { enabled: true, enableBuild: true, stylelint: false },
    openGraph: { enabled: false },
    react: { swc: { enabled: true }, svg: { enabled: true } },
  }
)
