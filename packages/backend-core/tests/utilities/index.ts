export * as mocks from "./mocks"
export * as structures from "./structures"
export { generator } from "./structures"
export * as testEnv from "./testEnv"
export * as testContainerUtils from "./testContainerUtils"

import * as dbConfig from "./db"
dbConfig.init()
