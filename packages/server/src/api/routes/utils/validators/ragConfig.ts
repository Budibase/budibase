import { auth } from "@budibase/backend-core"
import Joi from "joi"

export function createRagConfigValidator() {
  return auth.joiValidator.body(
    Joi.object({
      name: Joi.string().required(),
      embeddingModel: Joi.string().required(),
      vectorDb: Joi.string().required(),
      ragMinDistance: Joi.number().min(0).max(1).required(),
      ragTopK: Joi.number().integer().min(1).max(10).required(),
    })
  )
}

export function updateRagConfigValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: Joi.string().required(),
      _rev: Joi.string().required(),
      name: Joi.string().required(),
      embeddingModel: Joi.string().required(),
      vectorDb: Joi.string().required(),
      ragMinDistance: Joi.number().min(0).max(1).required(),
      ragTopK: Joi.number().integer().min(1).max(10).required(),
    })
  )
}
