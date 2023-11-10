import { Config } from "@jest/types"

import * as fs from "fs"
import { join } from "path"

const baseConfig: Config.InitialProjectOptions = {
  preset: "@trendyol/jest-testcontainers",
  setupFiles: ["./src/tests/jestEnv.ts"],
  setupFilesAfterEnv: ["./src/tests/jestSetup.ts"],
  transform: {
    "^.+\\.ts?$": "@swc/jest",
  },
  moduleNameMapper: {
    "@budibase/backend-core/(.*)": "<rootDir>/../backend-core/$1",
    "@budibase/shared-core/(.*)": "<rootDir>/../shared-core/$1",
    "@budibase/backend-core": "<rootDir>/../backend-core/src",
    "@budibase/shared-core": "<rootDir>/../shared-core/src",
    "@budibase/types": "<rootDir>/../types/src",
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
      displayName: "sequential test",
      testMatch: ["<rootDir>/**/*.seq.spec.[jt]s"],
      runner: "jest-serial-runner",
    },
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
  ],
  coverageReporters: ["lcov", "json", "clover"],
}

process.env.TOP_LEVEL_PATH = join(__dirname, "..", "..")

export default config
