import { Config } from "@jest/types"

const baseConfig: Config.InitialProjectOptions = {
  setupFiles: ["./tests/jestEnv.ts"],
  globalSetup: "./../../globalSetup.ts",
  setupFilesAfterEnv: ["./tests/jestSetup.ts"],
  transform: {
    "^.+\\.ts?$": "@swc/jest",
  },
  moduleNameMapper: {
    "@budibase/types": "<rootDir>/../types/src",
    "@budibase/shared-core": ["<rootDir>/../shared-core/src"],
  },
}

const config: Config.InitialOptions = {
  ...baseConfig,
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coverageReporters: ["lcov", "json", "clover"],
}

process.env.DISABLE_PINO_LOGGER = "1"

export default config
