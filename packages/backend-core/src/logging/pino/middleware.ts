import { IncomingMessage } from "http"
import env from "../../environment"
import { logger } from "./logger"

const pino = require("koa-pino-logger")

import { Ctx } from "@budibase/types"
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
  if (env.HTTP_LOGGING) {
    return pino(pinoSettings())
  } else {
    return (_ctx: Ctx, next: any) => {
      return next()
    }
  }
}

const pinoMiddleware = getMiddleware()

export default pinoMiddleware
