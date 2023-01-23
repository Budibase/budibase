import { Config } from "@jest/types"
import * as fs from "fs"
const preset = require("ts-jest/jest-preset")

const config: Config.InitialOptions = {
  ...preset,
  preset: "@trendyol/jest-testcontainers",
  setupFiles: ["./src/tests/jestEnv.ts"],
  setupFilesAfterEnv: ["./src/tests/jestSetup.ts"],
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    // The use of coverage with couchdb view functions breaks tests
    "!src/db/views/staticViews.*",
  ],
  coverageReporters: ["lcov", "json", "clover"],
  transform: {
    "^.+\\.ts?$": "@swc/jest",
  },
}

export default config
