import { features } from "@budibase/backend-core"
import { Ctx, FeatureFlag } from "@budibase/types"
import { tracer } from "dd-trace"

import { AnyZodObject } from "zod"
import { fromZodError } from "zod-validation-error"

function validate(schema: AnyZodObject, property: "body" | "params") {
  // Return a Koa middleware function
  return async (ctx: Ctx, next: any) => {
    if (!(await features.isEnabled(FeatureFlag.USE_ZOD_VALIDATOR))) {
      return next()
    }

    if (!schema) {
      return next()
    }

    return tracer.trace("zod.validate", span => {
      span.addTags({ property })

      let params = null
      let setClean: ((data: any) => void) | undefined
      if (ctx[property] != null) {
        params = ctx[property]
        setClean = data => (ctx[property] = data)
      } else if (property === "body" && ctx.request[property] != null) {
        params = ctx.request[property]
        setClean = data => (ctx.request[property] = data)
      } else if (property === "params") {
        params = ctx.request.query
        setClean = data => (ctx.request.query = data)
      }

      const result = schema.safeParse(params)
      if (!result.success) {
        span.addTags({
          error: true,
          errorMessage: result.error.message,
        })
        ctx.throw(400, fromZodError(result.error))
      } else {
        span.addTags({ success: true })
        setClean?.(result.data)
      }

      return next()
    })
  }
}

export function validateBody(schema: AnyZodObject) {
  return tracer.trace("zod.validateBody", () => {
    return validate(schema, "body")
  })
}
