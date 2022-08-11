const env = require("./environment")
import { Options } from "pino-http"
const correlator = require("correlation-id")

export const pinoSettings = (): Options => ({
  prettyPrint: {
    levelFirst: true,
  },
  genReqId: correlator.getId,
  level: env.LOG_LEVEL || "error",
  autoLogging: {
    ignore: (req: any) => req.url.includes("/health"),
  },
})
