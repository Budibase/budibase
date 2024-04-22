export const messages = {
  jsonPrimitivesOnly: Symbol("explanation-json-primitives-only"),
  stringAsNumber: Symbol("explanation-string-as-number"),
  dateAsNumber: Symbol("explanation-date-as-number"),
  numberAsDate: Symbol("explanation-number-as-date"),
  stringAsDate: Symbol("explanation-string-as-date"),
  notRequired: Symbol("explanation-not-required"),
  contextError: Symbol("explanation-context-error"),
}

export const support = {
  unsupported: Symbol("explanation-unsupported"),
  partialSupport: Symbol("explanation-partialSupport"),
  supported: Symbol("explanation-supported"),
}

const getSupport = (type, explanation) => {
  if (!explanation?.typeSupport) {
    return support.supported
  }

  if (
    explanation?.typeSupport?.supported?.find(
      mapping => mapping === type || mapping?.type === type
    )
  ) {
    return support.supported
  }

  if (
    explanation?.typeSupport?.partialSupport?.find(
      mapping => mapping === type || mapping?.type === type
    )
  ) {
    return support.partialSupport
  }

  return support.unsupported
}

const getSupportMessage = (type, explanation) => {
  if (!explanation?.typeSupport) {
    return null
  }

  const supported = explanation?.typeSupport?.supported?.find(
    mapping => mapping?.type === type
  )
  if (supported) {
    return messages[supported?.message]
  }

  const partialSupport = explanation?.typeSupport?.partialSupport?.find(
    mapping => mapping?.type === type
  )
  if (partialSupport) {
    return messages[partialSupport?.message]
  }

  const unsupported = explanation?.typeSupport?.unsupported?.find(
    mapping => mapping?.type === type
  )
  if (unsupported) {
    return messages[unsupported?.message]
  }

  return null
}

export const getExplanationMessagesAndSupport = (fieldSchema, explanation) => {
  try {
    const explanationMessagesAndSupport = {
      support: getSupport(fieldSchema.type, explanation),
      messages: [getSupportMessage(fieldSchema.type, explanation)],
    }

    const isRequired = fieldSchema?.constraints?.presence?.allowEmpty === false
    if (!isRequired) {
      explanationMessagesAndSupport.messages.push(messages.notRequired)
    }

    return explanationMessagesAndSupport
  } catch (e) {
    return {
      support: support.partialSupport,
      messages: [messages.contextError],
    }
  }
}

export const getExplanationWithPresets = (explanation, presets) => {
  if (explanation?.typeSupport?.preset) {
    return {
      ...explanation,
      typeSupport: presets[explanation?.typeSupport?.preset],
    }
  }

  return explanation
}
