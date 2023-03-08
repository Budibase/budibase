import { Config } from "@jest/types"
import * as fs from "fs"
const preset = require("ts-jest/jest-preset")

const config: Config.InitialOptions = {
  ...preset,
  preset: "@trendyol/jest-testcontainers",
  setupFiles: ["./src/tests/jestEnv.ts"],
  setupFilesAfterEnv: ["./src/tests/jestSetup.ts"],
  collectCoverageFrom: ["src/**/*.{js,ts}", "../backend-core/src/**/*.{js,ts}"],
  coverageReporters: ["lcov", "json", "clover"],
  transform: {
    "^.+\\.ts?$": "@swc/jest",
  },
  moduleNameMapper: {
    "@budibase/backend-core/(.*)": "<rootDir>/../backend-core/$1",
    "@budibase/backend-core": "<rootDir>/../backend-core/src",
    "@budibase/types": "<rootDir>/../types/src",
  },
}

// add pro sources if they exist
if (fs.existsSync("../../../budibase-pro")) {
  config.moduleNameMapper["@budibase/pro/(.*)"] =
    "<rootDir>/../../../budibase-pro/packages/pro/$1"
  config.moduleNameMapper["@budibase/pro"] =
    "<rootDir>/../../../budibase-pro/packages/pro/src"
}

export default config
