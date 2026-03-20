import { auth } from "@budibase/backend-core"
import {
  KnowledgeSourceProvider,
  KnowledgeSourceSyncStatus,
} from "@budibase/types"
import Joi from "joi"

const REQUIRED_STRING = Joi.string().required()
const providerSchema = Joi.string()
  .valid(...Object.values(KnowledgeSourceProvider))
  .required()
const syncStatusSchema = Joi.string()
  .valid(...Object.values(KnowledgeSourceSyncStatus))
  .optional()

const optionalSyncSchema = Joi.object({
  enabled: Joi.boolean().optional(),
  intervalHours: Joi.number().integer().min(1).optional(),
  lastRunAt: Joi.string().optional(),
  lastSuccessAt: Joi.string().optional(),
  lastStatus: syncStatusSchema,
  lastError: Joi.string().allow("").optional(),
}).optional()

const optionalAuthSchema = Joi.object({
  oauth2ConfigId: Joi.string().allow("").optional(),
  externalConnectionId: Joi.string().allow("").optional(),
}).optional()

const optionalScopeSchema = Joi.object().optional()

const knowledgeSourceFields = {
  knowledgeBaseId: REQUIRED_STRING,
  name: REQUIRED_STRING,
  provider: providerSchema,
  scope: optionalScopeSchema,
  auth: optionalAuthSchema,
  sync: optionalSyncSchema,
}

export function createKnowledgeSourceValidator() {
  return auth.joiValidator.body(Joi.object(knowledgeSourceFields))
}

export function updateKnowledgeSourceValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: REQUIRED_STRING,
      _rev: REQUIRED_STRING,
      ...knowledgeSourceFields,
    }).unknown(true)
  )
}
