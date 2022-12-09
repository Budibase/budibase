export * as mocks from "./mocks"
export * as structures from "./structures"
export { generator } from "./structures"

import * as dbConfig from "./db"
dbConfig.init()
