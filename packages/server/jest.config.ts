import { Config } from "@jest/types"
import * as fs from "fs"

const config: Config.InitialOptions = {
  testEnvironment: "node",
  setupFiles: ["./src/tests/jestEnv.ts"],
  setupFilesAfterEnv: ["./src/tests/jestSetup.ts"],
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    // The use of coverage with couchdb view functions breaks tests
    "!src/db/views/staticViews.*",
  ],
  coverageReporters: ["lcov", "json", "clover"],
  transform: {
    "^.+\\.ts?$": "@swc/jest",
  },
}

if (!process.env.CI) {
  // use sources when not in CI
  config.moduleNameMapper = {
    "@budibase/backend-core/(.*)": "<rootDir>/../backend-core/$1",
    "@budibase/backend-core": "<rootDir>/../backend-core/src",
    "@budibase/types": "<rootDir>/../types/src",
    "^axios.*$": "<rootDir>/node_modules/axios/lib/axios.js",
  }
  // add pro sources if they exist
  if (fs.existsSync("../../../budibase-pro")) {
    config.moduleNameMapper["@budibase/pro"] =
      "<rootDir>/../../../budibase-pro/packages/pro/src"
  }
} else {
  console.log("Running tests with compiled dependency sources")
}

export default config
