import { auth } from "@budibase/backend-core"
import { KnowledgeBaseType } from "@budibase/types"
import Joi from "joi"

const REQUIRED_STRING = Joi.string().required()

const localKnowledgeBaseFields = {
  name: REQUIRED_STRING,
  type: Joi.string().valid(KnowledgeBaseType.LOCAL).required(),
  embeddingModel: REQUIRED_STRING,
  vectorDb: REQUIRED_STRING,
  connectionId: Joi.forbidden(),
  scope: Joi.forbidden(),
  managedRetrievalIndexId: Joi.forbidden(),
}

const connectorKnowledgeBaseFields = {
  name: REQUIRED_STRING,
  type: Joi.string()
    .valid(
      KnowledgeBaseType.SHAREPOINT,
      KnowledgeBaseType.GOOGLE_DRIVE,
      KnowledgeBaseType.CONFLUENCE
    )
    .required(),
  connectionId: REQUIRED_STRING,
  scope: Joi.object().optional(),
  managedRetrievalIndexId: Joi.string().allow("").optional(),
  embeddingModel: Joi.forbidden(),
  vectorDb: Joi.forbidden(),
}

const createKnowledgeBaseSchema = Joi.object({
  name: REQUIRED_STRING,
  type: Joi.string()
    .valid(...Object.values(KnowledgeBaseType))
    .required(),
  embeddingModel: Joi.string().optional(),
  vectorDb: Joi.string().optional(),
  connectionId: Joi.string().optional(),
  scope: Joi.object().optional(),
  managedRetrievalIndexId: Joi.string().allow("").optional(),
}).when(Joi.object({ type: KnowledgeBaseType.LOCAL }).unknown(), {
  then: Joi.object(localKnowledgeBaseFields),
  otherwise: Joi.object(connectorKnowledgeBaseFields),
})

const updateKnowledgeBaseSchema = Joi.object({
  _id: REQUIRED_STRING,
  _rev: REQUIRED_STRING,
  name: REQUIRED_STRING,
  type: Joi.string()
    .valid(...Object.values(KnowledgeBaseType))
    .required(),
  embeddingModel: Joi.string().optional(),
  vectorDb: Joi.string().optional(),
  connectionId: Joi.string().optional(),
  scope: Joi.object().optional(),
  managedRetrievalIndexId: Joi.string().allow("").optional(),
})
  .when(Joi.object({ type: KnowledgeBaseType.LOCAL }).unknown(), {
    then: Joi.object({
      _id: REQUIRED_STRING,
      _rev: REQUIRED_STRING,
      ...localKnowledgeBaseFields,
    }).unknown(true),
    otherwise: Joi.object({
      _id: REQUIRED_STRING,
      _rev: REQUIRED_STRING,
      ...connectorKnowledgeBaseFields,
    }).unknown(true),
  })
  .unknown(true)

export function createKnowledgeBaseValidator() {
  return auth.joiValidator.body(createKnowledgeBaseSchema)
}

export function updateKnowledgeBaseValidator() {
  return auth.joiValidator.body(updateKnowledgeBaseSchema)
}
