import { auth } from "@budibase/backend-core"
import { KnowledgeBaseType } from "@budibase/types"
import Joi from "joi"

const REQUIRED_STRING = Joi.string().required()
const KB_TYPE = Joi.string().valid(...Object.values(KnowledgeBaseType))
const SHAREPOINT_SOURCE = Joi.object({
  datasourceId: REQUIRED_STRING,
  siteId: REQUIRED_STRING,
  siteName: Joi.string().allow("", null).optional(),
})
const SHAREPOINT_SOURCES = Joi.array().items(SHAREPOINT_SOURCE).optional()

export function createKnowledgeBaseValidator() {
  return auth.joiValidator.body(
    Joi.object({
      name: REQUIRED_STRING,
      type: KB_TYPE.required(),
      sharepointSources: SHAREPOINT_SOURCES,
    })
  )
}

export function updateKnowledgeBaseValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: REQUIRED_STRING,
      _rev: REQUIRED_STRING,
      name: REQUIRED_STRING,
      type: KB_TYPE.required(),
      sharepointSources: SHAREPOINT_SOURCES,
    }).unknown(true)
  )
}
