const threadUtils = require("./utils")
threadUtils.threadSetup()
const ScriptRunner = require("../utilities/scriptRunner")
const { integrations } = require("../integrations")
const {
  processStringSync,
  findHBSBlocks,
} = require("@budibase/string-templates")
const { doInAppContext, getAppDB } = require("@budibase/backend-core/context")
const { isSQL } = require("../integrations/utils")

const CONST_CHAR_REGEX = new RegExp("'[^']*'", "g")

class QueryRunner {
  constructor(input, flags = { noRecursiveQuery: false }) {
    this.datasource = input.datasource
    this.queryVerb = input.queryVerb
    this.fields = input.fields
    this.parameters = input.parameters
    this.pagination = input.pagination
    this.transformer = input.transformer
    this.queryId = input.queryId
    this.noRecursiveQuery = flags.noRecursiveQuery
    this.cachedVariables = []
    // allows the response from a query to be stored throughout this
    // execution so that if it needs to be re-used for another variable
    // it can be
    this.queryResponse = {}
    this.hasRerun = false
  }

  interpolateSQL(fields, parameters, integration) {
    let sql = fields.sql
    if (!sql) {
      return fields
    }
    const bindings = findHBSBlocks(sql)
    let variables = [],
      arrays = []
    for (let binding of bindings) {
      // look for array/list operations in the SQL statement, which will need handled later
      const listRegexMatch = sql.match(
        new RegExp(`(in|IN|In|iN)( )+[(]?${binding}[)]?`)
      )
      // check if the variable was used as part of a string concat e.g. 'Hello {{binding}}'
      // start by finding all the instances of const character strings
      const charConstMatch = sql.match(CONST_CHAR_REGEX) || []
      // now look within them to see if a binding is used
      const charConstBindingMatch = charConstMatch.find(string =>
        string.match(new RegExp(`'[^']*${binding}[^']*'`))
      )
      if (charConstBindingMatch) {
        let [part1, part2] = charConstBindingMatch.split(binding)
        part1 = `'${part1.substring(1)}'`
        part2 = `'${part2.substring(0, part2.length - 1)}'`
        sql = sql.replace(
          charConstBindingMatch,
          integration.getStringConcat([
            part1,
            integration.getBindingIdentifier(),
            part2,
          ])
        )
      }
      // generate SQL parameterised array
      else if (listRegexMatch) {
        arrays.push(binding)
        // determine the length of the array
        const value = this.enrichQueryFields([binding], parameters)[0].split(
          ","
        )
        // build a string like ($1, $2, $3)
        let replacement = `${Array.apply(null, Array(value.length))
          .map(() => integration.getBindingIdentifier())
          .join(",")}`
        // check if parentheses are needed
        if (!listRegexMatch[0].includes(`(${binding})`)) {
          replacement = `(${replacement})`
        }
        sql = sql.replace(binding, replacement)
      } else {
        sql = sql.replace(binding, integration.getBindingIdentifier())
      }
      variables.push(binding)
    }
    // replicate the knex structure
    fields.sql = sql
    fields.bindings = this.enrichQueryFields(variables, parameters)
    // check for arrays in the data
    let updated = []
    for (let i = 0; i < variables.length; i++) {
      if (arrays.includes(variables[i])) {
        updated = updated.concat(fields.bindings[i].split(","))
      } else {
        updated.push(fields.bindings[i])
      }
    }
    fields.bindings = updated
    return fields
  }

