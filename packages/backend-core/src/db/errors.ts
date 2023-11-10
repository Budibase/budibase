export function checkErrorCode(error: any, code: number) {
  const stringCode = code.toString()
  if (typeof error === "object") {
    return error.status === code || error.message?.includes(stringCode)
  } else if (typeof error === "number") {
    return error === code
  } else if (typeof error === "string") {
    return error.includes(stringCode)
  }
}

export function isDocumentConflictError(error: any) {
  return checkErrorCode(error, 409)
}
