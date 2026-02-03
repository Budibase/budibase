import { auth } from "@budibase/backend-core"
import { VectorDbProvider } from "@budibase/types"
import Joi from "joi"

const OPTIONAL_STRING = Joi.string().optional().allow(null).allow("")

const PROVIDER = Joi.string()
  .valid(...Object.values(VectorDbProvider))
  .required()

const HOST = Joi.string().required()
const PORT = Joi.number().integer().required()
const DATABASE = Joi.string().required()

export function createVectorDbValidator() {
  return auth.joiValidator.body(
    Joi.object({
      name: Joi.string().required(),
      provider: PROVIDER,
      host: HOST,
      port: PORT,
      database: DATABASE,
      user: OPTIONAL_STRING,
      password: OPTIONAL_STRING,
    })
  )
}

export function updateVectorDbValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: Joi.string().required(),
      _rev: Joi.string().required(),
      name: Joi.string().required(),
      provider: PROVIDER,
      host: HOST,
      port: PORT,
      database: DATABASE,
      user: OPTIONAL_STRING,
      password: OPTIONAL_STRING,
    }).unknown(true)
  )
}
