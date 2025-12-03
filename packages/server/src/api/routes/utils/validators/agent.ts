import { auth } from "@budibase/backend-core"
import { ToolSourceType } from "@budibase/types"
import Joi from "joi"

const OPTIONAL_STRING = Joi.string().optional().allow(null).allow("")
const OPTIONAL_ARRAY = Joi.array().optional().allow(null)

/**
 * Helper function to create auth validation based on tool source type
 */
function getAuthValidation() {
  return Joi.when("type", {
    switch: [
      {
        is: "BUDIBASE",
        then: Joi.object({
          guidelines: OPTIONAL_STRING,
        }).optional(),
      },
      {
        is: "REST_QUERY",
        then: Joi.object({
          guidelines: OPTIONAL_STRING,
        }).optional(),
      },
    ],
  })
}

/**
 * Validator for creating tool source requests
 */
export function createToolSourceValidator() {
  return auth.joiValidator.body(
    Joi.object({
      id: OPTIONAL_STRING,
      agentId: Joi.string().required(),
      type: Joi.string()
        .valid(ToolSourceType.BUDIBASE, ToolSourceType.REST_QUERY)
        .required(),
      description: OPTIONAL_STRING,
      disabledTools: OPTIONAL_ARRAY.items(Joi.string()),
      auth: getAuthValidation(),
    }).unknown(true)
  )
}

/**
 * Validator for updating tool source requests
 */
export function updateToolSourceValidator() {
  return auth.joiValidator.body(
    Joi.object({
      id: Joi.string().required(),
      agentId: Joi.string().required(),
      type: Joi.string()
        .valid(ToolSourceType.BUDIBASE, ToolSourceType.REST_QUERY)
        .required(),
      description: OPTIONAL_STRING,
      disabledTools: OPTIONAL_ARRAY.items(Joi.string()),
      auth: getAuthValidation(),
    }).unknown(true)
  )
}

export function createAgentValidator() {
  return auth.joiValidator.body(
    Joi.object({
      name: Joi.string().required(),
      description: OPTIONAL_STRING,
      aiconfig: Joi.string().required(),
      promptInstructions: OPTIONAL_STRING,
      allowedTools: OPTIONAL_ARRAY.items(Joi.object().unknown(true)),
      live: Joi.boolean().optional(),
      goal: OPTIONAL_STRING,
      icon: OPTIONAL_STRING,
      iconColor: OPTIONAL_STRING,
    })
  )
}

export function updateAgentValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: Joi.string().required(),
      _rev: Joi.string().required(),
      name: Joi.string().required(),
      description: OPTIONAL_STRING,
      aiconfig: Joi.string().required(),
      promptInstructions: OPTIONAL_STRING,
      allowedTools: OPTIONAL_ARRAY.items(Joi.object().unknown(true)),
      live: Joi.boolean().optional(),
      goal: OPTIONAL_STRING,
      icon: OPTIONAL_STRING,
      iconColor: OPTIONAL_STRING,
    }).unknown(true)
  )
}
