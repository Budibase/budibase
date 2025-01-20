function isJest() {
  return (
    process.env.NODE_ENV === "jest" ||
    (process.env.JEST_WORKER_ID != null &&
      process.env.JEST_WORKER_ID !== "null")
  )
}

export function isTest() {
  return isJest()
}

export const isJSAllowed = () => {
  return process && !process.env.NO_JS
}

export const isTestingBackendJS = () => {
  return process && process.env.BACKEND_JS
}

export const setTestingBackendJS = () => {
  process.env.BACKEND_JS = "1"
}
