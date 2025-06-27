export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "@swc/jest",
  },
  moduleNameMapper: {
    "@budibase/types": "<rootDir>/../types/src",
    "^lodash-es$": "lodash",
    "^lodash-es/(.*)$": "lodash/$1",
  },
}
