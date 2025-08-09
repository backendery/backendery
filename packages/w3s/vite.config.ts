import path from "node:path"

import { configureReact as configure } from "@beardeddudes/vite-config"
import { partytownRollup } from "@qwik.dev/partytown/utils"
import { normalizePath } from "vite"

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

const isDevelopment = nodeEnv === "development"
const isProduction  = nodeEnv ===  "production" // prettier-ignore

export default configure(
  {
    appType: "spa",
    base: "/",
    build: {
      outDir: "dist",
      manifest: false,
      minify: "terser",
      modulePreload: { polyfill: true },
      reportCompressedSize: true,
      rollupOptions: {
        input: {
          index: normalizePath(path.resolve(__dirname, "index.html")),
        },
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
          manualChunks: {
            "forms": ["formik", "yup"],
            "monitoring": ["@sentry/react", "react-error-boundary"],
            "net": ["axios", "axios-retry"],
            "react-core": ["react", "react-dom"],
            "router": ["react-router", "react-router-dom"],
            "ui-components": ["overlayscrollbars", "react-fast-marquee", "react-typed", "use-scramble"],
            "utils": ["@qwik.dev/partytown", "react-responsive", "react-use", "sanitize.css"],
          },
          preserveModules: false,
          sourcemap: isDevelopment,
        },
        plugins: [
          partytownRollup({
            dest: normalizePath(path.resolve(__dirname, "public", "~partytown")),
          }),
        ],
      },
      sourcemap: isDevelopment,
      target: "esnext",
      terserOptions: {
        compress: { drop_console: isProduction, drop_debugger: isProduction },
      },
    },
    cacheDir: ".cache",
    esbuild: {
      treeShaking: true,
    },
    json: { stringify: true },
    optimizeDeps: {
      include: [
        // Core React
        "react",
        "react-dom",
        "react/jsx-dev-runtime",
        "react/jsx-runtime",
        // Routing
        "react-router",
        "react-router-dom",
        // HTTP & Error handling
        "axios",
        "axios-retry",
        "react-error-boundary",
        // Forms & Validation
        "formik",
        "yup",
        // UI Components
        "overlayscrollbars",
        "react-fast-marquee",
        "react-typed",
        "use-scramble",
        // Utilities
        "react-responsive",
        "react-use",
        "sanitize.css",
      ],
      exclude: [
        "@qwik.dev/partytown", // Third-party script loader
        "@sentry/react", // Error monitoring, better loaded separately
      ],
    },
    preview: {
      port: 4173,
      open: true,
    },
    publicDir: "public",
    server: {
      cors: true,
      hmr: { overlay: isDevelopment },
      port: 8080,
      strictPort: true,
      watch: { usePolling: true },
    },
    worker: { format: "es" },
  },
  {
    analytics: { enableDev: isDevelopment },
    buildInfo: { enabled: isDevelopment },
    lint: { enabled: true, enableBuild: true, stylelint: false },
    openGraph: { enabled: false },
    react: { swc: { enabled: true }, svg: { enabled: true } },
  }
)
