import { get } from "lodash"
import { findHBSBlocks } from "@budibase/string-templates"
import { SourceName, type SqlDatasource } from "@budibase/types"
import sdk from "../../sdk"

const MYSQL_CONST_CHAR_REGEX = new RegExp(`"[^"]*"|'[^']*'`, "g")
const CONST_CHAR_REGEX = new RegExp(`'[^']*'`, "g")

function getConstCharRegex(sourceName: SourceName) {
  // MySQL clients support ANSI_QUOTES mode off, this is by default
  // but " and ' count as string literals
  if (sourceName === SourceName.MYSQL) {
    return MYSQL_CONST_CHAR_REGEX
  } else {
    return CONST_CHAR_REGEX
  }
}

function getBindingWithinConstCharRegex(
  sourceName: SourceName,
  binding: string
) {
  if (sourceName === SourceName.MYSQL) {
    return new RegExp(`[^']*${binding}[^']*'|"[^"]*${binding}[^"]*"`, "g")
  } else {
    return new RegExp(`'[^']*${binding}[^']*'`)
  }
}

export async function interpolateSQL(
  sourceName: SourceName,
  fields: { sql: string; bindings: any[] },
  parameters: { [key: string]: any },
  integration: SqlDatasource,
  opts: { nullDefaultSupport: boolean }
) {
  let sql = fields.sql
  if (!sql || typeof sql !== "string") {
    return fields
  }
  const bindings = findHBSBlocks(sql)
  const enrichedBindings = await sdk.queries.enrichArrayContext(
    bindings,
    parameters,
    { escapeNewlines: false }
  )
  const resolvedBindings: (string | null)[] = enrichedBindings.map(
    (value, index) => {
      const path = bindings[index].replace(/[{}]/g, "").trim()
      if (
        get(parameters, path) === null ||
        (opts.nullDefaultSupport && value === "")
      ) {
        return null
      }
      return value
    }
  )
  const queryBindings: (string | null)[] = []
  for (const [index, binding] of bindings.entries()) {
    const value = resolvedBindings[index]
    let bindingValues = [value]
    // Look for list bindings such as IN ({{ ids }}).
    const listRegexMatch = sql.match(
      new RegExp(`(in|IN|In|iN)( )+[(]?${binding}[)]?`)
    )
    // check if the variable was used as part of a string concat e.g. 'Hello {{binding}}'
    // start by finding all the instances of const character strings
    const charConstMatch = sql.match(getConstCharRegex(sourceName)) || []
    // now look within them to see if a binding is used
    const charConstBindingMatch = charConstMatch.find((string: any) =>
      string.match(getBindingWithinConstCharRegex(sourceName, binding))
    )
    if (charConstBindingMatch) {
      let [part1, part2] = charConstBindingMatch.split(binding)
      part1 = `'${part1.substring(1)}'`
      part2 = `'${part2.substring(0, part2.length - 1)}'`
      sql = sql.replace(
        charConstBindingMatch,
        await integration.getStringConcat([
          part1,
          await integration.getBindingIdentifier(),
          part2,
        ])
      )
    }
    // generate SQL parameterised array
    else if (listRegexMatch) {
      bindingValues =
        value === null ? [null] : value.split(",").map(item => item.trim())
      let replacement = (
        await Promise.all(
          bindingValues.map(() => integration.getBindingIdentifier())
        )
      ).join(",")
      // check if parentheses are needed
      if (!listRegexMatch[0].includes(`(${binding})`)) {
        replacement = `(${replacement})`
      }
      sql = sql.replace(binding, replacement)
    } else {
      sql = sql.replace(binding, await integration.getBindingIdentifier())
    }
    queryBindings.push(...bindingValues)
  }
  fields.sql = sql
  fields.bindings = queryBindings
  return fields
}
