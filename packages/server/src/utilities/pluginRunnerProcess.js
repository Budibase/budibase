const crypto = require("crypto")

const sendMessage = process.send.bind(process)

let plugin
let IntegrationConstructor
let integration
let typeCastingDefined = false
let requestQueue = Promise.resolve()
const pendingHostCalls = new Map()

const loadPlugin = filename => {
  plugin ||= require(filename)
  return plugin
}

const loadIntegration = filename => {
  if (IntegrationConstructor) {
    return IntegrationConstructor
  }

  const plugin = loadPlugin(filename)
  IntegrationConstructor = plugin.integration || plugin
  if (typeof IntegrationConstructor !== "function") {
    throw new Error("Datasource plugin does not export an integration class")
  }
  return IntegrationConstructor
}

const loadAutomationAction = filename => {
  const action = loadPlugin(filename).action
  if (typeof action !== "function") {
    throw new Error("Automation plugin does not export an action function")
  }
  return action
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

const invokeHost = (method, args) => {
  const callId = crypto.randomUUID()
  const call = new Promise((resolve, reject) => {
    pendingHostCalls.set(callId, { resolve, reject })
    sendMessage({ type: "hostCall", callId, method, args })
  })
  call.catch(() => {})
  return call
}

const invokeAutomation = async request => {
  const action = loadAutomationAction(request.filename)
  const emitterCalls = []
  const emitter = {
    emitRow: (...args) => {
      const call = invokeHost("emitRow", args)
      emitterCalls.push(call)
      return call
    },
    emitTable: (...args) => {
      const call = invokeHost("emitTable", args)
      emitterCalls.push(call)
      return call
    },
  }
  const result = await action({ ...request.params, emitter })
  await Promise.all(emitterCalls)
  return result
}

const handleRequest = async request => {
  try {
    let result
    switch (request.operation) {
      case "validateDatasource":
        loadIntegration(request.filename)
        result = true
        break
      case "describeDatasource": {
        loadIntegration(request.filename)
        const integration = await createIntegration(request)
        result = { methods: discoverMethods(integration) }
        break
      }
      case "invokeDatasource": {
        loadIntegration(request.filename)
        const integration = await createIntegration(request)
        const method = integration[request.method]
        if (typeof method !== "function") {
          throw new Error("Datasource plugin method is not available")
        }
        result = await method.apply(integration, request.args || [])
        break
      }
      case "describeAutomation":
        loadAutomationAction(request.filename)
        result = true
        break
      case "invokeAutomation":
        result = await invokeAutomation(request)
        break
      default:
        throw new Error("Plugin operation is not available")
    }
    sendMessage({
      type: "response",
      requestId: request.requestId,
      result: serializeResult({ value: result }),
    })
  } catch (error) {
    sendMessage({
      type: "response",
      requestId: request.requestId,
      error: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    })
  }
}

const handleHostResponse = response => {
  const pending = pendingHostCalls.get(response.callId)
  if (!pending) {
    return
  }
  pendingHostCalls.delete(response.callId)
  if (response.error) {
    pending.reject(new Error(response.error.message))
  } else {
    pending.resolve(response.result)
  }
}

process.on("message", message => {
  if (message.type === "hostResponse") {
    handleHostResponse(message)
    return
  }

  // A datasource integration can be stateful, so requests run in arrival order.
  requestQueue = requestQueue.then(() => handleRequest(message))
})
