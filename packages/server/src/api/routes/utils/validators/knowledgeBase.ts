import { auth } from "@budibase/backend-core"
import Joi from "joi"

const REQUIRED_STRING = Joi.string().required()

export function createKnowledgeBaseValidator() {
  return auth.joiValidator.body(
    Joi.object({
      name: REQUIRED_STRING,
      embeddingModel: REQUIRED_STRING,
      vectorDb: REQUIRED_STRING,
    })
  )
}

export function updateKnowledgeBaseValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: REQUIRED_STRING,
      _rev: REQUIRED_STRING,
      name: REQUIRED_STRING,
      embeddingModel: REQUIRED_STRING,
      vectorDb: REQUIRED_STRING,
    }).unknown(true)
  )
}
