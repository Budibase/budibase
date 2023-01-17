import { Config } from "@jest/types"
import * as fs from "fs"

const config: Config.InitialOptions = {
  testEnvironment: "node",
  setupFiles: ["./src/tests/jestEnv.ts"],
  setupFilesAfterEnv: ["./src/tests/jestSetup.ts"],
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coverageReporters: ["lcov", "json", "clover"],
  transform: {
    "^.+\\.ts?$": "@swc/jest",
  },
}

export default config
