import type { Config } from "jest"

const config: Config = {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "@swc/jest",
  },
  moduleNameMapper: {
    "@budibase/types": "<rootDir>/../types/src",
  },
}

export default config
