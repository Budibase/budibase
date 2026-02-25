import { Config } from "jest"

const config: Config = {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "@swc/jest",
  },
  setupFiles: ["./tests/jestEnv.ts"],
  globalSetup: "./../../globalSetup.ts",
  setupFilesAfterEnv: ["./tests/jestSetup.ts"],
  collectCoverageFrom: ["src/**/*.{js,ts}", "!src/db/views/staticViews.*"],
  coverageReporters: ["lcov", "json", "clover"],
  moduleNameMapper: {
    "@budibase/types": "<rootDir>/../types/src",
    "@budibase/backend-core/(.*)": "<rootDir>/../backend-core/$1",
    "@budibase/backend-core": "<rootDir>/../backend-core/src",
    "@budibase/string-templates": "<rootDir>/../string-templates/src",
    "@budibase/shared-core": "<rootDir>/../shared-core/src",
  },
}

export default config
