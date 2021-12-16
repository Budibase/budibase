require("./utils").threadSetup()
const ScriptRunner = require("../utilities/scriptRunner")
const { integrations } = require("../integrations")
const { processStringSync } = require("@budibase/string-templates")

async function addDatasourceVariables(datasource, parameters) {
  if (!datasource || !datasource.config) {
    return parameters
  }
  const staticVars = datasource.config.staticVariables || {}
  const dynamicVars = datasource.config.dynamicVariables || []
  for (let [key, value] of Object.entries(staticVars)) {
    if (!parameters[key]) {
      parameters[key] = value
    }
  }
  for (let variable of dynamicVars) {
    console.log(variable)
    // TODO: get the variable from query
  }
  return parameters
}

function enrichQueryFields(fields, parameters = {}) {
  const enrichedQuery = {}

  // enrich the fields with dynamic parameters
  for (let key of Object.keys(fields)) {
    if (fields[key] == null) {
      continue
    }
    if (typeof fields[key] === "object") {
      // enrich nested fields object
      enrichedQuery[key] = enrichQueryFields(fields[key], parameters)
    } else if (typeof fields[key] === "string") {
      // enrich string value as normal
      enrichedQuery[key] = processStringSync(fields[key], parameters, {
        noHelpers: true,
      })
    } else {
      enrichedQuery[key] = fields[key]
    }
  }

  if (
    enrichedQuery.json ||
    enrichedQuery.customData ||
    enrichedQuery.requestBody
  ) {
    try {
      enrichedQuery.json = JSON.parse(
        enrichedQuery.json ||
          enrichedQuery.customData ||
          enrichedQuery.requestBody
      )
    } catch (err) {
      // no json found, ignore
    }
    delete enrichedQuery.customData
  }

  return enrichedQuery
}

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

function hasExtraData(response) {
  return (
    typeof response === "object" &&
    !Array.isArray(response) &&
    response.data != null &&
    response.info != null
  )
}

async function runAndTransform(
  datasource,
  queryVerb,
  fields,
  parameters,
  transformer
) {
  // pre-query, make sure datasource variables are added to parameters
  parameters = await addDatasourceVariables(datasource, parameters)
  const query = enrichQueryFields(fields, parameters)
  const Integration = integrations[datasource.source]
  if (!Integration) {
    throw "Integration type does not exist."
  }
  const integration = new Integration(datasource.config)

  let output = formatResponse(await integration[queryVerb](query))
  let rows = output,
    info = undefined,
    extra = undefined
  if (hasExtraData(output)) {
    rows = output.data
    info = output.info
    extra = output.extra
  }

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

  return { rows, keys, info, extra }
}

module.exports = (input, callback) => {
  runAndTransform(
    input.datasource,
    input.queryVerb,
    input.fields,
    input.parameters,
    input.transformer
  )
    .then(response => {
      callback(null, response)
    })
    .catch(err => {
      callback(err)
    })
}
