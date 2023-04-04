import { Header } from "../../constants"
const correlator = require("correlation-id")

export const setHeader = (headers: any) => {
  const correlationId = correlator.getId()
  if (correlationId) {
    headers[Header.CORRELATION_ID] = correlationId
  }
}

export function getId() {
  return correlator.getId()
}
