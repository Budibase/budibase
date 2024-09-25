import Joi from "joi"
import { Ctx } from "@budibase/types"

function validate(
  schema: Joi.ObjectSchema | Joi.ArraySchema,
  property: string,
  opts?: { errorPrefix?: string; allowUnknown?: boolean }
) {
  const errorPrefix = opts?.errorPrefix ?? `Invalid ${property}`
  // Return a Koa middleware function
  return (ctx: Ctx, next: any) => {
    if (!schema) {
      return next()
    }
    let params = null
    // @ts-ignore
    let reqProp = ctx.request?.[property]
    if (ctx[property] != null) {
      params = ctx[property]
    } else if (reqProp != null) {
      params = reqProp
    }

    // not all schemas have the append property e.g. array schemas
    if ((schema as Joi.ObjectSchema).append) {
      schema = (schema as Joi.ObjectSchema).append({
        createdAt: Joi.any().optional(),
        updatedAt: Joi.any().optional(),
      })
    }

    const { error } = schema.validate(params, {
      allowUnknown: opts?.allowUnknown,
    })
    if (error) {
      let message = error.message
      if (errorPrefix) {
        message = `Invalid ${property} - ${message}`
      }
      ctx.throw(400, message)
    }
    return next()
  }
}

export function body(
  schema: Joi.ObjectSchema | Joi.ArraySchema,
  opts?: { errorPrefix?: string; allowUnknown?: boolean }
) {
  return validate(schema, "body", opts)
}

export function params(
  schema: Joi.ObjectSchema | Joi.ArraySchema,
  opts?: { errorPrefix: string }
) {
  return validate(schema, "params", opts)
}
