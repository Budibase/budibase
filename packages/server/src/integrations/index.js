const postgres = require("./postgres")

const DEFINITIONS = {
  POSTGRES: postgres.schema,
}

const INTEGRATIONS = {
  POSTGRES: postgres.integration,
}

module.exports = {
  definitions: DEFINITIONS,
  integrations: INTEGRATIONS,
}