  async execute() {
    let { datasource, fields, queryVerb, transformer } = this
    const Integration = integrations[datasource.source]
    if (!Integration) {
      throw "Integration type does not exist."
    }
    const integration = new Integration(datasource.config)

    // pre-query, make sure datasource variables are added to parameters
    const parameters = await this.addDatasourceVariables()
    let query
    // handle SQL injections by interpolating the variables
    if (isSQL(datasource)) {
      query = this.interpolateSQL(fields, parameters, integration)
    } else {
      query = this.enrichQueryFields(fields, parameters)
    }

    // Add pagination values for REST queries
    if (this.pagination) {
      query.paginationValues = this.pagination
    }

    let output = threadUtils.formatResponse(await integration[queryVerb](query))
    let rows = output,
      info = undefined,
      extra = undefined,
      pagination = undefined
    if (threadUtils.hasExtraData(output)) {
      rows = output.data
      info = output.info
      extra = output.extra
      pagination = output.pagination
    }

    // transform as required
    if (transformer) {
      const runner = new ScriptRunner(transformer, {
        data: rows,
        params: parameters,
      })
      rows = runner.execute()
    }

    // if the request fails we retry once, invalidating the cached value
    if (
      info &&
      info.code >= 400 &&
      this.cachedVariables.length > 0 &&
      !this.hasRerun
    ) {
      this.hasRerun = true
      // invalidate the cache value
      await threadUtils.invalidateDynamicVariables(this.cachedVariables)
      return this.execute()
    }

    // check for undefined response
    if (!rows) {
      rows = []
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

    return { rows, keys, info, extra, pagination }
  }

  async runAnotherQuery(queryId, parameters) {
    const db = getAppDB()
    const query = await db.get(queryId)
    const datasource = await db.get(query.datasourceId)
    return new QueryRunner(
      {
        datasource,
        queryVerb: query.queryVerb,
        fields: query.fields,
        parameters,
        transformer: query.transformer,
      },
      { noRecursiveQuery: true }
    ).execute()
  }

  async getDynamicVariable(variable) {
    let { parameters } = this
    const queryId = variable.queryId,
      name = variable.name
    let value = await threadUtils.checkCacheForDynamicVariable(queryId, name)
    if (!value) {
      value = this.queryResponse[queryId]
        ? this.queryResponse[queryId]
        : await this.runAnotherQuery(queryId, parameters)
      // store incase this query is to be called again
      this.queryResponse[queryId] = value
      await threadUtils.storeDynamicVariable(queryId, name, value)
    } else {
      this.cachedVariables.push({ queryId, name })
    }
    return value
  }

  async addDatasourceVariables() {
    let { datasource, parameters, fields } = this
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
    if (!this.noRecursiveQuery) {
      // need to see if this uses any variables
      const stringFields = JSON.stringify(fields)
      const foundVars = dynamicVars.filter(variable => {
        // don't allow a query to use its own dynamic variable (loop)
        if (variable.queryId === this.queryId) {
          return false
        }
        // look for {{ variable }} but allow spaces between handlebars
        const regex = new RegExp(`{{[ ]*${variable.name}[ ]*}}`)
        return regex.test(stringFields)
      })
      const dynamics = foundVars.map(dynVar => this.getDynamicVariable(dynVar))
      const responses = await Promise.all(dynamics)
      for (let i = 0; i < foundVars.length; i++) {
        const variable = foundVars[i]
        parameters[variable.name] = processStringSync(
          variable.value,
          {
            data: responses[i].rows,
            info: responses[i].extra,
          },
          {
            escapeNewlines: true,
          }
        )
        // make sure its known that this uses dynamic variables in case it fails
        this.hasDynamicVariables = true
      }
    }
    return parameters
  }

  enrichQueryFields(fields, parameters = {}) {
    const enrichedQuery = Array.isArray(fields) ? [] : {}

    // enrich the fields with dynamic parameters
    for (let key of Object.keys(fields)) {
      if (fields[key] == null) {
        continue
      }
      if (typeof fields[key] === "object") {
        // enrich nested fields object
        enrichedQuery[key] = this.enrichQueryFields(fields[key], parameters)
      } else if (typeof fields[key] === "string") {
        // enrich string value as normal
        enrichedQuery[key] = processStringSync(fields[key], parameters, {
          noEscaping: true,
          noHelpers: true,
          escapeNewlines: true,
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
}

module.exports = (input, callback) => {
  doInAppContext(input.appId, () => {
    const Runner = new QueryRunner(input)
    Runner.execute()
      .then(response => {
        callback(null, response)
      })
      .catch(err => {
        callback(err)
      })
  })
}
