const core = require("../../index")
const dbConfig = {
  inMemory: true,
}
core.init({ db: dbConfig })
