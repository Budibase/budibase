import { findHBSBlocks, processStringSync } from "@budibase/string-templates"
import { DatasourcePlus } from "@budibase/types"

const CONST_CHAR_REGEX = new RegExp("'[^']*'", "g")

export function enrichQueryFields(
  fields: { [key: string]: any },
  parameters = {}
) {
  const enrichedQuery: { [key: string]: any } = Array.isArray(fields) ? [] : {}
  if (!fields || !parameters) {
    return enrichedQuery
  }
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

export function interpolateSQL(
  fields: { [key: string]: any },
  parameters: { [key: string]: any },
  integration: DatasourcePlus
) {
  let sql = fields.sql
  if (!sql || typeof sql !== "string") {
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
    const charConstBindingMatch = charConstMatch.find((string: any) =>
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
      const value = enrichQueryFields([binding], parameters)[0]
        .split(",")
        .map((val: string) => val.trim())
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
  fields.bindings = enrichQueryFields(variables, parameters)
  // check for arrays in the data
  let updated: string[] = []
  for (let i = 0; i < variables.length; i++) {
    if (arrays.includes(variables[i])) {
      updated = updated.concat(
        fields.bindings[i].split(",").map((val: string) => val.trim())
      )
    } else {
      updated.push(fields.bindings[i])
    }
  }
  fields.bindings = updated
  return fields
}
