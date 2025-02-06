import Joi from "joi"
import { Ctx } from "@budibase/types"

function validate(schema: Joi.Schema, property: string) {
  // Return a Koa middleware function
  return (ctx: Ctx, next: any) => {
    if (!schema) {
      return next()
    }
    let params = null
    if (ctx[property] != null) {
      params = ctx[property]
    } else if (ctx.request.get(property) != null) {
      params = ctx.request.get(property)
    }

    // not all schemas have the append property e.g. array schemas
    if ("append" in schema && schema.append) {
      schema = schema.append({
        createdAt: Joi.any().optional(),
        updatedAt: Joi.any().optional(),
      })
    }

    const { error } = schema.validate(params)
    if (error) {
      ctx.throw(400, `Invalid ${property} - ${error.message}`)
      return
    }
    return next()
  }
}

export function body(schema: Joi.Schema) {
  return validate(schema, "body")
}

export function params(schema: Joi.Schema) {
  return validate(schema, "params")
}
