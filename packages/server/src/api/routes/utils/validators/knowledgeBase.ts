import { auth } from "@budibase/backend-core"
import { ManagedRetrievalProvider, RetrievalBackend } from "@budibase/types"
import Joi from "joi"

const REQUIRED_STRING = Joi.string().required()

const vectorKnowledgeBaseFields = {
  name: REQUIRED_STRING,
  retrievalBackend: Joi.string()
    .valid(RetrievalBackend.BUDIBASE_VECTOR)
    .required(),
  embeddingModel: REQUIRED_STRING,
  vectorDb: REQUIRED_STRING,
  managedRetrievalProvider: Joi.forbidden(),
  managedRetrievalIndexId: Joi.forbidden(),
}

const managedFileSearchKnowledgeBaseFields = {
  name: REQUIRED_STRING,
  retrievalBackend: Joi.string()
    .valid(RetrievalBackend.MANAGED_FILE_SEARCH)
    .required(),
  managedRetrievalProvider: Joi.string()
    .valid(ManagedRetrievalProvider.GOOGLE_FILE_SEARCH)
    .required(),
  managedRetrievalIndexId: Joi.string().allow("").optional(),
  embeddingModel: Joi.forbidden(),
  vectorDb: Joi.forbidden(),
}

const createKnowledgeBaseSchema = Joi.object({
  name: REQUIRED_STRING,
  retrievalBackend: Joi.string()
    .valid(
      RetrievalBackend.BUDIBASE_VECTOR,
      RetrievalBackend.MANAGED_FILE_SEARCH
    )
    .required(),
  embeddingModel: Joi.string().optional(),
  vectorDb: Joi.string().optional(),
  managedRetrievalProvider: Joi.string()
    .valid(ManagedRetrievalProvider.GOOGLE_FILE_SEARCH)
    .optional(),
  managedRetrievalIndexId: Joi.string().allow("").optional(),
}).when(
  Joi.object({ retrievalBackend: RetrievalBackend.BUDIBASE_VECTOR }).unknown(),
  {
    then: Joi.object(vectorKnowledgeBaseFields),
    otherwise: Joi.object(managedFileSearchKnowledgeBaseFields),
  }
)

const updateKnowledgeBaseSchema = Joi.object({
  _id: REQUIRED_STRING,
  _rev: REQUIRED_STRING,
  name: REQUIRED_STRING,
  retrievalBackend: Joi.string()
    .valid(
      RetrievalBackend.BUDIBASE_VECTOR,
      RetrievalBackend.MANAGED_FILE_SEARCH
    )
    .required(),
  embeddingModel: Joi.string().optional(),
  vectorDb: Joi.string().optional(),
  managedRetrievalProvider: Joi.string()
    .valid(ManagedRetrievalProvider.GOOGLE_FILE_SEARCH)
    .optional(),
  managedRetrievalIndexId: Joi.string().allow("").optional(),
})
  .when(
    Joi.object({
      retrievalBackend: RetrievalBackend.BUDIBASE_VECTOR,
    }).unknown(),
    {
      then: Joi.object({
        _id: REQUIRED_STRING,
        _rev: REQUIRED_STRING,
        ...vectorKnowledgeBaseFields,
      }).unknown(true),
      otherwise: Joi.object({
        _id: REQUIRED_STRING,
        _rev: REQUIRED_STRING,
        ...managedFileSearchKnowledgeBaseFields,
      }).unknown(true),
    }
  )
  .unknown(true)

const invalidKnowledgeBaseMessage =
  "Knowledge base payload is invalid for the selected retrieval backend"

const withKnowledgeBaseMessages = <T extends Joi.Schema>(schema: T): T => {
  return schema.messages({
    "any.unknown": invalidKnowledgeBaseMessage,
    "object.unknown": invalidKnowledgeBaseMessage,
  }) as T
}

export function createKnowledgeBaseValidator() {
  return auth.joiValidator.body(
    withKnowledgeBaseMessages(createKnowledgeBaseSchema)
  )
}

export function updateKnowledgeBaseValidator() {
  return auth.joiValidator.body(
    withKnowledgeBaseMessages(updateKnowledgeBaseSchema)
  )
}
