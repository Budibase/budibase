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

if (!process.env.CI) {
  // use sources when not in CI
  testContainersSettings.moduleNameMapper = {
    "@budibase/types": "<rootDir>/../types/src",
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
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coverageReporters: ["lcov", "json", "clover"],
}

export default config
