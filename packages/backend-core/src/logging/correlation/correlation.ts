import { Header } from "../../constants"

const correlator = require("correlation-id")

export const setHeader = (headers: Record<string, string>) => {
  const correlationId = correlator.getId()
  if (!correlationId) {
    return
  }
  headers[Header.CORRELATION_ID] = correlationId
}

export function getId() {
  return correlator.getId()
}
