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
  const query = (capabilityId, parameters) =>
    queryReference.apply(undefined, [capabilityId, parameters], {
      arguments: { copy: true },
      result: { promise: true, copy: true },
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
  Reflect.deleteProperty(globalThis, "__budibaseInputsValue")
  Reflect.deleteProperty(globalThis, "__budibaseInvokeQueryReference")
})()
