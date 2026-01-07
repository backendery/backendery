import path from 'node:path';

import type { AppType } from 'vite';

import react from '@vitejs/plugin-react-swc';
import { defineConfig, normalizePath } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import { loadValidatedEnv } from './evars-schema.config';

export default defineConfig(({ mode }: { mode: string }) => {
  // Load environment variables based on the current mode (e.g., 'development', 'production')
  const evars = loadValidatedEnv(mode);

  // Extract the port from the `VITE_APP_ORIGIN` environment variable
  const appOriginUrl = new URL(evars.VITE_APP_ORIGIN);
  const port = (appOriginUrl.port && parseInt(appOriginUrl.port, 10)) || 8080;

  // The `isDevelopment` variable checks if the current mode is 'development' or if
  // the `VITE_APP_MODE` environment variable is set to 'development'
  const isDevelopment = Boolean(mode === 'development' || evars.VITE_APP_MODE === 'development');

  return {
    appType: 'spa' as AppType,
    base: '/',
    build: {
      chunkSizeWarningLimit: 1024, // KB, if the chunk is larger
      cssMinify: 'lightningcss' as const,
      manifest: false,
      minify: 'terser' as const,
      modulePreload: {
        polyfill: true,
      },
      outDir: 'dist',
      reportCompressedSize: true,
      rollupOptions: {
        input: {
          main: normalizePath(path.resolve(__dirname, 'index.html')),
        },
        output: {
          assetFileNames: 'assets/[name].[hash].[ext]',
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
          format: 'es' as const,
          preserveModules: false,
        },
        treeshake: true,
      },
      sourcemap: isDevelopment,
      target: 'es2020',
      terserOptions: !isDevelopment
        ? {
            compress: { drop_console: true, drop_debugger: true },
            format: { comments: false },
          }
        : undefined,
    },
    cacheDir: '.cache',
    css: {
      devSourcemap: isDevelopment,
    },
    define: {
      'process.env': Object.fromEntries(
        Object.entries(evars).map(([evarKey, evarValue]) => [evarKey, JSON.stringify(evarValue)]),
      ),
    },
    envPrefix: 'VITE_',
    json: {
      stringify: true,
    },
    optimizeDeps: {
      include: [],
      exclude: [],
    },
    plugins: [
      tsconfigPaths(),
      react({
        jsxImportSource: 'react',
        tsDecorators: true,
      }),
      svgr({
        esbuildOptions: {
          minify: true,
        },
        include: '**/*.svg?react',
        svgrOptions: {
          descProp: true,
          expandProps: 'end',
          memo: true,
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          prettier: true,
          ref: true,
          svgo: true,
          titleProp: true,
          typescript: false,
        },
      }),
    ],
    preview: {
      port: 4173,
      open: true,
    },
    publicDir: 'public',
    resolve: {
      alias: {
        '~': normalizePath(path.resolve(__dirname, 'src')),
      },
    },
    server: {
      cors: true,
      hmr: {
        overlay: isDevelopment,
      },
      port: port,
      strictPort: true,
      watch: isDevelopment
        ? {
            ignored: ['*/dist/**', '*/node_modules/**'],
          }
        : undefined,
    },
  };
});
