import { auth } from "@budibase/backend-core"
import { AIConfigType, WebSearchProvider } from "@budibase/types"
import Joi from "joi"

const OPTIONAL_STRING = Joi.string().optional().allow(null).allow("")
const REQUIRED_STRING = Joi.string().required()

const CONFIG_TYPE = Joi.string()
  .valid(...Object.values(AIConfigType))
  .optional()

const REASONING_EFFORT = Joi.string()
  .valid("low", "medium", "high")
  .optional()
  .allow(null)
  .allow("")

const CREDENTIALS_FIELDS = Joi.object()
  .pattern(Joi.string(), OPTIONAL_STRING)
  .required()

const WEB_SEARCH_CONFIG = Joi.object({
  provider: Joi.string()
    .valid(...Object.values(WebSearchProvider))
    .required(),
  apiKey: REQUIRED_STRING,
})
  .optional()
  .allow(null)
const IS_DEFAULT = Joi.boolean().optional()

export function createAIConfigValidator() {
  return auth.joiValidator.body(
    Joi.object({
      name: REQUIRED_STRING,
      provider: REQUIRED_STRING,
      model: REQUIRED_STRING,
      credentialsFields: CREDENTIALS_FIELDS,
      webSearchConfig: WEB_SEARCH_CONFIG,
      configType: CONFIG_TYPE,
      reasoningEffort: REASONING_EFFORT,
      isDefault: IS_DEFAULT,
      liteLLMModelId: OPTIONAL_STRING,
    }).unknown(true)
  )
}

export function updateAIConfigValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: REQUIRED_STRING,
      _rev: REQUIRED_STRING,
      name: REQUIRED_STRING,
      provider: REQUIRED_STRING,
      model: REQUIRED_STRING,
      credentialsFields: CREDENTIALS_FIELDS,
      webSearchConfig: WEB_SEARCH_CONFIG,
      configType: CONFIG_TYPE,
      reasoningEffort: REASONING_EFFORT,
      isDefault: IS_DEFAULT,
      liteLLMModelId: OPTIONAL_STRING,
    }).unknown(true)
  )
}
