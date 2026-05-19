import { IncomingMessage } from "http"
import pinoHttp from "pino-http"
import type { Options } from "pino-http"
import type { Ctx } from "@budibase/types"

import env from "../../environment"
import { logger } from "./logger"

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
    const middleware = pinoHttp(pinoSettings())

    return async (ctx: Ctx, next: any) => {
      middleware(ctx.req, ctx.res)
      ctx.log = ctx.req.log
      return next()
    }
  } else {
    return (ctx: Ctx, next: any) => {
      return next()
    }
  }
}

export const pinoMiddleware = getMiddleware()
