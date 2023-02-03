import { Config } from "@jest/types"
const preset = require("ts-jest/jest-preset")

const testContainersSettings: Config.InitialProjectOptions = {
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

const config: Config.InitialOptions = {
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
