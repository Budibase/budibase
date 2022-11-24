import Joi, { ObjectSchema } from "joi"
import { BBContext } from "@budibase/types"

function validate(schema: Joi.ObjectSchema, property: string) {
  // Return a Koa middleware function
  return (ctx: BBContext, next: any) => {
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
    if (schema.append) {
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

export function body(schema: Joi.ObjectSchema) {
  return validate(schema, "body")
}

export function params(schema: Joi.ObjectSchema) {
  return validate(schema, "params")
}
