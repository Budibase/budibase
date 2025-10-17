import { Config } from "jest"

const baseConfig: Config = {
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

const config: Config = {
  ...baseConfig,
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coverageReporters: ["lcov", "json", "clover"],
}

process.env.DISABLE_PINO_LOGGER = "1"

export default config
