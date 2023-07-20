import { Config } from "@jest/types"

const config: Config.InitialOptions = {
  preset: "ts-jest",
  setupFiles: ["./src/jest/jestSetup.ts"],
  setupFilesAfterEnv: ["./src/jest/jest.extends.ts"],
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "@swc/jest",
  },
  globalSetup: "./src/jest/globalSetup.ts",
  globalTeardown: "./src/jest/globalTeardown.ts",
  moduleNameMapper: {
    "@budibase/types": "<rootDir>/../packages/types/src",
    "@budibase/server": "<rootDir>/../packages/server/src",
    "@budibase/backend-core": "<rootDir>/../packages/backend-core/src",
    "@budibase/backend-core/(.*)": "<rootDir>/../packages/backend-core/$1",
  },
}

export default config
