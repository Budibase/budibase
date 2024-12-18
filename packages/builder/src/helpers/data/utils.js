import { IntegrationTypes } from "@/constants/backend"
import { findHBSBlocks } from "@budibase/string-templates"

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
    const split = param.split("=")
    paramObj[split[0]] = decodeURIComponent(split.slice(1).join("="))
  }
  return paramObj
}

function isEncoded(str) {
  return typeof str == "string" && decodeURIComponent(str) !== str
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
      const bindings = findHBSBlocks(value)
      let count = 0
      const bindingMarkers = {}
      bindings.forEach(binding => {
        const marker = `BINDING...${count++}`
        value = value.replace(binding, marker)
        bindingMarkers[marker] = binding
      })
      let encoded = isEncoded(value) ? value : encodeURIComponent(value || "")
      Object.entries(bindingMarkers).forEach(([marker, binding]) => {
        encoded = encoded.replace(marker, binding)
      })
      str += `${key}=${encoded}`
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
      return "DEL"
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

export function customQueryText(datasource, query) {
  if (!query.name || datasource.source !== IntegrationTypes.REST) {
    return query.name
  }

  // Remove protocol
  let name = query.name
  if (name.includes("//")) {
    name = name.split("//")[1]
  }

  // If no path, return the full name
  if (!name.includes("/")) {
    return name
  }

  // Remove trailing slash
  if (name.endsWith("/")) {
    name = name.slice(0, -1)
  }

  // Only use path
  const split = name.split("/")
  if (split[1]) {
    return `/${split.slice(1).join("/")}`
  } else {
    return split[0]
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

export const parseToCsv = (headers, rows) => {
  let csv = headers?.map(key => `"${key}"`)?.join(",") || ""

  for (let row of rows) {
    csv = `${csv}\n${headers
      .map(header => {
        let val = row[header]
        val =
          typeof val === "object" && !(val instanceof Date)
            ? `"${JSON.stringify(val).replace(/"/g, "'")}"`
            : `"${val}"`
        return val.trim()
      })
      .join(",")}`
  }
  return csv
}

export default {
  breakQueryString,
  buildQueryString,
  flipHeaderState,
  keyValueToQueryParameters,
  parseToCsv,
  queryParametersToKeyValue,
}
