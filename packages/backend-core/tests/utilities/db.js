const core = require("../../src/index")
const dbConfig = {
  inMemory: true,
  allDbs: true,
}
core.init({ db: dbConfig })
