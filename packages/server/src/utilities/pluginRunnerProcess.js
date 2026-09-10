const sendResponse = process.send.bind(process)

let IntegrationConstructor
let integration
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

const discoverMethods = IntegrationConstructor => {
  const methods = new Set()
  let prototype = IntegrationConstructor.prototype
  while (prototype && prototype !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(prototype)) {
      if (name !== "constructor" && typeof prototype[name] === "function") {
        methods.add(name)
      }
    }
    prototype = Object.getPrototypeOf(prototype)
  }
  return [...methods]
}

const createIntegration = async request => {
  if (integration) {
    return integration
  }

  integration = new IntegrationConstructor(request.config)
  if (
    request.typeCastingSchema &&
    typeof integration.defineTypeCastingFromSchema === "function"
  ) {
    await integration.defineTypeCastingFromSchema(request.typeCastingSchema)
  }
  return integration
}

const handleRequest = async request => {
  try {
    const IntegrationConstructor = loadIntegration(request.filename)

    if (request.operation === "describe") {
      sendResponse({
        requestId: request.requestId,
        result: { methods: discoverMethods(IntegrationConstructor) },
      })
      return
    }

    const integration = await createIntegration(request)
    const method = integration[request.method]
    if (typeof method !== "function") {
      throw new Error("Datasource plugin method is not available")
    }

    const result = await method.apply(integration, request.args || [])
    sendResponse({ requestId: request.requestId, result })
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
