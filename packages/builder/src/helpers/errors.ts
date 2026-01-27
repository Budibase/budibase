export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message !== "[object Object]") {
    return error.message
  }

  if (error && typeof error === "object") {
    const errObject = error as {
      message?: unknown
      code?: unknown
      error?: unknown
    }
    const messageValue = errObject.message

    if (typeof messageValue === "string" && messageValue !== "[object Object]") {
      return messageValue
    }

    if (messageValue && typeof messageValue === "object") {
      const nestedMessage = messageValue as {
        message?: unknown
        code?: unknown
        error?: unknown
      }
      const nestedText =
        (typeof nestedMessage.message === "string" && nestedMessage.message) ||
        (typeof nestedMessage.code === "string" && nestedMessage.code) ||
        (typeof nestedMessage.error === "string" && nestedMessage.error)

      return nestedText || JSON.stringify(messageValue)
    }

    const fallbackText =
      (typeof errObject.code === "string" && errObject.code) ||
      (typeof errObject.error === "string" && errObject.error)

    if (fallbackText) {
      return fallbackText
    }
  }

  if (typeof error === "string") {
    return error
  }

  try {
    return JSON.stringify(error)
  } catch (stringifyError) {
    return String(error)
  }
}
