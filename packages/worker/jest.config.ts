import { Config } from "@jest/types"
import * as fs from "fs"

const config: Config.InitialOptions = {
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
  },
}

// add pro sources if they exist
if (fs.existsSync("../pro/src")) {
  config.moduleNameMapper!["@budibase/pro/(.*)"] = "<rootDir>/../pro/$1"
  config.moduleNameMapper!["@budibase/pro"] = "<rootDir>/../pro/src"
}

export default config
