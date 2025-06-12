import { auth } from "@budibase/backend-core"
import Joi from "joi"

const OPTIONAL_STRING = Joi.string().optional().allow(null).allow("")
const OPTIONAL_ARRAY = Joi.array().optional().allow(null)

/**
 * Validator for chat agent requests
 */
export function chatAgentValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: OPTIONAL_STRING,
      _rev: OPTIONAL_STRING,
      title: OPTIONAL_STRING,
      messages: Joi.array()
        .items(
          Joi.object({
            role: Joi.string()
              .valid("system", "user", "assistant", "tool")
              .required(),
            content: Joi.string().allow("").allow(null),
            tool_calls: Joi.array()
              .items(
                Joi.object({
                  id: Joi.string().required(),
                  type: Joi.string().valid("function").required(),
                  function: Joi.object({
                    name: Joi.string().required(),
                    arguments: Joi.string().required(),
                  }).required(),
                })
              )
              .optional(),
            tool_call_id: OPTIONAL_STRING,
          })
        )
        .required(),
    })
  )
}

/**
 * Validator for creating tool source requests
 */
export function createToolSourceValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: OPTIONAL_STRING,
      _rev: OPTIONAL_STRING,
      type: Joi.string()
        .valid("BUDIBASE", "GITHUB", "CONFLUENCE", "BAMBOOHR")
        .required(),
      description: OPTIONAL_STRING,
      auth: Joi.object({
        apiKey: OPTIONAL_STRING,
        email: OPTIONAL_STRING,
        baseUrl: OPTIONAL_STRING,
        subdomain: OPTIONAL_STRING,
        guidelines: OPTIONAL_STRING,
      }).optional(),
      disabledTools: OPTIONAL_ARRAY.items(Joi.string()),
    }).unknown(true)
  )
}

/**
 * Validator for updating tool source requests
 */
export function updateToolSourceValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: Joi.string().required(),
      _rev: Joi.string().required(),
      type: Joi.string()
        .valid("BUDIBASE", "GITHUB", "CONFLUENCE", "BAMBOOHR")
        .required(),
      description: OPTIONAL_STRING,
      auth: Joi.object({
        apiKey: OPTIONAL_STRING,
        email: OPTIONAL_STRING,
        baseUrl: OPTIONAL_STRING,
        subdomain: OPTIONAL_STRING,
        guidelines: OPTIONAL_STRING,
      }).optional(),
      disabledTools: OPTIONAL_ARRAY.items(Joi.string()),
    }).unknown(true)
  )
}
