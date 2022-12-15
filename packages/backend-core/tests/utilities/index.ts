export * as mocks from "./mocks"
export * as structures from "./structures"
export { generator } from "./structures"
export * as testEnv from "./testEnv"

import * as dbConfig from "./db"
dbConfig.init()
