// when thread starts, make sure it is recorded
const env = require("../environment")
env.setInThread()
const ScriptRunner = require("../utilities/scriptRunner")
const { integrations } = require("../integrations")

function formatResponse(resp) {
  if (typeof resp === "string") {
    try {
      resp = JSON.parse(resp)
    } catch (err) {
      resp = { response: resp }
    }
  }
  return resp
}

async function runAndTransform(datasource, queryVerb, query, transformer) {
  const Integration = integrations[datasource.source]
  if (!Integration) {
    throw "Integration type does not exist."
  }
  const integration = new Integration(datasource.config)

  let rows = formatResponse(await integration[queryVerb](query))

  // transform as required
  if (transformer) {
    const runner = new ScriptRunner(transformer, { data: rows })
    rows = runner.execute()
  }

  // needs to an array for next step
  if (!Array.isArray(rows)) {
    rows = [rows]
  }

  // map into JSON if just raw primitive here
  if (rows.find(row => typeof row !== "object")) {
    rows = rows.map(value => ({ value }))
  }

  // get all the potential fields in the schema
  let keys = rows.flatMap(Object.keys)

  if (integration.end) {
    integration.end()
  }

  return { rows, keys }
}

module.exports = (input, callback) => {
  runAndTransform(
    input.datasource,
    input.queryVerb,
    input.query,
    input.transformer
  )
    .then(response => {
      callback(null, response)
    })
    .catch(err => {
      callback(err)
    })
}
