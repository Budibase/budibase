import { Config } from "jest"
const preset = require("ts-jest/jest-preset")

const testContainersSettings = {
  ...preset,
  preset: "@trendyol/jest-testcontainers",
  setupFiles: ["./tests/jestEnv.ts"],
  setupFilesAfterEnv: ["./tests/jestSetup.ts"],
  transform: {
    "^.+\\.ts?$": "@swc/jest",
  },
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
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coverageReporters: ["lcov", "json", "clover"],
}

if (!process.env.CI) {
  // use sources when not in CI
  config.moduleNameMapper = {
    "@budibase/types": "<rootDir>/../types/src",
  }
} else {
  console.log("Running tests with compiled dependency sources")
}

export default config
