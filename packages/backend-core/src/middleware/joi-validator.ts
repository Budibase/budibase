import Joi, { ObjectSchema } from "joi"
import { BBContext } from "@budibase/types"

function validate(
  schema: Joi.ObjectSchema | Joi.ArraySchema,
  property: string
) {
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
    if ((schema as Joi.ObjectSchema).append) {
      schema = (schema as Joi.ObjectSchema).append({
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

export function body(schema: Joi.ObjectSchema | Joi.ArraySchema) {
  return validate(schema, "body")
}

export function params(schema: Joi.ObjectSchema | Joi.ArraySchema) {
  return validate(schema, "params")
}
