const envTimeout = process.env.JEST_TIMEOUT
const timeout = envTimeout && parseInt(envTimeout)
jest.setTimeout(timeout || 60000)
