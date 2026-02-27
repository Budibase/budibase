import { Config } from "jest"

const config: Config = {
  globalSetup: "./../../globalSetup.ts",
  setupFiles: ["./src/tests/jestEnv.ts"],
  setupFilesAfterEnv: ["./src/tests/jestSetup.ts"],
  collectCoverageFrom: ["src/**/*.{js,ts}", "../backend-core/src/**/*.{js,ts}"],
  coverageReporters: ["lcov", "json", "clover"],
  transform: {
    "^.+\\.ts?$": "@swc/jest",
  },
  moduleNameMapper: {
    "@budibase/backend-core/(.*)": "<rootDir>/../backend-core/$1",
    "@budibase/backend-core": "<rootDir>/../backend-core/src",
    "@budibase/types": "<rootDir>/../types/src",
    "@budibase/shared-core": ["<rootDir>/../shared-core/src"],
    "@budibase/string-templates": ["<rootDir>/../string-templates/src"],
    "@budibase/pro/(.*)": "<rootDir>/../pro/$1",
    "@budibase/pro": "<rootDir>/../pro/src",
  },
}

export default config
