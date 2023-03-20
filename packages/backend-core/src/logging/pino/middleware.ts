import logger from "./logger"
import { IncomingMessage } from "http"
const pino = require("koa-pino-logger")
import { Options } from "pino-http"
const correlator = require("correlation-id")

export function pinoSettings(): Options {
  return {
    logger,
    genReqId: correlator.getId,
    autoLogging: {
      ignore: (req: IncomingMessage) => !!req.url?.includes("/health"),
    },
    serializers: {
      req: req => {
        return {
          method: req.method,
          url: req.url,
        }
      },
      res: res => {
        return {
          status: res.statusCode,
        }
      },
    },
  }
}

const pinoMiddleware = pino(pinoSettings())

export default pinoMiddleware
