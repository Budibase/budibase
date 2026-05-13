import { Config } from "jest"
import { join } from "path"

const baseConfig: Config = {
  setupFiles: ["./src/tests/jestEnv.ts"],
  moduleFileExtensions: [
    "js",
    "mjs",
    "cjs",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node",
    "svelte",
  ],
  setupFilesAfterEnv: ["./src/tests/jestSetup.ts"],
  globalSetup: "./../../globalSetup.ts",
  transform: {
    "^.+\\.ts?$": "@swc/jest",
    "^.+\\.js?$": "@swc/jest",
    "^.+\\.svelte?$": "<rootDir>/scripts/svelteTransformer.js",
  },
  transformIgnorePatterns: ["/node_modules/(?!svelte/|esm-env/|devalue/).*"],
  moduleNameMapper: {
    "@budibase/backend-core/(.*)": "<rootDir>/../backend-core/$1",
    "@budibase/shared-core/(.*)": "<rootDir>/../shared-core/$1",
    "@budibase/backend-core": "<rootDir>/../backend-core/src",
    "@budibase/shared-core": "<rootDir>/../shared-core/src",
    "@budibase/types": "<rootDir>/../types/src",
    "@budibase/string-templates/(.*)": ["<rootDir>/../string-templates/$1"],
    "@budibase/string-templates": ["<rootDir>/../string-templates/src"],
    "^chat$": "<rootDir>/__mocks__/chat.ts",
    "^@chat-adapter/discord$": "<rootDir>/__mocks__/chat-adapter-discord.ts",
    "^@chat-adapter/slack$": "<rootDir>/__mocks__/chat-adapter-slack.ts",
    "^@chat-adapter/teams$": "<rootDir>/__mocks__/chat-adapter-teams.ts",
    "^@chat-adapter/telegram$": "<rootDir>/__mocks__/chat-adapter-telegram.ts",
    "^@chat-adapter/state-memory$":
      "<rootDir>/__mocks__/chat-adapter-state-memory.ts",
    "^@chat-adapter/state-ioredis$":
      "<rootDir>/__mocks__/chat-adapter-state-ioredis.ts",
    "@budibase/pro": "<rootDir>/../pro/src",
  },
}

const config: Config = {
  ...baseConfig,
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "../backend-core/src/**/*.{js,ts}",
    // The use of coverage with couchdb view functions breaks tests
    "!src/db/views/staticViews.*",
    "!src/**/*.spec.{js,ts}",
    "!src/tests/**/*.{js,ts}",
    // The use of coverage in the JS runner breaks tests by inserting
    // coverage functions into code that will run inside of the isolate.
    "!src/jsRunner/**/*.{js,ts}",
  ],
  coverageReporters: ["lcov", "json", "clover"],
}

process.env.TOP_LEVEL_PATH = join(__dirname, "..", "..")

export default config
