const core = require("@budibase/backend-core")

const dbConfig = {
  inMemory: true,
}

export const init = () => {
  core.init({ db: dbConfig })
}
