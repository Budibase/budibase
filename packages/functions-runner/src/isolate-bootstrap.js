;(() => {
  const deepFreeze = value => {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.freeze(value)
      for (const key of Object.keys(value)) {
        deepFreeze(value[key])
      }
    }
    return value
  }

  const inputsValue = Reflect.get(globalThis, "__budibaseInputsValue")
  const queryReference = Reflect.get(
    globalThis,
    "__budibaseInvokeQueryReference"
  )
  const query = async (capabilityId, parameters) => {
    const response = await queryReference.apply(
      undefined,
      [capabilityId, parameters],
      {
        arguments: { copy: true },
        result: { promise: true, copy: true },
      }
    )
    if (response.error) {
      throw new Error(response.error)
    }
    return response.result
  }
  const noop = Object.freeze(() => {})
  const consoleValue = Object.freeze({
    debug: noop,
    info: noop,
    log: noop,
    warn: noop,
    error: noop,
  })

  Object.defineProperty(globalThis, "__budibaseInputs", {
    value: deepFreeze(inputsValue),
    writable: false,
    configurable: false,
  })
  Object.defineProperty(globalThis, "__budibaseInvokeQuery", {
    value: Object.freeze(query),
    writable: false,
    configurable: false,
  })
  Object.defineProperty(globalThis, "console", {
    value: consoleValue,
    writable: false,
    configurable: false,
  })
  Reflect.deleteProperty(globalThis, "__budibaseInputsValue")
  Reflect.deleteProperty(globalThis, "__budibaseInvokeQueryReference")
})()
