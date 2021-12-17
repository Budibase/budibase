import { IntegrationTypes } from "constants/backend"

export function schemaToFields(schema) {
  const response = {}
  if (schema && typeof schema === "object") {
    for (let [field, value] of Object.entries(schema)) {
      response[field] = value?.type || "string"
    }
  }
  return response
}

export function fieldsToSchema(fields) {
  const response = {}
  if (fields && typeof fields === "object") {
    for (let [name, type] of Object.entries(fields)) {
      response[name] = { name, type }
    }
  }
  return response
}

export function breakQueryString(qs) {
  if (!qs) {
    return {}
  }
  if (qs.includes("?")) {
    qs = qs.split("?")[1]
  }
  const params = qs.split("&")
  let paramObj = {}
  for (let param of params) {
    const [key, value] = param.split("=")
    paramObj[key] = value
  }
  return paramObj
}

export function buildQueryString(obj) {
  let str = ""
  if (obj) {
    for (let [key, value] of Object.entries(obj)) {
      if (!key || key === "") {
        continue
      }
      if (str !== "") {
        str += "&"
      }
      str += `${key}=${value || ""}`
    }
  }
  return str
}

export function keyValueToQueryParameters(obj) {
  let array = []
  if (obj && typeof obj === "object") {
    for (let [key, value] of Object.entries(obj)) {
      array.push({ name: key, default: value })
    }
  }
  return array
}

export function queryParametersToKeyValue(array) {
  let obj = {}
  if (Array.isArray(array)) {
    for (let param of array) {
      obj[param.name] = param.default
    }
  }
  return obj
}

export function customQueryIconText(datasource, query) {
  if (datasource.source !== IntegrationTypes.REST) {
    return
  }
  switch (query.queryVerb) {
    case "create":
      return "POST"
    case "update":
      return "PUT"
    case "read":
      return "GET"
    case "delete":
      return "DELETE"
    case "patch":
      return "PATCH"
  }
}

export function customQueryIconColor(datasource, query) {
  if (datasource.source !== IntegrationTypes.REST) {
    return
  }
  switch (query.queryVerb) {
    case "create":
      return "#dcc339"
    case "update":
      return "#5197ec"
    case "read":
      return "#53a761"
    case "delete":
      return "#ea7d82"
    case "patch":
    default:
      return
  }
}

export function flipHeaderState(headersActivity) {
  if (!headersActivity) {
    return {}
  }
  const enabled = {}
  Object.entries(headersActivity).forEach(([key, value]) => {
    enabled[key] = !value
  })
  return enabled
}

// convert dynamic variables list to simple key/val object
export function getDynamicVariables(datasource, queryId) {
  const variablesList = datasource?.config?.dynamicVariables
  if (variablesList && variablesList.length > 0) {
    const filtered = queryId
      ? variablesList.filter(variable => variable.queryId === queryId)
      : variablesList
    return filtered.reduce(
      (acc, next) => ({ ...acc, [next.name]: next.value }),
      {}
    )
  }
  return {}
}

// convert dynamic variables object back to a list, enrich with query id
export function rebuildVariables(datasource, queryId, variables) {
  let newVariables = []
  if (variables) {
    newVariables = Object.entries(variables).map(entry => {
      return {
        name: entry[0],
        value: entry[1],
        queryId,
      }
    })
  }
  let existing = datasource?.config?.dynamicVariables || []
  // filter out any by same name
  existing = existing.filter(
    variable =>
      !newVariables.find(
        newVar => newVar.name.toLowerCase() === variable.name.toLowerCase()
      )
  )
  return [...existing, ...newVariables]
}

export function shouldShowVariables(dynamicVariables, variablesReadOnly) {
  return !!(
    dynamicVariables &&
    // show when editable or when read only and not empty
    (!variablesReadOnly || Object.keys(dynamicVariables).length > 0)
  )
}

export function buildAuthConfigs(datasource) {
  if (datasource?.config?.authConfigs) {
    return datasource.config.authConfigs.map(c => ({
      label: c.name,
      value: c._id,
    }))
  }
  return []
}

export default {
  breakQueryString,
  buildQueryString,
  fieldsToSchema,
  flipHeaderState,
  keyValueToQueryParameters,
  queryParametersToKeyValue,
  schemaToFields,
  getDynamicVariables,
  rebuildVariables,
  shouldShowVariables,
  buildAuthConfigs,
}
