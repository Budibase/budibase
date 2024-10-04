import { Ctx } from "@budibase/types"

import { AnyZodObject } from "zod"
import { fromZodError } from "zod-validation-error"

function validate(schema: AnyZodObject, property: "body" | "params") {
  // Return a Koa middleware function
  return (ctx: Ctx, next: any) => {
    if (!schema) {
      return next()
    }
    let params = null
    if (ctx[property] != null) {
      params = ctx[property]
    } else if (property === "body" && ctx.request[property] != null) {
      params = ctx.request[property]
    } else if (ctx.request.get(property) != null) {
      params = ctx.request.get(property)
    }

    const { error } = schema.safeParse(params)
    if (error) {
      ctx.throw(400, fromZodError(error))
    }
    return next()
  }
}

export function validateBody(schema: AnyZodObject) {
  return validate(schema, "body")
}

// export function validateParams(schema: Joi.Schema) {
//   return validate(schema, "params")
// }
