import * as db from "../../src/db"

const dbConfig = {
  inMemory: true,
}

export const init = () => {
  db.init(dbConfig)
}
