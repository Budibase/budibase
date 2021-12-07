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
