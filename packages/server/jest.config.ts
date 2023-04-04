import { Config } from "@jest/types"

import * as fs from "fs"
const preset = require("ts-jest/jest-preset")

const baseConfig: Config.InitialProjectOptions = {
  ...preset,
  preset: "@trendyol/jest-testcontainers",
  setupFiles: ["./src/tests/jestEnv.ts"],
  setupFilesAfterEnv: ["./src/tests/jestSetup.ts"],
  transform: {
    "^.+\\.ts?$": "@swc/jest",
  },
  moduleNameMapper: {
    "@budibase/backend-core/(.*)": "<rootDir>/../backend-core/$1",
    "@budibase/backend-core": "<rootDir>/../backend-core/src",
    "@budibase/shared-core": "<rootDir>/../shared-core/src",
    "@budibase/types": "<rootDir>/../types/src",
  },
}

// add pro sources if they exist
if (fs.existsSync("../../../budibase-pro")) {
  baseConfig.moduleNameMapper["@budibase/pro"] =
    "<rootDir>/../../../budibase-pro/packages/pro/src"
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

export default config
