const sendResponse = process.send.bind(process)

let IntegrationConstructor
let integration
let typeCastingDefined = false
let requestQueue = Promise.resolve()

const loadIntegration = filename => {
  if (IntegrationConstructor) {
    return IntegrationConstructor
  }

  const plugin = require(filename)
  IntegrationConstructor = plugin.integration || plugin
  if (typeof IntegrationConstructor !== "function") {
    throw new Error("Datasource plugin does not export an integration class")
  }
  return IntegrationConstructor
}

const discoverMethods = instance => {
  const methods = new Set()
  const seen = new Set()
  let current = instance
  while (current && current !== Object.prototype) {
    for (const [name, descriptor] of Object.entries(
      Object.getOwnPropertyDescriptors(current)
    )) {
      if (seen.has(name)) {
        continue
      }
      seen.add(name)
      if (name !== "constructor" && typeof descriptor.value === "function") {
        methods.add(name)
      }
    }
    current = Object.getPrototypeOf(current)
  }
  return [...methods]
}

const createIntegration = async request => {
  integration ||= new IntegrationConstructor(request.config)
  if (
    !typeCastingDefined &&
    request.typeCastingSchema &&
    typeof integration.defineTypeCastingFromSchema === "function"
  ) {
    await integration.defineTypeCastingFromSchema(request.typeCastingSchema)
    typeCastingDefined = true
  }
  return integration
}

// Keep native IPC values, but honor custom JSON representations before their
// prototypes are lost during structured serialization.
const serializeResult = ({ value, seen = new Map() }) => {
  if (value === null || typeof value !== "object") {
    return value
  }
  if (seen.has(value)) {
    return seen.get(value)
  }
  if (
    value instanceof Date ||
    value instanceof RegExp ||
    value instanceof Error ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value)
  ) {
    return value
  }
  if (typeof value.toJSON === "function") {
    const json = value.toJSON()
    if (json !== value) {
      const result = serializeResult({ value: json, seen })
      seen.set(value, result)
      return result
    }
  }
  if (value instanceof Map) {
    const result = new Map()
    seen.set(value, result)
    for (const [key, entry] of value) {
      result.set(
        serializeResult({ value: key, seen }),
        serializeResult({ value: entry, seen })
      )
    }
    return result
  }
  if (value instanceof Set) {
    const result = new Set()
    seen.set(value, result)
    for (const entry of value) {
      result.add(serializeResult({ value: entry, seen }))
    }
    return result
  }
  const result = Array.isArray(value) ? new Array(value.length) : {}
  seen.set(value, result)
  for (const key of Object.keys(value)) {
    Object.defineProperty(result, key, {
      value: serializeResult({ value: value[key], seen }),
      enumerable: true,
      configurable: true,
      writable: true,
    })
  }
  return result
}

const handleRequest = async request => {
  try {
    loadIntegration(request.filename)

    if (request.operation === "validate") {
      sendResponse({ requestId: request.requestId, result: true })
      return
    }

    const integration = await createIntegration(request)
    if (request.operation === "describe") {
      sendResponse({
        requestId: request.requestId,
        result: { methods: discoverMethods(integration) },
      })
      return
    }

    const method = integration[request.method]
    if (typeof method !== "function") {
      throw new Error("Datasource plugin method is not available")
    }

    const result = await method.apply(integration, request.args || [])
    sendResponse({
      requestId: request.requestId,
      result: serializeResult({ value: result }),
    })
  } catch (error) {
    sendResponse({
      requestId: request.requestId,
      error: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    })
  }
}

process.on("message", request => {
  // A plugin instance can be stateful, so requests must run in arrival order.
  requestQueue = requestQueue.then(() => handleRequest(request))
})
