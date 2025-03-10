import env from "../../environment"
import { logger } from "./logger"
import type { IncomingMessage } from "http"

const pino = require("koa-pino-logger")

import type { Options } from "pino-http"
import type { Ctx } from "@budibase/types"

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
    return (ctx: Ctx, next: any) => {
      return next()
    }
  }
}

const pinoMiddleware = getMiddleware()

export default pinoMiddleware
