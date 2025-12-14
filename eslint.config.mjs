import path from 'node:path';
import { fileURLToPath } from 'node:url';

import stylistic from '@stylistic/eslint-plugin';
import auto from 'eslint-config-canonical/auto';
import * as typeChecking from 'eslint-config-canonical/typescript-type-checking';
import simpleImportSort from 'eslint-plugin-simple-import-sort';


const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default [
  // Ignore build artifacts and lock files
  {
    ignores: [
      // Directories
      '.cache/**',
      '.cursor/**',
      '.git/**',
      '.github/**',
      '.husky/**',
      'build/**',
      'coverage/**',
      'dist/**',
      'logs/**',
      'node_modules/**',
      'public/**',
      // Files
      '*.config.*',
      'pnpm-lock.yaml',
    ],
  },

  // Auto canonical configuration (includes all base rules + React + TypeScript)
  ...auto.map((config) => {
    // For TS files use eslint-specific tsconfig
    if (config.files && config.files.some((file) => file.includes('.ts'))) {
      return {
        ...config,
        languageOptions: {
          ...config.languageOptions,
          parserOptions: {
            project: './tsconfig.eslint.json',
            tsconfigRootDir,
          },
        },
      };
    }
    return config;
  }),

  // TypeScript type-checking rules (strictest) - only for TS files
  ...typeChecking.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir,
      },
    },
  })),

  // Additional settings and overrides
  {
    plugins: {
      '@stylistic': stylistic,
      'simple-import-sort': simpleImportSort,
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      'jsonc/no-comments': 'off',

      'react/prop-types': 'off',
      'react/require-default-props': 'off',

      // Explicitly disabling all canonical sorting rules
      '@typescript-eslint/no-import-type-side-effects': 'off',
      'canonical/sort-keys': 'off',
      'import/first': 'off',
      'import/newline-after-import': 'off',
      'import/order': 'off',
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-named-imports': 'off',
      'sort-imports': 'off',

      // Explicitly disabling all prettier rules
      'prettier/prettier': "off",

      // Explicitly including only simple-import-sort
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
];
