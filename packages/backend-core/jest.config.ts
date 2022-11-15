import { Config } from "@jest/types"

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["./tests/jestSetup.ts"],
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coverageReporters: ["lcov", "json", "clover"],
}

if (!process.env.CI) {
  // use sources when not in CI
  config.moduleNameMapper = {
    "@budibase/types": "<rootDir>/../types/src",
    "^axios.*$": "<rootDir>/node_modules/axios/lib/axios.js",
  }
} else {
  console.log("Running tests with compiled dependency sources")
}

export default config
