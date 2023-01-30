import { Config } from "jest"
const preset = require("ts-jest/jest-preset")

const configSettings = {
  ...preset,
  preset: "@trendyol/jest-testcontainers",
  setupFiles: ["./tests/jestEnv.ts"],
  setupFilesAfterEnv: ["./tests/jestSetup.ts"],
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coverageReporters: ["lcov", "json", "clover"],
  transform: {
    "^.+\\.ts?$": "@swc/jest",
  },
}

if (!process.env.CI) {
  // use sources when not in CI
  configSettings.moduleNameMapper = {
    "@budibase/types": "<rootDir>/../types/src",
  }
} else {
  console.log("Running tests with compiled dependency sources")
}

const config: Config = {
  projects: [
    {
      ...configSettings,
      displayName: "sequential test",
      testMatch: ["<rootDir>/**/*.seq.spec.[jt]s"],
      runner: "jest-serial-runner",
    },
    {
      ...configSettings,
      testMatch: ["<rootDir>/**/!(*.seq).spec.[jt]s"],
    },
  ],
}

export default config
