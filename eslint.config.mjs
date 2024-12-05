import _import from "eslint-plugin-import"
import localRules from "eslint-plugin-local-rules"
import { fixupPluginRules } from "@eslint/compat"
import globals from "globals"
import babelParser from "@babel/eslint-parser"
import parser from "svelte-eslint-parser"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import jest from "eslint-plugin-jest"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      "**/node_modules",
      "**/dist",
      "**/public",
      "**/*.spec.js",
      "**/bundle.js",
      "**/node_modules",
      "**/public",
      "**/dist",
      "packages/server/builder",
      "packages/server/coverage",
      "packages/worker/coverage",
      "packages/backend-core/coverage",
      "packages/server/client",
      "packages/server/coverage",
      "packages/builder/.routify",
      "packages/sdk/sdk",
      "**/*.ivm.bundle.js",
      "packages/server/build/oldClientVersions/**/**/*",
    ],
  },
  tseslint.configs.recommended,
  eslint.configs.recommended,
  {
    plugins: {
      import: fixupPluginRules(_import),
      "local-rules": localRules,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        // GeolocationPositionError: true,
      },

      parser: babelParser,
      ecmaVersion: 2019,
      sourceType: "module",

      parserOptions: {
        allowImportExportEverywhere: true,
      },
    },

    rules: {
      "no-self-assign": "off",

      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      "import/no-relative-packages": "error",
      "import/export": "error",
      "import/no-duplicates": "error",
      "import/newline-after-import": "error",
    },
  },
  ...compat.extends("plugin:svelte/recommended").map(config => ({
    ...config,
    files: ["**/*.svelte"],
  })),
  {
    files: ["**/*.svelte"],

    languageOptions: {
      parser: parser,
      ecmaVersion: 2019,
      sourceType: "script",

      parserOptions: {
        parser: "@typescript-eslint/parser",
        allowImportExportEverywhere: true,
      },
    },
  },
  ...compat.extends("eslint:recommended").map(config => ({
    ...config,
    files: ["**/*.ts"],
  })),
  {
    files: ["**/*.ts"],

    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      globals: {
        NodeJS: true,
      },

      parser: tsParser,
    },

    rules: {
      "no-unused-vars": "off",
      "local-rules/no-barrel-imports": "error",
      "local-rules/no-budibase-imports": "error",
      "local-rules/no-console-error": "error",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      "no-redeclare": "off",
      "@typescript-eslint/no-redeclare": "error",
      "no-dupe-class-members": "off",
    },
  },
  ...compat
    .extends("eslint:recommended", "plugin:jest/recommended")
    .map(config => ({
      ...config,
      files: ["**/*.spec.ts"],
    })),
  {
    files: ["**/*.spec.ts"],

    plugins: {
      jest,
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...jest.environments.globals.globals,
        NodeJS: true,
      },

      parser: tsParser,
    },

    rules: {
      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      "local-rules/no-test-com": "error",
      "local-rules/email-domain-example-com": "error",
      "no-console": "warn",
      "jest/expect-expect": "off",
      "jest/no-conditional-expect": "off",
      "no-dupe-class-members": "off",
      "no-redeclare": "off",
    },
  },
  {
    files: [
      "packages/builder/**/*",
      "packages/client/**/*",
      "packages/frontend-core/**/*",
    ],

    rules: {
      "no-console": [
        "error",
        {
          allow: ["warn", "error", "debug"],
        },
      ],
    },
  },
]
