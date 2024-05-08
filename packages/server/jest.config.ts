import { Config } from "@jest/types"

import * as fs from "fs"
import { join } from "path"

const baseConfig: Config.InitialProjectOptions = {
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
  transformIgnorePatterns: ["/node_modules/(?!svelte/).*"],
  moduleNameMapper: {
    "@budibase/backend-core/(.*)": "<rootDir>/../backend-core/$1",
    "@budibase/shared-core/(.*)": "<rootDir>/../shared-core/$1",
    "@budibase/backend-core": "<rootDir>/../backend-core/src",
    "@budibase/shared-core": "<rootDir>/../shared-core/src",
    "@budibase/types": "<rootDir>/../types/src",
    "@budibase/string-templates/(.*)": ["<rootDir>/../string-templates/$1"],
    "@budibase/string-templates": ["<rootDir>/../string-templates/src"],
  },
}

// add pro sources if they exist
if (fs.existsSync("../pro/src")) {
  baseConfig.moduleNameMapper!["@budibase/pro"] = "<rootDir>/../pro/src"
}

const config: Config.InitialOptions = {
  projects: [
    {
      ...baseConfig,
      testMatch: ["<rootDir>/**/!(*.seq).spec.[jt]s"],
    },
  ],
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
