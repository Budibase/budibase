import { Config } from "@jest/types"
const preset = require("ts-jest/jest-preset")

const config: Config.InitialOptions = {
  ...preset,
  preset: "@trendyol/jest-testcontainers",
  testEnvironment: "node",
  setupFiles: ["./tests/jestSetup.ts"],
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coverageReporters: ["lcov", "json", "clover"],
  transform: {
    "^.+\\.ts?$": "@swc/jest",
  },
}

export default config
