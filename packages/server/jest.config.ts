import { Config } from "jest"

import * as fs from "fs"
const preset = require("ts-jest/jest-preset")

const testContainersSettings = {
  ...preset,
  preset: "@trendyol/jest-testcontainers",
  setupFiles: ["./src/tests/jestEnv.ts"],
  setupFilesAfterEnv: ["./src/tests/jestSetup.ts"],
  transform: {
    "^.+\\.ts?$": "@swc/jest",
  },
}

if (!process.env.CI) {
  // use sources when not in CI
  testContainersSettings.moduleNameMapper = {
    "@budibase/backend-core/(.*)": "<rootDir>/../backend-core/$1",
    "@budibase/backend-core": "<rootDir>/../backend-core/src",
    "@budibase/types": "<rootDir>/../types/src",
  }
  // add pro sources if they exist
  if (fs.existsSync("../../../budibase-pro")) {
    testContainersSettings.moduleNameMapper["@budibase/pro"] =
      "<rootDir>/../../../budibase-pro/packages/pro/src"
  }
} else {
  console.log("Running tests with compiled dependency sources")
}

const config: Config = {
  projects: [
    {
      ...testContainersSettings,
      displayName: "sequential test",
      testMatch: ["<rootDir>/**/*.seq.spec.[jt]s"],
      runner: "jest-serial-runner",
    },
    {
      ...testContainersSettings,
      testMatch: ["<rootDir>/**/!(*.seq).spec.[jt]s"],
    },
  ],
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    // The use of coverage with couchdb view functions breaks tests
    "!src/db/views/staticViews.*",
  ],
  coverageReporters: ["lcov", "json", "clover"],
}

export default config
