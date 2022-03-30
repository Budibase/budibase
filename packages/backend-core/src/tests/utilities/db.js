const core = require("../../index")
const dbConfig = {
  inMemory: true,
  allDbs: true,
}
core.init({ db: dbConfig })
