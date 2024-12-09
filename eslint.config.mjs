import globals from "globals"
import babelParser from "@babel/eslint-parser"
import svelteParser from "svelte-eslint-parser"
import tsParser from "@typescript-eslint/parser"

import eslintPluginJest from "eslint-plugin-jest"
import eslintPluginSvelte from "eslint-plugin-svelte"
import eslintPluginLocalRules from "eslint-plugin-local-rules"
import eslintPluginVitest from "@vitest/eslint-plugin"

import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

export default [
  eslint.configs.recommended,
  {
    ignores: [
      "**/node_modules",
      "**/dist",
      "**/public",
      "**/bundle.js",
      "**/coverage",
      "packages/server/builder",
      "packages/server/client",
      "packages/builder/.routify",
      "packages/sdk/sdk",
      "**/*.ivm.bundle.js",
      "packages/server/build/oldClientVersions/**/**/*",
    ],
  },
  {
    plugins: {
      "local-rules": eslintPluginLocalRules,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        GeolocationPositionError: true,
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
      "prefer-const": "off",
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
          caughtErrors: "none",
        },
      ],
    },
  },
  ...eslintPluginSvelte.configs["flat/recommended"].map(config => {
    return {
      ...config,
      files: ["**/*.svelte"],

      languageOptions: {
        parser: svelteParser,
        ecmaVersion: 2019,
        sourceType: "script",

        parserOptions: {
          parser: "@typescript-eslint/parser",
          allowImportExportEverywhere: true,
        },
      },
    }
  }),
  ...tseslint.configs.recommended.map(config => {
    return {
      ...config,
      files: ["**/*.ts"],

      languageOptions: {
        globals: {
          NodeJS: true,
        },

        parser: tsParser,
      },

      rules: {
        "local-rules/no-barrel-imports": "error",
        "local-rules/no-budibase-imports": "error",
        "local-rules/no-console-error": "error",

        // @typscript-eslint/no-unused-vars supersedes no-unused-vars
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            varsIgnorePattern: "^_",
            argsIgnorePattern: "^_",
            destructuredArrayIgnorePattern: "^_",
            ignoreRestSiblings: true,
            caughtErrors: "none",
          },
        ],

        // @typescript-eslint/no-redeclare supersedes no-redeclare
        "no-redeclare": "off",
        "@typescript-eslint/no-redeclare": "error",

        // @typescript-eslint/no-dupe-class-members supersedes no-dupe-class-members
        "no-dupe-class-members": "off",
        "@typescript-eslint/no-dupe-class-members": "error",
      },
    }
  }),
  {
    files: ["**/*.spec.ts", "**/*.spec.js"],

    plugins: {
      jest: eslintPluginJest,
      vitest: eslintPluginVitest,
    },

    languageOptions: {
      globals: {
        ...eslintPluginJest.environments.globals.globals,
        ...eslintPluginVitest.environments.env.globals,
        NodeJS: true,
      },

      parser: tsParser,
    },

    rules: {
      ...eslintPluginVitest.configs.recommended.rules,
      ...eslintPluginJest.configs.recommended.rules,

      "no-console": "warn",

      "vitest/expect-expect": "off",

      "jest/expect-expect": "off",
      "jest/no-conditional-expect": "off",
      "jest/no-disabled-tests": "off",
      "jest/no-standalone-expect": "off",

      "local-rules/no-test-com": "error",
      "local-rules/email-domain-example-com": "error",
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
