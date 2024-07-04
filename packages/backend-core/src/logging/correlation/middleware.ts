import { v4 as uuid } from "uuid"
import { Header } from "../../constants"

const correlator = require("correlation-id")

const correlation = (ctx: any, next: any) => {
  // use the provided correlation id header if present
  let correlationId = ctx.headers[Header.CORRELATION_ID]
  if (!correlationId) {
    correlationId = uuid()
  }

  return correlator.withId(correlationId, () => {
    return next()
  })
}

export default correlation
