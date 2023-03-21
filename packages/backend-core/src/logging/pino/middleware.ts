import env from "../../environment"
import logger from "./logger"
import { IncomingMessage } from "http"
const pino = require("koa-pino-logger")
import { Options } from "pino-http"
import { Ctx } from "@budibase/types"
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
          correlationId: req.id,
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

function getMiddleware() {
  if (env.DISABLE_HTTP_LOGGING) {
    return (ctx: Ctx, next: any) => { return next() }
  } else {
    return pino(pinoSettings())
  }
}

const pinoMiddleware = getMiddleware()

export default pinoMiddleware
