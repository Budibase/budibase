import globals from "globals"
import babelParser from "@babel/eslint-parser"
import svelteParser from "svelte-eslint-parser"
import tsParser from "@typescript-eslint/parser"

import eslintPluginJest from "eslint-plugin-jest"
import eslintPluginSvelte from "eslint-plugin-svelte"
import eslintPluginLocalRules from "eslint-plugin-local-rules"

import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

export default [
  eslint.configs.recommended,
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
        "prefer-spread": "off",
        "no-unused-vars": "off",
        "prefer-rest-params": "off",
        "local-rules/no-barrel-imports": "error",
        "local-rules/no-budibase-imports": "error",
        "local-rules/no-console-error": "error",

        "@typescript-eslint/no-this-alias": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/ban-ts-comment": "off",
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

        "no-redeclare": "off",
        "@typescript-eslint/no-redeclare": "error",
        "no-dupe-class-members": "off",
      },
    }
  }),
  {
    files: ["**/*.spec.ts"],

    plugins: {
      jest: eslintPluginJest,
    },

    languageOptions: {
      globals: {
        ...eslintPluginJest.environments.globals.globals,
        NodeJS: true,
      },

      parser: tsParser,
    },

    rules: {
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
