import { HeaderInit, Headers } from "node-fetch"
import { Header } from "../../constants"

const correlator = require("correlation-id")

export const setHeader = (headers: HeaderInit) => {
  const correlationId = correlator.getId()
  if (!correlationId) {
    return
  }

  if (headers instanceof Headers) {
    headers.set(Header.CORRELATION_ID, correlationId)
  } else if (Array.isArray(headers)) {
    headers.push([Header.CORRELATION_ID, correlationId])
  } else {
    headers[Header.CORRELATION_ID] = correlationId
  }
}

export function getId() {
  return correlator.getId()
}
